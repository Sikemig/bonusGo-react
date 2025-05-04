
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/modoadministrador.css';

import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';

export default function ModoAdministrador() {
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('Falta el userId o el token en localStorage');
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:8080/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const user = response.data;
        setUsuario(user.nombre);
        setMonedas(user.moneda);
      })
      .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
        setUsuario('Usuario X');
        setMonedas(0);
      });
  }, []);

  const irPerfil = () => navigate('/perfil');
  const handleGestionObjetivos = () => navigate('/modoAdministradorObjetivos');
  const handleGestionProductos = () => navigate('/modoAdministradorProductos');
  const handleGestionUsuarios = () => navigate('/modoAdministradorUsuarios');
  const handleUsuarioObjetivos = () => navigate('/modoUsuarioObjetivos');
  const handleUsuarioProducto = () => navigate('/modoUsuarioProducto');

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
            <strong>BonusGo</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-between">
            <Nav>
              <NavDropdown title="Gestión" id="gestion-dropdown">
                <NavDropdown.Item onClick={handleGestionObjetivos}>Gestionar Objetivos</NavDropdown.Item>
                <NavDropdown.Item onClick={handleGestionProductos}>Gestionar Productos</NavDropdown.Item>
                <NavDropdown.Item onClick={handleGestionUsuarios}>Gestionar Usuarios</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Ver" id="ver-dropdown">
                <NavDropdown.Item onClick={handleUsuarioObjetivos}>Ver Objetivos</NavDropdown.Item>
                <NavDropdown.Item onClick={handleUsuarioProducto}>Ver Productos</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
              <span className="text-white fw-semibold m-0">¡Hola, {usuario || 'Usuario'}!</span>
              <Button className="btn-perfil" onClick={irPerfil}>
                Mi Perfil
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido principal */}
      <div className="container-fluid align-items-center px-4 position-fixed start-50 translate-middle">
        <div className="bienvenida text-center mt-5 mb-4 w-100">
          <h1 className="fw-bold">
            🛠 Estás en el <span className="texto-admin">Modo Administrador</span>
          </h1>
          <p className="descripcion-admin">Desde aquí puedes gestionar usuarios, objetivos y recompensas del sistema BonusGo.</p>
        </div>

        <div className="row w-100 justify-content-center g-4">
          <div className="col-md-3 section-appear">
            <div className="card-admin bg-light-blue p-4 h-100" onClick={handleGestionObjetivos} role="button">
              <h4>🎯 Gestionar Objetivos</h4>
              <p className="text-muted">Crea, edita o elimina los desafíos que los usuarios deben cumplir.</p>
            </div>
          </div>
          <div className="col-md-3 section-appear">
            <div className="card-admin bg-light-green p-4 h-100" onClick={handleGestionProductos} role="button">
              <h4>📦 Gestionar Productos</h4>
              <p className="text-muted">Maneja el catálogo de recompensas disponibles en BonusGo.</p>
            </div>
          </div>
          <div className="col-md-3 section-appear">
            <div className="card-admin bg-light-gray p-4 h-100" onClick={handleGestionUsuarios} role="button">
              <h4>👥 Gestionar Usuarios</h4>
              <p className="text-muted">Administra roles, accesos y datos de los usuarios registrados.</p>
            </div>
          </div>
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
