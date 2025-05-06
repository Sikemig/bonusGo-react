import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/perfil.css';

import { Navbar, Container, Button } from 'react-bootstrap';

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
  
  const historial = () => {
    navigate('/historial');
  };

  if (!detalleUsuario) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
            <strong>BonusGo</strong>
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white fw-semibold">Hola, {detalleUsuario.nombre}</span>
            <Button className="btn-perfil" onClick={handleLogout}>Cerrar sesión</Button>
          </div>
        </Container>
      </Navbar>

      <div className="perfil-container">
        {/* Título */}
        <div className="bienvenida">PERFIL DE USUARIO</div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="alert alert-success text-center" role="alert">
            {successMessage}
          </div>
        )}

        {/* Información de perfil */}
        <div className="perfil-card mt-4 table-responsive">
          <table className="table">
            <tbody>
              <tr><th>Nombre</th><td>{detalleUsuario.nombre}</td></tr>
              <tr><th>Apellido</th><td>{detalleUsuario.apellido}</td></tr>
              <tr><th>Email</th><td>{detalleUsuario.correo}</td></tr>
              <tr><th>Teléfono</th><td>{detalleUsuario.telefono}</td></tr>
              <tr><th>Teléfono</th><td>{detalleUsuario.moneda}</td></tr>
            </tbody>
          </table>
        </div>
        {/* Botón Editar */}
      <div className="d-flex justify-content-center gap-3 my-4">
        <Button variant="primary" onClick={() => setShowModal(true)}>Editar Perfil</Button>
        <Button variant="secondary" onClick={() => navigate('/historial')}>Consultar historial de productos</Button>
      </div>
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
                <Button className="btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button variant="success" onClick={handleGuardar}>Guardar cambios</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer mt-4">
        <p className="mb-0">📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}