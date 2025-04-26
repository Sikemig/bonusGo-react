import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  // cogemos el token
  const token = localStorage.getItem('token');

  // si no hay token volvemos al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    // si hay token, vamos a la pagina deseada
    const decodedToken = jwtDecode(token);
    return children;

  } catch (error) {
    // si no, mostramos error y al login de vuelta
    console.error('Error al decodificar token:', error);
    return <Navigate to="/login" />;
  }
}
