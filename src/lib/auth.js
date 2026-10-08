// src/lib/auth.js — 로그인·세션 복원 (C7)
// 서버 주소는 lib/api.js의 BASE_URL(VITE_API_BASE_URL)을 쓴다. 하드코딩하지 않는다
import api, { BASE_URL } from './api';

/** 구글 로그인 시작 URL. 백엔드가 구글로 보냈다가 main-url?from=oauth 로 돌려보낸다 (AGENTS.md 5.1) */
export function googleLoginUrl() {
  return `${BASE_URL}/api/v2/oauth2/google`;
}

// 앱 시작(UserContext)과 로그인 화면이 동시에 불러도 refresh는 한 번만 보낸다.
// refresh는 토큰을 교체하므로 두 번 보내면 늦게 간 요청이 이미 바뀐 쿠키를 쓸 수 있다 (D-036)
let restoring = null;
/**
 * refresh_token 쿠키로 access 토큰을 받고 내 정보를 조회한다.
 * 쿠키가 없거나 만료됐으면 null (로그인 화면을 그대로 보여 주면 된다)
 * @returns {Promise<null | { access: string, profile: { id, email, name, picture } }>}
 */
export function restoreSession() {
  if (!restoring) {
    restoring = doRestoreSession().finally(() => {
      restoring = null;
    });
  }
  return restoring;
}

async function doRestoreSession() {
  try {
    const { data } = await api.post('/api/auth/refresh', null, {
      _skipRefresh: true,
    });
    const access = data?.data?.access;
    if (!access) return null;

    const me = await api.get('/api/users/me', {
      headers: { Authorization: `Bearer ${access}` },
      _skipRefresh: true,
    });
    return { access, profile: me.data?.data ?? {} };
  } catch (err) {
    if (err?.response?.status === 401) return null;
    const e = new Error(
      '로그인 상태를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.'
    );
    e.status = err?.response?.status ?? 0;
    throw e;
  }
}
