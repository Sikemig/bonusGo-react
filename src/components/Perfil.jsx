import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function Perfil() {
  const { user, logout, token } = useAuth();
  const [detalleUsuario, setDetalleUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      fetchDetalleUsuario();
    }
  }, [user, token]);

  const fetchDetalleUsuario = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/usuario/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetalleUsuario(response.data);
    } catch (error) {
      console.error('Error al obtener detalle del usuario:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!detalleUsuario) return <p>Cargando perfil...</p>;

  return (
    <>
      {/* NAV */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" />
        </div>
      </nav>

      {/* Perfil Info */}
      <div className="bienvenida">PERFIL DE USUARIO</div>

      <div className="table-responsive mt-4">
        <table className="table">
          <tbody>
            <tr>
              <th>Nombre</th>
              <td>{detalleUsuario.nombre}</td>
            </tr>
            <tr>
              <th>Apellido</th>
              <td>{detalleUsuario.apellido}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{detalleUsuario.correo}</td>
            </tr>
            <tr>
              <th>Teléfono</th>
              <td>{detalleUsuario.telefono}</td>
            </tr>
            <tr>
              <th>Monedas (PigCoins)</th>
              <td>{detalleUsuario.moneda}</td>
            </tr>
            <tr>
              <th>Rol</th>
              <td>{detalleUsuario.rol.nombre.replace('ROLE_', '')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
