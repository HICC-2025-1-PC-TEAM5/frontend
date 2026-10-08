// src/pages/UserContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearAccessToken,
  clearLegacyAuthStorage,
  setAccessToken,
  subscribeAccessToken,
} from '../lib/api';
import { logoutSession, restoreSession } from '../lib/auth';

const UserContext = createContext(null);

// 토큰과 프로필은 저장하지 않는다 (D-036). 앱을 열 때마다 refresh 쿠키로 세션을 복원한다
// status: 'checking'(복원 중) → 'authed' | 'guest'

function toUser(profile = {}) {
  return {
    username: profile.username ?? profile.name ?? '',
    photoUrl: profile.photoUrl ?? profile.picture ?? '',
    email: profile.email ?? '',
    id: profile.id != null ? String(profile.id) : '',
  };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking');
  const [restoreError, setRestoreError] = useState('');

  // refresh 실패 등으로 api.js가 토큰을 잃으면 화면도 로그아웃 상태로 바꾼다
  useEffect(
    () =>
      subscribeAccessToken((token) => {
        if (token) return;
        setUser(null);
        setStatus('guest');
      }),
    []
  );

  // 앱 시작: 예전 저장 키를 지우고 refresh 쿠키로 세션 복원
  useEffect(() => {
    let ignore = false;
    clearLegacyAuthStorage();
    (async () => {
      try {
        const session = await restoreSession();
        if (ignore) return;
        if (session) {
          setAccessToken(session.access);
          setUser(toUser(session.profile));
          setStatus('authed');
        } else {
          setStatus('guest');
        }
      } catch (e) {
        if (ignore) return;
        setRestoreError(e.message);
        setStatus('guest');
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  /* ---------- 액션들 ---------- */

  /** 로그인: login(access, { id, username, email, photoUrl }) */
  const login = (access, profile = {}) => {
    if (!access) return;
    setAccessToken(access);
    setUser((prev) => ({
      ...(prev || {}),
      ...toUser({ ...prev, ...profile }),
    }));
    setRestoreError('');
    setStatus('authed');
  };

  /** OAuth 콜백 JSON을 한 번에 반영 ({ user, tokens: { accessToken } }) */
  const applyOAuthResponse = (payload = {}) => {
    login(payload.tokens?.accessToken, payload.user || {});
  };

  /**
   * 로그아웃: 서버에서 이 기기의 refresh 토큰을 지운 뒤 메모리를 비운다 (D-037).
   * 서버 호출이 실패하면 던지고 로그인 상태를 유지한다(쿠키가 남아 새로고침 때 다시 로그인되기 때문)
   */
  const logout = async () => {
    await logoutSession();
    clearAccessToken();
    setUser(null);
    setStatus('guest');
  };

  // 단일 필드 세터 (메모리만 바뀐다)
  const setUsername = (name = '') =>
    setUser((prev) => ({ ...(prev || toUser()), username: name }));

  const value = useMemo(
    () => ({
      // 상태
      user,
      status,
      isChecking: status === 'checking',
      isAuthed: status === 'authed',
      restoreError,
      username: user?.username || '',
      photoUrl: user?.photoUrl || '',
      email: user?.email || '',
      id: user?.id || '',

      // 액션
      login,
      logout,
      applyOAuthResponse,
      setUsername,
    }),
    // 액션은 setState만 쓰므로 상태가 바뀔 때만 새로 만든다
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, status, restoreError]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
