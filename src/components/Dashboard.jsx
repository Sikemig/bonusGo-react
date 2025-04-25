import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/auth/token/info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(data);
      } catch {
        navigate('/login');
      }
    };
    fetchInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h2>Bienvenido al Dashboard</h2>
        {userInfo && (
          <div className="mt-4">
            <p><strong>Correo:</strong> {userInfo.correo}</p>
            <p><strong>Rol:</strong> {userInfo.rol}</p>
          </div>
        )}
        <button className="btn btn-danger mt-3" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}
