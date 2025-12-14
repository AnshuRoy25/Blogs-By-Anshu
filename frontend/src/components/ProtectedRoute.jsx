import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ element }) {
  const { isAdmin } = useAuth();  // Get directly from context
  
  if (!isAdmin) return <Navigate to="/" replace />;
  return element;
}

export default ProtectedRoute;
