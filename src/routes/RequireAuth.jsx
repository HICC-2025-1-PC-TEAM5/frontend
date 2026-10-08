import { Navigate, useLocation } from 'react-router';
import { useUser } from '../pages/UserContext';

export default function RequireAuth({ children }) {
  const { isAuthed, isChecking } = useUser();
  const loc = useLocation();
  // 토큰을 저장하지 않아(D-036) 새로고침 직후에는 세션 복원이 끝날 때까지 기다린다
  if (isChecking) {
    return <p style={{ padding: '1rem' }}>로그인 확인 중…</p>;
  }
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}
