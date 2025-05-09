import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/modoAdministradorGestiones.css';

export default function ModoAdministradorObjetivos() {
  const [objetivos, setObjetivos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [objetivoActivo, setObjetivoActivo] = useState(null);
  const [editarId, setEditarId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monedasObjetivo, setMonedasObjetivo] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState('');
  const [usuario, setUsuario] = useState('');
  const [monedasUsuario, setMonedasUsuario] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [objetivoAEliminar, setObjetivoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [usuariosHabilitados, setUsuariosHabilitados] = useState([]);
  const [showModalHabilitar, setShowModalHabilitar] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuario();
    fetchObjetivos();
  }, []);

  const fetchUsuario = async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    try {
      const response = await axios.get(`/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = response.data;
      setUsuario(user.nombre);
      setMonedasUsuario(user.moneda);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const fetchObjetivos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/objetivos/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjetivos(response.data);
    } catch (error) {
      console.error('Error al obtener objetivos:', error);
    }
  };

  // buscar usuarios
  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get("/usuario/getTodos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
      setUsuariosFiltrados(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // para cargar los checks en el modal, segun esten los objetivos habilitados para cada usuario o no
  const fetchUsuariosHabilitados = async (idObjetivo) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/ganancia/habilitados?idObjetivo=${idObjetivo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuariosHabilitados(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios habilitados:', error);
    }
  };

  const handleAnadirEditar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const objetivoData = {
      nombre,
      descripcion,
      monedas: parseInt(monedasObjetivo),
      categoria,
      imagen
    };

    try {
      if (editarId === null) {
        await axios.post('/objetivos/registrar', objetivoData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`/objetivos/actualizar/${editarId}`, objetivoData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchObjetivos();
      resetearFormulario();
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar objetivo:', error);
    }
  };

  const resetearFormulario = () => {
    setEditarId(null);
    setNombre('');
    setDescripcion('');
    setMonedasObjetivo(0);
    setCategoria('');
    setImagen('');
  };

  const handlePrepararEdicion = (objetivo) => {
    setEditarId(objetivo.idObjetivo);
    setNombre(objetivo.nombre);
    setDescripcion(objetivo.descripcion);
    setCategoria(objetivo.categoria);
    setMonedasObjetivo(objetivo.monedas);
    setImagen(objetivo.imagen);
    setShowModal(true);
  };

  const handlePrepararBorrado = (objetivo) => {
    setObjetivoAEliminar(objetivo);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarBorrado = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/objetivos/eliminar/${objetivoAEliminar.idObjetivo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchObjetivos();
    } catch (error) {
      console.error('Error al borrar objetivo:', error);
    }
    setMostrarConfirmacion(false);
    setObjetivoAEliminar(null);
  };

  // modal para habilitar
  const abrirModalHabilitar = (objetivo) => {
    setObjetivoActivo(objetivo);
    fetchUsuarios();
    fetchUsuariosHabilitados(objetivo.idObjetivo);
    setShowModalHabilitar(true);
  };

  // busqueda de usuarios para la habilitacion
  const handleBusquedaUsuarios = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusquedaUsuario(valor);
    setUsuariosFiltrados(
      usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(valor) || usuario.correo.toLowerCase().includes(valor)
      )
    );
  };

  // habilitamos o deshabilitamos para cada usuario
  const toggleHabilitacionObjetivo = async (id_Usuario, habilitar) => {
    const token = localStorage.getItem('token');
    try {
      const body = {
        usuario: { id_Usuario: id_Usuario },
        objetivo: { idObjetivo: objetivoActivo.idObjetivo },
        habilitado: habilitar
      };

      await axios.post(`/ganancia/habilitar`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsuariosHabilitados(prev =>
        habilitar ? [...prev, id_Usuario] : prev.filter(id => id !== id_Usuario)
      );
      setMensajeError('');
    } catch (error) {
      setMensajeError(error.response.data);
    }
  };

  const objetivosFiltrados = objetivos
    .filter(o =>
      (filtroCategoria === '' || o.categoria === filtroCategoria) &&
      o.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
    )
    .sort((a, b) => ordenAsc ? a.monedas - b.monedas : b.monedas - a.monedas);

  const resetearFiltros = () => {
    setBusquedaNombre('');
    setFiltroCategoria('');
    setOrdenAsc(true);
  };

  const irPerfil = () => navigate('/perfil');
  const handleGestionUsuarios = () => navigate('/ModoAdministradorUsuarios');
  const handleGestionProductos = () => navigate('/modoAdministradorProductos');
  const handleGestion = () => navigate('/modoAdministrador');
  const handleUsuarioObjetivos = () => navigate('/objetivos');
  const handleUsuarioProducto = () => navigate('/productos');
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
                  <NavDropdown.Item onClick={handleGestionProductos}>Gestionar Productos</NavDropdown.Item>
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
        <div className="admin-usuarios-wrapper">
          <div className="bienvenida">MODO ADMINISTRADOR - OBJETIVOS</div>
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

          {/* Filtro por categoría */}
          <div style={{ maxWidth: '200px' }}>
            <label htmlFor="filtroCategoria" className="visually-hidden">Categoría</label>
            <select
              id="filtroCategoria"
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              <option value="">🏷️ Categorías</option>
              <option value="ORO">🥇 ORO</option>
              <option value="PLATA">🥈 PLATA</option>
              <option value="BRONCE">🥉 BRONCE</option>
            </select>
          </div>

          {/* Botón de orden */}
          <button
            type="button"
            className={`btn ${ordenAsc ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setOrdenAsc(!ordenAsc)}
            aria-label="Ordenar por recompensa"
          >
            Ordenar por recompensa {ordenAsc ? '⬆️' : '⬇️'}
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

          {/* Botón para añadir objetivo */}
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              resetearFormulario();
              setShowModal(true);
            }}
            aria-label="Añadir nuevo objetivo"
          >
            ➕ Añadir Objetivo
          </button>
        </div>

          <div className="tabla-gestion">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Recompensa</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {objetivosFiltrados.map(objetivo => (
                    <tr key={objetivo.idObjetivo}>
                      <td>{objetivo.nombre}</td>
                      <td>{objetivo.descripcion}</td>
                      <td>{objetivo.categoria}</td>
                      <td>{objetivo.monedas}</td>
                      <td>{objetivo.imagen && <img src={objetivo.imagen} alt={objetivo.nombre} width="80" />}</td>
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => { handlePrepararEdicion(objetivo); setShowModal(true) }}>Editar</button>
                        <button className="btn btn-danger btn-sm ms-2" onClick={() => handlePrepararBorrado(objetivo)}>Borrar</button>
                        <button className="btn btn-warning btn-sm ms-2" onClick={() => abrirModalHabilitar(objetivo)}>Habilitar</button>
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
                  <h5 className="modal-title">{editarId ? 'Editar Objetivo' : 'Añadir Objetivo'}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      resetearFormulario();
                    }}
                  ></button>
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
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)} required>
                      <option value="">Seleccione una</option>
                      <option value="ORO">ORO</option>
                      <option value="PLATA">PLATA</option>
                      <option value="BRONCE">BRONCE</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Recompensa</label>
                    <input type="number" className="form-control" value={monedasObjetivo} onChange={e => setMonedasObjetivo(parseInt(e.target.value))} required />
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
            ¿Estás seguro de que deseas borrar el objetivo "<strong>{objetivoAEliminar?.nombre}</strong>"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleConfirmarBorrado}>Borrar</Button>
            <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>


        <Modal show={showModalHabilitar} onHide={() => { setShowModalHabilitar(false); setMensajeError(''); }} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Habilitar/Deshabilitar el objetivo "{objetivoActivo?.nombre}" para usuarios</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar usuario por nombre o correo"
              value={busquedaUsuario}
              onChange={handleBusquedaUsuarios}
            />

            {mensajeError && (
              <div className="alert alert-danger" role="alert">
                {mensajeError}
              </div>
            )}

            {usuariosFiltrados.map(usuario => (
              <div key={usuario.id_Usuario} className="form-check form-switch border p-2 mb-2 d-flex justify-content-between align-items-center">
                <label className="form-check-label mb-0">
                  <strong>{usuario.nombre}</strong> - {usuario.correo}
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={usuariosHabilitados.includes(usuario.id_Usuario)}
                  onChange={(e) => toggleHabilitacionObjetivo(usuario.id_Usuario, e.target.checked)}
                />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalHabilitar(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
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
