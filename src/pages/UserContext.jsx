// src/pages/UserContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext(null);

// 로컬스토리지 복원(구버전 키도 함께 읽어 마이그레이션)
function loadUserFromStorage() {
  try {
    const merged = {};
    // 신버전(권장)
    const raw = localStorage.getItem('user');
    if (raw) Object.assign(merged, JSON.parse(raw));

    // 구버전 키(이전 코드 호환)
    const legacyToken = localStorage.getItem('token');
    const legacyName = localStorage.getItem('username');
    if (legacyToken) merged.token = legacyToken;
    if (legacyName) merged.username = legacyName;

    // 정리
    const user = {
      token: merged.token || '',
      username: merged.username || '',
      photoUrl: merged.photoUrl || '',
      email: merged.email || '',
      id: merged.id ? String(merged.id) : '',
    };
    // 최소 한 항목이라도 있으면 객체, 아니면 null
    const hasSomething = Object.values(user).some((v) => !!v);
    return hasSomething ? user : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => loadUserFromStorage());

  // 저장 헬퍼
  const persist = (next) => {
    if (!next) {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // 구키 정리
      localStorage.removeItem('username');
      return;
    }
    localStorage.setItem('user', JSON.stringify(next));
    // 구키도 함께 써주면(선택) 레거시 코드가 있어도 안전
    if (next.token) localStorage.setItem('token', next.token);
    if (next.username) localStorage.setItem('username', next.username);
  };

  // user 바뀔 때마다 저장(보수용)
  useEffect(() => {
    if (user) persist(user);
  }, [user]);

  // ====== 액션들 ======

  /** 이메일/이름/사진/멤버ID 등을 OAuth 응답의 user 객체로부터 주입 */
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
      persist(next);
      return next;
    });
  };

  /** 토큰 + (옵션) 프로필 일부를 함께 세팅 */
  const login = (token, profile = {}) => {
    setUser((prev) => {
      const base = prev || {};
      const next = {
        token: token || '',
        username: profile.username ?? base.username ?? '',
        photoUrl: profile.photoUrl ?? base.photoUrl ?? '',
        email: profile.email ?? base.email ?? '',
        id: profile.id ? String(profile.id) : (base.id ?? ''),
      };
      persist(next);
      return next;
    });
  };

  /** OAuth 콜백(JSON) 한 방에 반영할 때 편한 헬퍼 */
  const applyOAuthResponse = (payload = {}) => {
    const u = payload.user || {};
    const t = payload.tokens?.accessToken || '';
    // 1) 프로필
    setUserFromOAuth({
      id: u.id,
      name: u.name,
      email: u.email,
      picture: u.picture,
    });
    // 2) 토큰
    if (t) {
      setUser((prev) => {
        const next = { ...(prev || {}), token: t };
        persist(next);
        return next;
      });
    }
  };

  /** 로그아웃: 모든 로컬 정보 정리 */
  const logout = () => {
    setUser(null);
    persist(null);
  };

  // 단일 필드 세터들(필요시 개별 수정)
  const setUsername = (name = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), username: name };
      persist(next);
      return next;
    });

  const setPhotoUrl = (url = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), photoUrl: url };
      persist(next);
      return next;
    });

  const setEmail = (addr = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), email: addr };
      persist(next);
      return next;
    });

  const setId = (id = '') =>
    setUser((prev) => {
      const next = { ...(prev || { token: '' }), id: String(id) };
      persist(next);
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
      applyOAuthResponse, // 콜백 응답 핸들링용
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
