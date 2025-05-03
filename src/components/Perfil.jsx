import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function Perfil() {
  const { user, logout, token } = useAuth();
  const [detalleUsuario, setDetalleUsuario] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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
      setFormData({
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        correo: response.data.correo,
        telefono: response.data.telefono
      });
    } catch (error) {
      console.error('Error al obtener detalle del usuario:', error.response?.status, error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      await axios.put(
        `http://localhost:8080/usuario/actualizarPerfil/${user.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setSuccessMessage("Perfil actualizado con éxito");
      fetchDetalleUsuario();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error al actualizar usuario:", error.response?.data || error.message);
    }
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

      <div className="bienvenida">PERFIL DE USUARIO</div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      {/* Tabla de perfil */}
      <div className="table-responsive mt-4">
        <table className="table">
          <tbody>
            <tr><th>Nombre</th><td>{detalleUsuario.nombre}</td></tr>
            <tr><th>Apellido</th><td>{detalleUsuario.apellido}</td></tr>
            <tr><th>Email</th><td>{detalleUsuario.correo}</td></tr>
            <tr><th>Teléfono</th><td>{detalleUsuario.telefono}</td></tr>
            <tr><th>PigCoins</th><td>{detalleUsuario.moneda}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Botones */}
      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Editar</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Perfil</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={handleGuardar}>Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer mt-4">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}