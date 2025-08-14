// src/pages/UserContext.jsx
import { createContext, useContext, useMemo, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setIsAuthed(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthed(false);
    // 서버에서 refresh_token 삭제 요청
    fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  };

  const value = useMemo(
    () => ({ user, isAuthed, login, logout }),
    [user, isAuthed]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);

const API = 'http://localhost:8080'; // 필요 시 .env로 관리
