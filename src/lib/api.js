// src/lib/api.js
import axios from 'axios';

/* ===========================
   기본 설정 / 토큰 헬퍼
=========================== */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function getAccessToken() {
  return localStorage.getItem('accessToken') || null;
}
export function setAccessToken(token) {
  if (token && typeof token === 'string') {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}
export function clearAccessToken() {
  localStorage.removeItem('accessToken');
}

/* ===========================
   axios 인스턴스
   - api: 일반 요청용
   - auth: 리프레시 등 인증용(인터셉터 최소화)
=========================== */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // refresh 쿠키 전송
});

const auth = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

/* ===========================
   요청 인터셉터 (api 전용)
   - 필요 시 Authorization 자동첨부
=========================== */
api.interceptors.request.use((config) => {
  // 명시적으로 skipAuth 플래그가 있으면 토큰 붙이지 않음
  if (config.skipAuth) return config;

  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===========================
   응답 인터셉터 (api 전용)
   - 401 => refresh 1회 후 재시도
   - refresh 호출 자체는 제외
=========================== */
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config || {};

    // 이미 재시도한 요청은 그대로 실패 처리
    if (original.__isRetryRequest) {
      return Promise.reject(error);
    }

    // refresh 엔드포인트 자체나, skipRefresh 요청은 제외
    const isRefreshCall = String(original.url || '').includes(
      '/api/auth/refresh'
    );
    const skipRefresh = original._skipRefresh === true;

    if (status === 401 && !isRefreshCall && !skipRefresh) {
      try {
        // 동시 401 요청 방지: 한 번만 refresh 수행
        if (!refreshPromise) {
          // auth 인스턴스로 호출 (api 인터셉터 영향 배제)
          refreshPromise = auth.post('/api/auth/refresh'); // 쿠키 기반 리프레시
        }
        const r = await refreshPromise;

        // 백엔드 응답 케이스: { data: { access } } 또는 { tokens: { accessToken } }
        const newAccess =
          r?.data?.data?.access || r?.data?.tokens?.accessToken || null;

        if (!newAccess) {
          throw new Error('no_access_in_refresh');
        }

        setAccessToken(newAccess);

        // 원래 요청 재시도 (이 요청에는 토큰이 자동으로 붙음)
        original.__isRetryRequest = true;
        // 혹시 수동 헤더가 남아있으면 갱신
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;

        return api(original);
      } catch (e) {
        // 리프레시 실패: 토큰 제거 및 상위에서 로그인 화면으로 유도
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
   선택: fetch 기반 도우미
   - FormData면 Content-Type 자동
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

  const mergedHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: mergedHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(id);

    if (res.status === 401 && !skipRefresh) {
      // fetch 경로로 온 401도 1회 리프레시 후 재시도
      try {
        const r = await auth.post('/api/auth/refresh');
        const newAccess =
          r?.data?.data?.access || r?.data?.tokens?.accessToken || null;
        if (!newAccess) throw new Error('no_access_in_refresh');
        setAccessToken(newAccess);

        // 재시도
        const retryRes = await fetch(`${BASE_URL}${path}`, {
          method,
          headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(skipAuth ? {} : { Authorization: `Bearer ${newAccess}` }),
            ...headers,
          },
          body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
          credentials: 'include',
        });
        if (!retryRes.ok) {
          const msg = await retryRes.text().catch(() => '');
          const err = new Error(msg || `요청 실패 (${retryRes.status})`);
          err.status = retryRes.status;
          throw err;
        }
        if (retryRes.status === 204) return null;
        return retryRes.json();
      } catch (e) {
        clearAccessToken();
        throw e;
      }
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      const err = new Error(msg || `요청 실패 (${res.status})`);
      err.status = res.status;
      throw err;
    }

    if (res.status === 204) return null;
    return res.json();
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      const e = new Error('요청 시간 초과');
      e.status = 408;
      throw e;
    }
    throw err;
  }
}

export default api;
