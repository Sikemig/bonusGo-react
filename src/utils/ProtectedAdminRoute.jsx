import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedAdminRoute({ children }) {
    // comprobamos si hay token
  const token = localStorage.getItem('token');

  // si no lo hay, volvemos a login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // comprobamos el rol con jwt
  try {
    const decodedToken = jwtDecode(token);
    const { rol } = decodedToken;

    // si el rol no es admin impedimos el paso
    if (rol !== 'ROLE_ADMIN') {  
      return <Navigate to="/login" />;
    }

    // de lo contrario vamos a paginas de administrador
    return children;

  } catch (error) {
    // comprobamos si hay error de tokens y volvemos al login
    console.error('Error al decodificar token:', error);
    return <Navigate to="/login" />;
  }
}
