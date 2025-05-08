import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoUsuarioObjetivos() {
  const [objetivos, setObjetivos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [rol, setRol] = useState(1);
  const [objetivosHabilitados, setObjetivosHabilitados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObjetivos().then((listaObjetivos) => fetchObjetivosHabilitadosParaUsuario(listaObjetivos));
    fetchUsuario();
  }, []);

  const fetchObjetivos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://backend_bonusgo:8080/objetivos/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjetivos(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los objetivos:', error);
      return [];
    }
  };

  const fetchUsuario = async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    try {
      const response = await axios.get(`http://backend_bonusgo:8080/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuario(response.data.nombre);
      setMonedas(response.data.moneda);
      setRol(Number(response.data.rol.id_Rol));
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  };

  const fetchObjetivosHabilitadosParaUsuario = async (listaObjetivos) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      const habilitados = [];

      for (const obj of listaObjetivos) {
        const response = await axios.get(`http://backend_bonusgo:8080/ganancia/habilitados?idObjetivo=${obj.idObjetivo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.includes(parseInt(idUsuario))) {
          habilitados.push(obj.idObjetivo);
        }
      }

      setObjetivosHabilitados(habilitados);
    } catch (error) {
      console.error('Error al verificar objetivos habilitados para usuario:', error);
    }
  };

  const handleReclamarObjetivo = async (idObjetivo) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      await axios.post(`http://backend_bonusgo:8080/ganancia/reclamar?idObjetivo=${idObjetivo}&idUsuario=${idUsuario}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Objetivo canjeado con éxito!');
      fetchObjetivos().then(fetchObjetivosHabilitadosParaUsuario);
      fetchUsuario();
    } catch (error) {
      console.error('Error al reclamar objetivo:', error);
      alert('Error al reclamar objetivo. Revisa tus PigCoins.');
    }
  };

  const irPerfil = () => navigate('/perfil');
  const handleGestionUsuarios = () => navigate('/ModoAdministradorUsuarios');
  const handleGestionProductos = () => navigate('/modoAdministradorProductos');
  const handleGestion = () => navigate('/modoAdministrador');
  const handleUsuarioObjetivos = () => navigate('/objetivos');
  const handleUsuarioProducto = () => navigate('/productos');
  const handleGestionObjetivos = () => navigate('/ModoAdministradorObjetivos');
  const handleIndexUsuario= () => navigate('/indexUsuario');

  return (
    <>
      <div className="contenido">
        <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
          <Container fluid>
          <Navbar.Brand onClick={handleIndexUsuario} className="d-flex align-items-center gap-2 clickable">
              <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
              <strong>{monedas} PigCoins</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-between">
              <Nav>
                {rol === 2 && (
                  <>
                    <Nav.Link className="btn-perfil nav-btn-center" onClick={handleGestion}> Menú Administrador</Nav.Link>
                    <Link className="nav-link" to={rol === 2 ? "/indexUsuarioAdministrador" : "/indexUsuario"}>
                                      Inicio
                                    </Link>
                    <NavDropdown title="Gestión" id="gestion-dropdown">
                      <NavDropdown.Item onClick={handleGestionUsuarios}>Gestionar Usuarios</NavDropdown.Item>
                      <NavDropdown.Item onClick={handleGestionProductos}>Gestionar Productos</NavDropdown.Item>
                      <NavDropdown.Item onClick={handleGestionObjetivos}>Gestionar Objetivos</NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}
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

      {/* Título */}
      <div className="bienvenida">OBJETIVOS DISPONIBLES</div>
{/* Tarjetas */}
<div className="container">
  <div className="row">
    {objetivos.map((objetivo) => {
      const estaHabilitado = objetivosHabilitados.includes(objetivo.idObjetivo);
      return (
        <div className="col-md-4 mb-4" key={objetivo.idObjetivo}>
          <div
            className={`card h-100 border-0 shadow-sm position-relative ${!estaHabilitado ? 'bg-light text-muted' : ''}`}
            style={{
              opacity: estaHabilitado ? 1 : 0.6,
              cursor: estaHabilitado ? 'default' : 'not-allowed'
            }}
          >
            {/* Imagen */}
            {objetivo.imagen && (
              <img
                src={objetivo.imagen}
                className="card-img-top"
                alt={objetivo.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />
            )}

            {/* Cuerpo */}
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-semibold">{objetivo.nombre}</h5>
                <p className="card-text small">{objetivo.descripcion}</p>
                <p className="card-text">
                  <strong>Coste:</strong> {objetivo.monedas} <span className="text-warning">PigCoins</span>
                </p>
              </div>
              <button
                className={`btn mt-3 w-100 fw-bold ${estaHabilitado ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => handleReclamarObjetivo(objetivo.idObjetivo)}
                disabled={!estaHabilitado}
              >
                {estaHabilitado ? '🎁 Reclamar' : '🔒 Bloqueado'}
              </button>
            </div>

            {/* Estado */}
            <span
              className={`badge position-absolute top-0 end-0 m-2 ${estaHabilitado ? 'bg-success' : 'bg-secondary'}`}
            >
              {estaHabilitado ? 'Disponible' : 'Bloqueado'}
            </span>
          </div>
        </div>
      );
    })}
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
