// src/pages/UserContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext(null);
const STORAGE_KEY = 'user';

/* ---------- 스토리지 복원 (신규+레거시 동시 지원) ---------- */
function loadUserFromStorage() {
  try {
    const merged = {};
    // 신규 키
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(merged, JSON.parse(raw));

    // 레거시 키들 (있으면 병합)
    const legacyToken = localStorage.getItem('token');
    const legacyUsername = localStorage.getItem('username');
    if (legacyToken) merged.token = merged.token || legacyToken;
    if (legacyUsername) merged.username = merged.username || legacyUsername;

    const user = {
      token: merged.token || '',
      username: merged.username || '',
      photoUrl: merged.photoUrl || '',
      email: merged.email || '',
      id: merged.id ? String(merged.id) : '',
    };

    const hasSomething = Object.values(user).some(Boolean);
    return hasSomething ? user : null;
  } catch {
    return null;
  }
}

/* ---------- 스토리지 저장/정리 ---------- */
function persistUser(next) {
  if (!next) {
    localStorage.removeItem(STORAGE_KEY);
    // 레거시 키 정리
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  // 레거시 키도 함께 써서 하위 코드 안전
  if (next.token) localStorage.setItem('token', next.token);
  if (next.username) localStorage.setItem('username', next.username);
  if (next.id) localStorage.setItem('userId', String(next.id));
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => loadUserFromStorage());

  // 변경 시 저장
  useEffect(() => {
    if (user) persistUser(user);
  }, [user]);

  /* ---------- 액션들 ---------- */

  /** OAuth 응답에서 프로필만 먼저 반영할 때 유용 */
  const setUserFromOAuth = (oauthUser = {}) => {
    setUser((prev) => {
      const base = prev || {};
      const next = {
        token: base.token || '',
        username: oauthUser.name ?? base.username ?? '',
        photoUrl: oauthUser.picture ?? base.photoUrl ?? '',
        email: oauthUser.email ?? base.email ?? '',
        id: oauthUser.id ? String(oauthUser.id) : (base.id ?? ''),
      };
      persistUser(next);
      return next;
    });
  };

  /** OAuth 콜백 JSON을 한 번에 반영 (권장) */
  const applyOAuthResponse = (payload = {}) => {
    const u = payload.user || {};
    const t = payload.tokens?.accessToken || '';

    // 1) 프로필 반영
    setUserFromOAuth({
      id: u.id,
      name: u.name,
      email: u.email,
      picture: u.picture,
    });

    // 2) 토큰 반영
    if (t) {
      setUser((prev) => {
        const next = { ...(prev || {}), token: t };
        persistUser(next);
        return next;
      });
    }
  };

  /**
   * 로그인 (하위 호환):
   *  - login(token, profile)
   *  - login({ token, username, email, photoUrl, id })
   */
  const login = (arg1, profile = {}) => {
    // 객체 한 방에 넘기는 레거시/다른 호출부 호환
    if (typeof arg1 === 'object' && arg1) {
      const obj = arg1;
      const token = obj.token || obj.access || ''; // access로 넘기는 코드 대비
      setUser((prev) => {
        const base = prev || {};
        const next = {
          token: token || base.token || '',
          username: obj.username ?? base.username ?? '',
          photoUrl: obj.photoUrl ?? obj.picture ?? base.photoUrl ?? '',
          email: obj.email ?? base.email ?? '',
          id: obj.id ? String(obj.id) : (base.id ?? ''),
        };
        persistUser(next);
        return next;
      });
      return;
    }

    // 문자열 토큰 + 선택 프로필
    const token = arg1 || '';
    setUser((prev) => {
      const base = prev || {};
      const next = {
        token,
        username: profile.username ?? base.username ?? '',
        photoUrl: profile.photoUrl ?? base.photoUrl ?? '',
        email: profile.email ?? base.email ?? '',
        id: profile.id ? String(profile.id) : (base.id ?? ''),
      };
      persistUser(next);
      return next;
    });
  };

  /** 로그아웃 */
  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  // 단일 필드 세터
  const setUsername = (name = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), username: name };
      persistUser(next);
      return next;
    });

  const setPhotoUrl = (url = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), photoUrl: url };
      persistUser(next);
      return next;
    });

  const setEmail = (addr = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), email: addr };
      persistUser(next);
      return next;
    });

  const setId = (id = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), id: String(id) };
      persistUser(next);
      return next;
    });

  const value = useMemo(
    () => ({
      // 상태
      user,
      isAuthed: !!user?.token,
      token: user?.token || '',
      username: user?.username || '',
      photoUrl: user?.photoUrl || '',
      email: user?.email || '',
      id: user?.id || '',

      // 액션
      login,
      logout,
      setUserFromOAuth,
      applyOAuthResponse,
      setUsername,
      setPhotoUrl,
      setEmail,
      setId,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
