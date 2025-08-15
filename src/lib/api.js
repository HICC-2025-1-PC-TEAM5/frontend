// src/lib/api.js
import axios from 'axios';

/* ===========================
  기본 설정 / BASE_URL (뒤 슬래시 제거로 // 방지)
=========================== */
const RAW_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://cookittoday.duckdns.org';
const BASE_URL = String(RAW_BASE).replace(/\/+$/, ''); // <- 정규화

/* ===========================
  토큰 스토리지 유틸 (호환 보장)
  - 우선순위: localStorage.user.token → token → accessToken
  - set 시 user.token / token / accessToken 모두 갱신
=========================== */
function readUserObj() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeUserObj(next) {
  try {
    localStorage.setItem('user', JSON.stringify(next || {}));
  } catch {}
}

export function getAccessToken() {
  const user = readUserObj();
  return (
    (user && typeof user.token === 'string' && user.token) ||
    localStorage.getItem('token') || // 레거시 호환
    localStorage.getItem('accessToken') ||
    null
  );
}

export function setAccessToken(token) {
  // 문자열이 아니면 제거 동작으로 처리
  if (!token || typeof token !== 'string') return clearAccessToken();

  // 1) user.token 동기화
  const user = readUserObj() || {};
  user.token = token;
  writeUserObj(user);

  // 2) 레거시/타모듈 호환 키 갱신
  localStorage.setItem('accessToken', token);
  localStorage.setItem('token', token);
}

export function clearAccessToken() {
  // 1) user.token 제거
  const user = readUserObj();
  if (user && user.token) {
    delete user.token;
    writeUserObj(user);
  }
  // 2) 키 정리
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
}

/* ===========================
   axios 인스턴스
   - api: 일반 요청용(요청/응답 인터셉터)
   - auth: 리프레시 전용(최소 설정)
=========================== */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // refresh 쿠키 포함
});

const auth = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

/* ===========================
   요청 인터셉터 (api 전용)
   - Authorization: Bearer 자동첨부 (config.skipAuth === true 면 생략)
=========================== */
api.interceptors.request.use((config) => {
  if (config.skipAuth) return config;
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ===========================
   응답 인터셉터 (api 전용)
   - 401/419이면 /api/auth/refresh 1회 호출 후 원요청 재시도
   - refresh 자신이거나 _skipRefresh === true 면 제외
   - 동시 401/419는 refreshPromise로 한번만 처리
=========================== */
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config || {};

    // 이미 재시도된 요청은 그대로 실패
    if (original.__isRetryRequest) return Promise.reject(error);

    const isRefreshCall = String(original.url || '').includes(
      '/api/auth/refresh'
    );
    const skipRefresh = original._skipRefresh === true;

    const shouldRefresh =
      (status === 401 || status === 419) && !isRefreshCall && !skipRefresh;

    if (shouldRefresh) {
      try {
        if (!refreshPromise) {
          refreshPromise = auth.post('/api/auth/refresh');
        }
        const r = await refreshPromise;

        // 백엔드 응답 케이스 커버
        const newAccess =
          r?.data?.data?.access || r?.data?.tokens?.accessToken || null;

        if (!newAccess) throw new Error('no_access_in_refresh');

        setAccessToken(newAccess);

        // 원요청 재시도
        original.__isRetryRequest = true;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;

        return api(original);
      } catch (e) {
        clearAccessToken();
        return Promise.reject(e);
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

/* ===========================
   fetch 기반 도우미 (선택)
   - FormData면 Content-Type 자동 생략
   - 401/419 시 1회 리프레시 후 재시도
   - 옵션:
     - skipAuth: Authorization 헤더 생략
     - skipRefresh: 401/419여도 리프레시/재시도 하지 않음
=========================== */
export async function apiFetch(
  path,
  {
    method = 'GET',
    body,
    timeout = 10000,
    headers = {},
    skipAuth = false,
    skipRefresh = false,
  } = {}
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const token = getAccessToken();
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  const doFetch = async (accessOverride) => {
    const hdrs = {
      // FormData일 땐 Content-Type 자동설정(생략)
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      // 서버가 text로 "OK"를 줄 수도 있으니 Accept 범위 넓게
      Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
      ...(!skipAuth && (accessOverride || token)
        ? { Authorization: `Bearer ${accessOverride || token}` }
        : {}),
      ...headers,
    };
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: hdrs,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      credentials: 'include',
      signal: controller.signal,
    });
    return res;
  };

  // 응답 본문 파서(성공 케이스)
  const parseOkBody = async (res) => {
    if (res.status === 204) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();

    // JSON이면 json()
    if (ct.includes('application/json')) {
      return res.json();
    }

    // 텍스트면 text()
    const text = await res.text();

    // 서버가 "OK"만 주는 경우 → 통일된 형태로 반환
    if (text && text.trim().toLowerCase() === 'ok') {
      return { ok: true };
    }

    // 그 외 텍스트는 그대로 반환 (필요하면 상위에서 사용)
    return text;
  };

  // 응답 본문 파서(오류 케이스)
  const parseErrBody = async (res) => {
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    try {
      if (ct.includes('application/json')) {
        return await res.json();
      }
      return await res.text();
    } catch {
      return null;
    }
  };

  try {
    let res = await doFetch();

    // 401/419 처리 (리프레시 1회)
    if ((res.status === 401 || res.status === 419) && !skipRefresh) {
      try {
        const r = await auth.post('/api/auth/refresh');
        const newAccess =
          r?.data?.data?.access || r?.data?.tokens?.accessToken || null;
        if (!newAccess) throw new Error('no_access_in_refresh');
        setAccessToken(newAccess);

        res = await doFetch(newAccess);
      } catch (e) {
        clearAccessToken();
        throw e;
      }
    }

    // 최종 상태코드 평가
    if (!res.ok) {
      const data = await parseErrBody(res);
      const msg =
        (typeof data === 'string' && data) ||
        (data && (data.message || data.error || JSON.stringify(data))) ||
        '';
      const err = new Error(msg || `요청 실패 (${res.status})`);
      err.status = res.status;
      err.data = data ?? null;
      throw err;
    }

    // 성공 파싱
    return await parseOkBody(res);
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error('요청 시간 초과');
      e.status = 408;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export default api;
