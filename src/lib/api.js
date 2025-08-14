// src/lib/api.js
import axios from 'axios';

// ----- 기본 설정 -----
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 로컬스토리지 토큰 헬퍼 (키 이름을 'accessToken'으로 통일)
export function getAccessToken() {
  return localStorage.getItem('accessToken') || null;
}
export function setAccessToken(token) {
  if (token) localStorage.setItem('accessToken', token);
}
export function clearAccessToken() {
  localStorage.removeItem('accessToken');
}

// Axios 인스턴스
const api = axios.create({
  baseURL: BASE_URL, // 서버 주소
  timeout: 10000, // 10초 타임아웃
  withCredentials: true, // refresh_token 쿠키 주고받기
});

// ----- 요청 인터셉터: Authorization 자동 첨부 -----
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----- 응답 인터셉터: 401이면 한 번 자동 리프레시 후 재시도 -----
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config || {};
    const alreadyRetried = original.__isRetryRequest;

    if (status === 401 && !alreadyRetried) {
      try {
        // 중복 요청 방지: 동시에 401이 여러 개 떠도 리프레시 1번만 수행
        if (!refreshPromise) {
          refreshPromise = api.post('/api/auth/refresh'); // 쿠키 기반 리프레시
        }
        const r = await refreshPromise;
        // 백엔드 응답 형태 명세: { data: { access: '<NEW_ACCESS_JWT>' } }
        const newAccess =
          r?.data?.data?.access || r?.data?.tokens?.accessToken || null;

        if (newAccess) setAccessToken(newAccess);

        // 원래 요청 재시도
        original.__isRetryRequest = true;
        return api(original);
      } catch (e) {
        // 리프레시 실패: 토큰 제거
        clearAccessToken();
        return Promise.reject(e);
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

// ----- fetch 기반 도우미 (선택) -----
// axios 말고 fetch + 수동 timeout이 필요할 때 사용 가능
export async function apiFetch(
  path,
  { method = 'GET', body, timeout = 10000, headers = {} } = {}
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  // 헤더: FormData면 Content-Type 자동 설정되므로 지정하지 않음
  const token = getAccessToken();
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  const mergedHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: mergedHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      credentials: 'include', // 쿠키 사용 시 필요
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      const err = new Error(msg || `요청 실패 (${res.status})`);
      err.status = res.status;
      throw err;
    }

    // 204 No Content
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
