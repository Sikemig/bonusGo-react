import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/register.css';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    password: '',
    password2: '',
    telefono: '',
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }
    try {
      const dataToSend = {
        nombre: form.nombre,
        apellido: form.apellidos,
        correo: form.usuario,
        telefono: form.telefono,
        password: form.password,
      };
      await axios.post('/auth/registrar', dataToSend);
      setMensaje('Registro exitoso, redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMensaje('Error al registrar');
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.section-appear');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = 1;
      }, index * 500);
    });
  }, []);

  const loginClick = () => {
    navigate('/login');
  };

  const indexClick = () => {
    navigate('/index');
  };

  return (
    <>
      {/* Barra de navegación */}
      <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
            <strong>BonusGo</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
            <button className="btn-perfil" onClick={loginClick}>Login</button>
            <button className="btn-perfil" onClick={indexClick}>Volver</button>
          </div>
        </Container>
      </Navbar>

      {/* Registro */}
      <div className="container d-flex justify-content-center align-items-center min-vh-100 mt-5 mt-md-0 custom-position">
        <div className="card p-4 shadow-lg w-100 section-appear" style={{ maxWidth: '500px' }}>
          <h3 className="text-center mb-4">Crea tu cuenta</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellidos</label>
              <input type="text" className="form-control" name="apellidos" value={form.apellidos} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" name="usuario" value={form.usuario} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input type="password" className="form-control" name="password2" value={form.password2} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Teléfono</label>
              <input type="tel" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-dark w-100">Registrarse</button>
            {mensaje && <div className="alert alert-info mt-3 text-center">{mensaje}</div>}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer mt-5">
        <h4>📬 BonusGo - 2025</h4>
        <div className="d-flex justify-content-center gap-4">
          <span>
            Manual de usuario -{" "}
            <a
              href="https://www.notion.so/Estructura-de-trabajo-BonusGo-1e98c574388f806ba392fc3fe89f6912"
              target="_blank"
              rel="noopener noreferrer"
            >
              Notion BonusGo
            </a>
          </span>
          <span>
            Contacto - <a href="mailto:BonusGo@BonusGo.es">BonusGo@BonusGo.es</a>
          </span>
        </div>
      </footer>
    </>
  );
}
