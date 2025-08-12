import { Navigate, useLocation } from 'react-router';
import { useUser } from '../pages/UserContext';

export default function RequireAuth({ children }) {
  const { isAuthed } = useUser();
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
