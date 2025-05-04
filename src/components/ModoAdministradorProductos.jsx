import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

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
      const response = await axios.get('http://localhost:8080/producto/getall', {
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
      const response = await axios.get(`http://localhost:8080/usuario/${id}`, {
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
        await axios.post('http://localhost:8080/producto/registrar', productoData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://localhost:8080/producto/actualizar/${editarId}`, productoData, {
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
      await axios.delete(`http://localhost:8080/producto/eliminar/${productoAEliminar.id_Producto}`, {
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

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {monedasUsuario} PigCoins
          </Link>
          <span className="saludo">Hola, {usuario}</span>
          <button className="icon-btn" onClick={irPerfil}>👤 Perfil</button>
        </div>
      </nav>

      <div className="bienvenida">MODO ADMINISTRADOR - PRODUCTOS</div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 px-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar por nombre"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <select
          className="form-select me-2"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Todos los tipos</option>
          <option value="EXPERIENCIA">EXPERIENCIA</option>
          <option value="ROPA">ROPA</option>
          <option value="TARJETAS">TARJETAS</option>
        </select>
        <button
          className="btn btn-outline-primary"
          onClick={() => setOrdenAsc(!ordenAsc)}
        >
          Ordenar por coste {ordenAsc ? '⬆️' : '⬇️'}
        </button>
        <button className="btn btn-secondary me-2" onClick={resetearFiltros}>
          Restablecer filtros
        </button>
        <button className="btn btn-success" onClick={() => { resetearFormulario(); setShowModal(true); }}>
          Añadir Producto
        </button>
      </div>

      <div className="table-responsive mt-2">
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
            {productosFiltrados.map(producto => (
              <tr key={producto.id_Producto}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.tipo}</td>
                <td>{producto.coste}</td>
                <td>{producto.imagen && <img src={producto.imagen} alt={producto.nombre} width="80" />}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handlePrepararEdicion(producto)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handlePrepararBorrado(producto)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleAnadirEditar}>
          <Modal.Header closeButton>
            <Modal.Title>{editarId ? 'Editar Producto' : 'Añadir Producto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select value={tipo} onChange={e => setTipo(e.target.value)} required>
                <option value="EXPERIENCIA">EXPERIENCIA</option>
                <option value="ROPA">ROPA</option>
                <option value="TARJETAS">TARJETAS</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Coste</Form.Label>
              <Form.Control type="number" value={coste} onChange={e => setCoste(parseInt(e.target.value))} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen (URL)</Form.Label>
              <Form.Control type="text" value={imagen} onChange={e => setImagen(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" variant="success">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

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

      <footer className="footer mt-4">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
