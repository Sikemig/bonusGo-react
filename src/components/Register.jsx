import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

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

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={pigCoinLogo} width="40" height="40" className="me-2 rounded-circle" alt="PigCoin" />
            <strong>BonusGo</strong>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Registro</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Registro */}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
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
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <small>📬 Contacto: soporte@bonusgo.com | Todos los derechos reservados © {new Date().getFullYear()}</small>
      </footer>
    </>
  );
}
