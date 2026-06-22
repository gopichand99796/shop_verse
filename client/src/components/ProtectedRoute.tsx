import { Navigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth((s) => ({ token: s.token, loading: s.loading }));
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
