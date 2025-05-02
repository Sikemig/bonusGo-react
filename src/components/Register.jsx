import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoAdministradorUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [adminNombre, setAdminNombre] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [editarId, setEditarId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [rolSeleccionado, setRolSeleccionado] = useState('');

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmin();
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchAdmin = async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    try {
      const res = await axios.get(`http://localhost:8080/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminNombre(res.data.nombre);
    } catch (err) {
      console.error('Error al obtener admin:', err);
    }
  };

  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8080/usuario/getTodos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
      setUsuariosFiltrados(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8080/roles/getAll', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(res.data);
    } catch (err) {
      console.error('Error al obtener roles:', err);
    }
  };

  const obtenerNombreRol = (rol) => {
    if (!rol) return 'Desconocido';
    switch (rol.nombre) {
      case 'ROLE_ADMIN': return 'Administrador';
      case 'ROLE_USER': return 'Usuario';
      default: return rol.nombre;
    }
  };

  const handleBuscar = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    setUsuariosFiltrados(
      usuarios.filter(u =>
        u.nombre.toLowerCase().includes(valor) ||
        u.correo.toLowerCase().includes(valor)
      )
    );
  };

  const prepararEdicion = (usuario) => {
    setEditarId(usuario.id_Usuario);
    setNombre(usuario.nombre);
    setApellido(usuario.apellido || '');
    setCorreo(usuario.correo);
    setTelefono(usuario.telefono || '');
    setMonedas(usuario.moneda || 0);
    setRolSeleccionado(usuario.rol?.id_Rol.toString() || '');
    setShowModal(true);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setMonedas(0);
    setRolSeleccionado('');
    setEditarId(null);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:8080/usuario/actualizar/${editarId}`,
        {
          nombre,
          apellido,
          correo,
          telefono,
          moneda: monedas,
          rol: { id_Rol: parseInt(rolSeleccionado) }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchUsuarios();
      setShowModal(false);
      limpiarFormulario();
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    } finally {
      setLoading(false);
    }
  };

  const prepararBorrado = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarConfirmacion(true);
  };

  const confirmarBorrado = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/usuario/eliminar/${usuarioAEliminar.id_Usuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    } finally {
      setMostrarConfirmacion(false);
      setUsuarioAEliminar(null);
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {adminNombre}
          </Link>
        </div>
      </nav>

      <div className="bienvenida">MODO ADMINISTRADOR - USUARIOS</div>

      <div className="container mt-3">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar usuario por nombre o correo"
          value={busqueda}
          onChange={handleBuscar}
        />
      </div>

      <div className="table-responsive mt-2">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Monedas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(usuario => (
              <tr key={usuario.id_Usuario}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td>{obtenerNombreRol(usuario.rol)}</td>
                <td>{usuario.moneda}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => prepararEdicion(usuario)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => prepararBorrado(usuario)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Cargando...</span></Spinner>}
      </div>

      <Modal show={showModal} onHide={() => { setShowModal(false); limpiarFormulario(); }}>
        <Form onSubmit={handleGuardar}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" value={apellido} onChange={e => setApellido(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" value={telefono} onChange={e => setTelefono(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monedas</Form.Label>
              <Form.Control type="number" value={monedas} onChange={e => setMonedas(e.target.value === '' ? 0 : parseInt(e.target.value))} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={rolSeleccionado} onChange={e => setRolSeleccionado(e.target.value)} required>
                <option value="">Seleccione un rol</option>
                {roles.map(rol => (
                  <option key={rol.id_Rol} value={rol.id_Rol}>
                    {obtenerNombreRol(rol)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); limpiarFormulario(); }}>Cancelar</Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar a <strong>{usuarioAEliminar?.nombre}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmarBorrado} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      <footer className="footer mt-5 text-center">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
