// src/pages/UserContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext(null);

const STORAGE_KEY = "user";

// 로컬스토리지에서 사용자 복원
function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return {
      token: user.token || "",
      username: user.username || "",
      email: user.email || "",
      photoUrl: user.photoUrl || "",
      id: user.id ? String(user.id) : "",
    };
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => loadUserFromStorage());

  // 로컬스토리지 저장/정리
  const persist = (next) => {
    if (!next) return localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    persist(user);
  }, [user]);

  // ====== 액션 ======

  // OAuth 응답(JSON) 한 방에 처리
  const applyOAuthResponse = (payload = {}) => {
    const u = payload.user || {};
    const t = payload.tokens?.accessToken || "";
    setUser({
      token: t,
      username: u.name || "",
      email: u.email || "",
      photoUrl: u.picture || "",
      id: u.id ? String(u.id) : "",
    });
  };

  // 직접 login(token, profile)
  const login = (token, profile = {}) => {
    setUser({
      token: token || "",
      username: profile.username || "",
      email: profile.email || "",
      photoUrl: profile.photoUrl || "",
      id: profile.id ? String(profile.id) : "",
    });
  };

  

  const logout = () => setUser(null);

  // 단일 필드 세터
  const setUsername = (username = "") =>
    setUser((prev) => ({ ...(prev || { token: "" }), username }));
  const setEmail = (email = "") =>
    setUser((prev) => ({ ...(prev || { token: "" }), email }));
  const setPhotoUrl = (photoUrl = "") =>
    setUser((prev) => ({ ...(prev || { token: "" }), photoUrl }));
  const setId = (id = "") =>
    setUser((prev) => ({ ...(prev || { token: "" }), id: String(id) }));

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user?.token,
      token: user?.token || "",
      username: user?.username || "",
      email: user?.email || "",
      photoUrl: user?.photoUrl || "",
      id: user?.id || "",
      // 액션
      login,
      logout,
      applyOAuthResponse,
      setUsername,
      setEmail,
      setPhotoUrl,
      setId,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
