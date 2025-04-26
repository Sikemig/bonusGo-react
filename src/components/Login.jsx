import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [rol, setRol] = useState('user');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // recibe los datos del login y usa el endpoint correspondiente
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = rol === 'admin' ? '/auth/loginAdmin' : '/auth/loginUser';

      const { data } = await axios.post(endpoint, { correo, pass });

      // Guardamos el token del usuario logeado provenientes de el controlador de autenticación
      localStorage.setItem('token', data.token);

      // Ahora vamos a buscar el ID del usuario de la información que nos devuelve el token
      const response = await axios.get('/auth/token/info', {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      // Guardamos el ID
      const { id, rol: rolToken } = response.data;
      localStorage.setItem('id', id);
      localStorage.setItem('rol', rolToken);


      if (rolToken === 'ROLE_ADMIN') {
        navigate('/indexUsuarioAdministrador');
      } else {
        navigate('/indexUsuario');
      }
    } catch (error) {
      setMensaje('Credenciales incorrectas');
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

      {/* Sección de login */}
      <div className="container mt-5">
        <div className="card mx-auto" style={{ maxWidth: '400px' }}>
          <div className="card-body">
            <h3 className="text-center mb-4">Iniciar Sesión</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="usuario" className="form-label">Email:</label>
                <input
                  type="email"
                  id="usuario"
                  className="form-control"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="rol" className="form-label">Rol:</label>
                <select
                  id="rol"
                  className="form-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <button type="submit" className="btn btn-warning w-100">Ingresar</button>

              <div className="text-center mt-3">
                <a href="/register" className="text-light">¿No tienes cuenta? Regístrate</a>
              </div>

              {mensaje && <div className="alert alert-danger mt-3 text-center">{mensaje}</div>}
            </form>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
