import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Wraps any route that requires login
// If no token → redirect to /login
export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}