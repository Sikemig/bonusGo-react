import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/modoAdministrador.css';

import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  Button,
  Row,
  Col
} from 'react-bootstrap';

export default function ModoAdministrador() {
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
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
      .catch(() => {
        setUsuario('Usuario X');
        setMonedas(0);
      });
  }, []);

  const irPerfil = () => navigate('/perfil');
  const handleGestionObjetivos = () => navigate('/modoAdministradorObjetivos');
  const handleGestionProductos = () => navigate('/modoAdministradorProductos');
  const handleGestionUsuarios = () => navigate('/modoAdministradorUsuarios');

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
            <strong>{monedas} PigCoins</strong>
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
                <NavDropdown.Item href="/catalogo_objetivos" target="_blank">Ver Objetivos</NavDropdown.Item>
                <NavDropdown.Item href="/productos" target="_blank">Ver Productos</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
              <Form className="form-busqueda" onSubmit={(e) => e.preventDefault()}>
                <Form.Control
                  type="search"
                  placeholder="Buscar..."
                  className="input-busqueda"
                  aria-label="Buscar"
                />
                <Button className="btn-buscar" type="submit">Buscar</Button>
              </Form>
              <span className="text-white fw-semibold m-0">¡Hola, {usuario || 'Usuario'}!</span>
              <Button className="btn-perfil" onClick={irPerfil}>
                Mi Perfil
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido principal */}
      <Container fluid className="contenido-admin">
        <div className="bienvenida mb-5 text-center">
          <h1 className="fw-bold display-5">
            🛠 Estás en el <span className="texto-admin">Modo Administrador</span>
          </h1>
          <p className="descripcion-admin">Desde aquí puedes gestionar usuarios, objetivos y recompensas del sistema BonusGo.</p>
        </div>

        <div className="admin-grid">
  <Col className="card-admin-glass" onClick={handleGestionObjetivos}>
    <div className="icon-glass text-danger">🎯</div>
    <h5 className="card-glass-title">Gestionar Objetivos</h5>
    <p className="card-glass-desc">Crea, edita o elimina los desafíos que los usuarios deben cumplir.</p>
  </Col>

  <Col className="card-admin-glass" onClick={handleGestionProductos}>
    <div className="icon-glass text-success">📦</div>
    <h5 className="card-glass-title">Gestionar Productos</h5>
    <p className="card-glass-desc">Maneja el catálogo de recompensas disponibles en BonusGo.</p>
  </Col>

  <Col className="card-admin-glass" onClick={handleGestionUsuarios}>
    <div className="icon-glass text-primary">👥</div>
    <h5 className="card-glass-title">Gestionar Usuarios</h5>
    <p className="card-glass-desc">Administra roles, accesos y datos de los usuarios registrados.</p>
  </Col>
</div>

      </Container>

      {/* Footer */}
            <footer className="footer mt-5 fixed-bottom text-center">
            <p className="mb-0">📬 Info contacto empresa y administradores</p>
            </footer>

    </>
  );
}