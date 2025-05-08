import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoUsuarioProductos() {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [rol, setRol] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchUsuario();
  }, []);

  const fetchProductos = async () => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');

    try {
      const responseProductos = await axios.get(`http://backend_bonusgo:8080/producto/getall`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productos = responseProductos.data;

      // Verificar los productos canjeados del backend
      const responseCanjeados = await axios.get(`http://backend_bonusgo:8080/transacciones/canjeados/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Asegurarse de que responseCanjeados.data sea un array
      const productosCanjeadosIds = Array.isArray(responseCanjeados.data)
        ? responseCanjeados.data.map(producto => producto.id_Producto)
        : [];  // Si no es un array, asignar un array vacío

      // Marcar los productos canjeados
      const productosConEstado = productos.map(producto => ({
        ...producto,
        canjeado: productosCanjeadosIds.includes(producto.id_Producto)
      }));

      setProductos(productosConEstado);

    } catch (error) {
      console.error('Error al obtener productos:', error);
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

  const handleCanjearProducto = async (id_Producto) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      await axios.post(`http://backend_bonusgo:8080/transacciones/canjear?idProducto=${id_Producto}&idUsuario=${idUsuario}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('¡Producto canjeado con éxito!');
      fetchProductos();
      fetchUsuario();
      fetchProductosCanjeados();
    } catch (error) {
      console.error('Error al canjear producto:', error);
      alert(error.response.data);
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
        <div className="bienvenida">PRODUCTOS DISPONIBLES</div>

        {/* Tarjetas de productos */}
      <div className="container mt-4">
        <div className="row">
          {productos.map((producto) => (
            <div className="col-md-4 mb-4" key={producto.id_Producto}>
              <div
                className={`card h-100 border-0 shadow-sm position-relative ${producto.canjeado ? 'bg-light text-muted' : ''}`}
                style={{
                  opacity: producto.canjeado ? 0.6 : 1,
                  cursor: producto.canjeado ? 'not-allowed' : 'default'
                }}
            >
          {/* Imagen */}
          {producto.imagen && (
            <img
              src={producto.imagen}
              className="card-img-top"
              alt={producto.nombre}
              style={{ height: '200px', objectFit: 'cover' }}
            />
          )}

          {/* Cuerpo */}
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 className="card-title fw-semibold">{producto.nombre}</h5>
              <p className="card-text small">{producto.descripcion}</p>
              <p className="card-text">
                <strong>Coste:</strong> {producto.coste} <span className="text-warning">PigCoins</span>
              </p>
              <p className="card-text">
                <strong>Tipo:</strong> {producto.tipo}
              </p>
            </div>
            <button
              className={`btn mt-3 w-100 fw-bold ${producto.canjeado ? 'btn-outline-secondary' : 'btn-success'}`}
              onClick={() => handleCanjearProducto(producto.id_Producto)}
              disabled={producto.canjeado}
            >
              {producto.canjeado ? '✅ Canjeado' : '🎁 Canjear'}
            </button>
          </div>
          {/* Badge de estado */}
          {producto.canjeado && (
            <span className="badge position-absolute top-0 end-0 m-2 bg-secondary">
              Canjeado
            </span>
          )}
        </div>
      </div>
    ))}
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
