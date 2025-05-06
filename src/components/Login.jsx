import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';
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

  const indexClick = () => {
    navigate('/index');
  };

  const registerClick = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="contenido">
        {/* Barra de navegación */}
        <Navbar expand="lg" variant="dark" className="shadow-sm">
          <Container fluid>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
              <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
              <strong>BonusGo</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
              <button className="btn-perfil" onClick={registerClick}>Registro</button>
              <button className="btn-perfil" onClick={indexClick}>Volver</button>
            </div>
          </Container>
        </Navbar>

        <div className="container d-flex justify-content-center align-items-center custom-position">
          <div className="card shadow w-100 section-appear" style={{ maxWidth: '400px', margin: '1%' }}>
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

                {mensaje && <div className="alert alert-danger mt-3 text-center">{mensaje}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <h4>📬 BonusGo - 2025</h4>
        <div className="d-flex justify-content-center gap-4">
          <span>
            Manual de usuario -{" "}
            <a
              href="https://www.notion.so/Estructura-de-trabajo-BonusGo-1e98c574388f806ba392fc3fe89f6912"
              target="_blank"
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
