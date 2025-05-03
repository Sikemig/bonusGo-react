import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import anadirImg from '../assets/images/anadir.jpg';

export default function ModoAdministradorObjetivos() {
  const [objetivos, setObjetivos] = useState([]);
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuario();
    fetchObjetivos();
  }, []);

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

  const fetchObjetivos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/objetivos/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjetivos(response.data);
    } catch (error) {
      console.error('Error al obtener objetivos:', error);
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
        await axios.post('http://localhost:8080/objetivos/registrar', objetivoData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://localhost:8080/objetivos/actualizar/${editarId}`, objetivoData, {
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
    setEditarId(objetivo.id_objetivo);
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
      await axios.delete(`http://localhost:8080/objetivos/eliminar/${objetivoAEliminar.id_objetivo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchObjetivos();
    } catch (error) {
      console.error('Error al borrar objetivo:', error);
    }
    setMostrarConfirmacion(false);
    setObjetivoAEliminar(null);
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

      <div className="bienvenida">MODO ADMINISTRADOR - OBJETIVOS</div>

      {/* Controles */}
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
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Todas las categorías</option>
          <option value="ORO">ORO</option>
          <option value="PLATA">PLATA</option>
          <option value="BRONCE">BRONCE</option>
        </select>
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => setOrdenAsc(!ordenAsc)}
        >
          Ordenar por recompensa {ordenAsc ? '⬆️' : '⬇️'}
        </button>
        <button className="btn btn-secondary me-2" onClick={resetearFiltros}>
          Restablecer filtros
        </button>
        <button className="btn btn-success" onClick={() => { resetearFormulario(); setShowModal(true); }}>
          Añadir Objetivo
        </button>
      </div>

      <div className="table-responsive mt-2">
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
              <tr key={objetivo.id_objetivo}>
                <td>{objetivo.nombre}</td>
                <td>{objetivo.descripcion}</td>
                <td>{objetivo.categoria}</td>
                <td>{objetivo.monedas}</td>
                <td>{objetivo.imagen && <img src={objetivo.imagen} alt={objetivo.nombre} width="80" />}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handlePrepararEdicion(objetivo)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handlePrepararBorrado(objetivo)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleAnadirEditar}>
          <Modal.Header closeButton>
            <Modal.Title>{editarId ? 'Editar Objetivo' : 'Añadir Objetivo'}</Modal.Title>
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
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoria} onChange={e => setCategoria(e.target.value)} required>
                <option value="">Seleccione una</option>
                <option value="ORO">ORO</option>
                <option value="PLATA">PLATA</option>
                <option value="BRONCE">BRONCE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recompensa</Form.Label>
              <Form.Control type="number" value={monedasObjetivo} onChange={e => setMonedasObjetivo(parseInt(e.target.value))} required />
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
          ¿Estás seguro de que deseas borrar el objetivo "<strong>{objetivoAEliminar?.nombre}</strong>"?
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
