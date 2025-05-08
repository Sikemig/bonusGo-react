import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/modoAdministradorGestiones.css';

export default function ModoAdministradorProductos() {
  const [productos, setProductos] = useState([]);
  const [editarId, setEditarId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [coste, setCoste] = useState(0);
  const [tipo, setTipo] = useState('EXPERIENCIA');
  const [imagen, setImagen] = useState('');
  const [usuario, setUsuario] = useState('');
  const [monedasUsuario, setMonedasUsuario] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuario();
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://backend_bonusgo:8080/producto/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
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
      const user = response.data;
      setUsuario(user.nombre);
      setMonedasUsuario(user.moneda);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const handleAnadirEditar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const productoData = { nombre, descripcion, coste, tipo, imagen };

    try {
      if (editarId === null) {
        await axios.post('http://backend_bonusgo:8080/producto/registrar', productoData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://backend_bonusgo:8080/producto/actualizar/${editarId}`, productoData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProductos();
      resetearFormulario();
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const resetearFormulario = () => {
    setEditarId(null);
    setNombre('');
    setDescripcion('');
    setCoste(0);
    setTipo('EXPERIENCIA');
    setImagen('');
  };

  const handlePrepararEdicion = (producto) => {
    setEditarId(producto.id_Producto);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setCoste(producto.coste);
    setTipo(producto.tipo);
    setImagen(producto.imagen);
    setShowModal(true);
  };

  const handlePrepararBorrado = (producto) => {
    setProductoAEliminar(producto);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarBorrado = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://backend_bonusgo:8080/producto/eliminar/${productoAEliminar.id_Producto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch (error) {
      console.error('Error al borrar producto:', error);
    }
    setMostrarConfirmacion(false);
    setProductoAEliminar(null);
  };

  const productosFiltrados = productos
    .filter(p =>
      (filtroTipo === '' || p.tipo === filtroTipo) &&
      p.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
    )
    .sort((a, b) => ordenAsc ? a.coste - b.coste : b.coste - a.coste);

  const resetearFiltros = () => {
    setBusquedaNombre('');
    setFiltroTipo('');
    setOrdenAsc(true);
  };


  const irPerfil = () => navigate('/perfil');
  const handleGestionUsuarios = () => navigate('/ModoAdministradorUsuarios');
  const handleGestionObjetivos = () => navigate('/ModoAdministradorObjetivos');
  const handleGestion = () => navigate('/modoAdministrador');
  const handleUsuarioObjetivos = () => navigate('/objetivos');
  const handleUsuarioProducto = () => navigate('/producto');
  const handleIndexAdmin = () => navigate('/indexUsuarioAdministrador');


  return (
    <>
      <div className="contenido">
        {/* Navbar */}
        <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
          <Container fluid>
            <Navbar.Brand onClick={handleIndexAdmin} className="d-flex align-items-center gap-2 clickable">
              <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
              <strong>BonusGo</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-between">
              <Nav>
                <Nav.Link className="btn-perfil nav-btn-center" onClick={handleGestion}> Menú Administrador</Nav.Link>
                <Link className="nav-link" to="/indexUsuarioAdministrador">Inicio</Link>
                <NavDropdown title="Gestión" id="gestion-dropdown">
                  <NavDropdown.Item onClick={handleGestionUsuarios}>Gestionar Usuarios</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleGestionObjetivos}>Gestionar Objetivos</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Ver" id="ver-dropdown">
                  <NavDropdown.Item onClick={handleUsuarioObjetivos}>Ver Objetivos</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleUsuarioProducto}>Ver Productos</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
                <span className="text-white fw-semibold">¡Hola, {usuario || 'Usuario'}!</span>
                <Button className="btn-perfil" onClick={irPerfil}>
                  Mi Perfil
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
       
  <div className="admin-usuarios-wrapper">
          <div className="bienvenida">MODO ADMINISTRADOR - PRODUCTOS</div>
   <div className="busqueda-filtros d-flex flex-wrap align-items-center gap-3 mb-4">
  
  {/* Campo de búsqueda */}
  <div style={{ maxWidth: '200px' }}>
    <label htmlFor="buscarNombre" className="visually-hidden">Buscar por nombre</label>
    <input
      id="buscarNombre"
      type="text"
      className="form-control"
      placeholder="🔍 Buscar por nombre"
      value={busquedaNombre}
      onChange={(e) => setBusquedaNombre(e.target.value)}
      aria-label="Buscar por nombre"
    />
  </div>

      {/* Filtro por tipo */}
      <div style={{ maxWidth: '200px' }}>
        <label htmlFor="filtroTipo" className="visually-hidden">Tipo</label>
        <select
          id="filtroTipo"
          className="form-select"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          aria-label="Filtrar por tipo"
        >
          <option value="">🗂️ Tipo</option>
          <option value="EXPERIENCIA">🎯 EXPERIENCIA</option>
          <option value="ROPA">👕 ROPA</option>
          <option value="TARJETAS">💳 TARJETAS</option>
        </select>
      </div>

      {/* Botón de orden */}
      <button
        type="button"
        className={`btn ${ordenAsc ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setOrdenAsc(!ordenAsc)}
        aria-label="Ordenar por coste"
      >
        Ordenar por coste {ordenAsc ? '⬆️' : '⬇️'}
      </button>
      {/* Botón de reset */}
      <button
        type="button"
        className="btn btn-dark"
        onClick={resetearFiltros}
        aria-label="Restablecer filtros"
      >
        ♻️ Restablecer filtros
      </button>

      {/* Botón para añadir producto */}
      <button
        type="button"
        className="btn btn-success"
        onClick={() => {
          resetearFormulario();
          setShowModal(true);
        }}
        aria-label="Añadir nuevo producto"
      >
        ➕ Añadir Producto
      </button>
    </div>

  <div className="tabla-gestion">
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Coste</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id_Producto}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.tipo}</td>
              <td>{producto.coste}</td>
              <td>
                {producto.imagen && (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    width="80"
                    className="rounded shadow-sm"
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handlePrepararEdicion(producto)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handlePrepararBorrado(producto)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>


{showModal && (
  <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <form onSubmit={handleAnadirEditar}>
          <div className="modal-header">
            <h5 className="modal-title">{editarId ? 'Editar Producto' : 'Añadir Producto'}</h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)} required>
                <option value="EXPERIENCIA">EXPERIENCIA</option>
                <option value="ROPA">ROPA</option>
                <option value="TARJETAS">TARJETAS</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Coste</label>
              <input type="number" className="form-control" value={coste} onChange={e => setCoste(parseInt(e.target.value))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Imagen (URL)</label>
              <input type="text" className="form-control" value={imagen} onChange={e => setImagen(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
            <button type="submit" className="btn btn-success">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
        <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Borrado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas borrar el producto "<strong>{productoAEliminar?.nombre}</strong>"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleConfirmarBorrado}>Borrar</Button>
            <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
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
