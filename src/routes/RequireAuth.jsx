import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../pages/UserContext';

export default function RequireAuth({ children }) {
  const { isAuthed } = useUser();
  const loc = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}
