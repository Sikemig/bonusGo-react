import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function Register() {
  //recogemos los datos del formulario
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    password: '',
    password2: '',
    telefono: '',
  });
  const [mensaje, setMensaje] = useState('');
  // preparamos la navegacion para ir al login cuando termine el registro
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      // comprobamos las claves por seguridad
      setMensaje('Las contraseñas no coinciden');
      return;
    }
    try {
      // metemos los datos para el body del POST a la API
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
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="BonusGo Logo" className="d-inline-block align-top" /> BonusGo
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link" href="registro.html" target="_blank">REGISTRO</a>
              <a className="nav-link" href="login.html" target="_blank">LOGIN</a>
              <a className="nav-link" href="index_usuario.html" target="_blank">RODAJE</a>
              <a className="nav-link" href="index_usuario_administrador.html" target="_blank">usuario</a>
              <a className="nav-link" href="index_modo_administrador.html" target="_blank">admin</a>
              <a className="nav-link" href="mi_perfil.html" target="_blank">MI PERFIL</a>
              <a className="nav-link" href="modo_administrador_objetivo.html" target="_blank">objetivo</a>
              <a className="nav-link" href="modo_administrador_productos.html" target="_blank">productos</a>
              <a className="nav-link" href="catalogo_objetivos.html" target="_blank">CATALOGO</a>
              <a className="nav-link" href="historico_transacciones.html" target="_blank">HISTÓRICO</a>
              <a className="nav-link" href="productos.html" target="_blank">PRODUCTOS</a>
              <a className="nav-link" href="carrito.html" target="_blank">CARRITO</a>
            </div>

            <form className="form-inline mt-3">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>


      {/* Formulario de registro */}
      <div className="container my-5">
        <div className="info-section section-appear">
          <h3 className="mb-4 text-center">Formulario de Registro</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input type="text" className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="apellidos" className="form-label">Apellidos:</label>
              <input type="text" className="form-control" id="apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Email:</label>
              <input type="email" className="form-control" id="usuario" name="usuario" value={form.usuario} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <input type="password" className="form-control" id="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="password2" className="form-label">Confirmar contraseña:</label>
              <input type="password" className="form-control" id="password2" name="password2" value={form.password2} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label htmlFor="telefono" className="form-label">Teléfono:</label>
              <input type="tel" className="form-control" id="telefono" name="telefono" value={form.telefono} onChange={handleChange} required />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-warning">Registrarse</button>
            </div>

            {mensaje && (
              <div className="alert alert-info mt-3 text-center">{mensaje}</div>
            )}
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
