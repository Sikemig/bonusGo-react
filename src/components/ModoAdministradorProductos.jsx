import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import anadirImg from '../assets/images/anadir.jpg';
import editImg from '../assets/images/edit.jpg';
import borrarImg from '../assets/images/borrar.jpg';

export default function ModoAdministradorProductos() {
  const [productos, setProductos] = useState([]);
  const [editarId, setEditarId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [coste, setCoste] = useState(0);
  const [tipo, setTipo] = useState('EXPERIENCIA');
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchUsuario();
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
      setUsuario(response.data.nombre);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  };

  const handleAnadirEditar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const productoData = {
      nombre,
      descripcion,
      coste,
      tipo,
      enabled: true
    };

    try {
      if (editarId === null) {
        await axios.post('http://localhost:8080/producto/registrar', productoData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      } else {
        await axios.put(`http://localhost:8080/producto/actualizar/${editarId}?coste=${coste}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchProductos();
      resetForm();
      closeModal();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handlePrepararEdicion = (producto) => {
    setEditarId(producto.id_producto);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setCoste(producto.coste);
    setTipo(producto.tipo);
  };

  const handleBorrar = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/producto/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch (error) {
      console.error('Error al borrar producto:', error);
    }
  };

  const handleToggleEstado = async (id, enabled) => {
    const token = localStorage.getItem('token');
    try {
      if (enabled) {
        await axios.put(`http://localhost:8080/producto/deshabilitar/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://localhost:8080/producto/habilitar/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProductos();
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
    }
  };

  const resetForm = () => {
    setEditarId(null);
    setNombre('');
    setDescripcion('');
    setCoste(0);
    setTipo('EXPERIENCIA');
  };

  const closeModal = () => {
    const modalElement = document.getElementById('modalFormProducto');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  };

  const irPerfil = () => {
    navigate('/perfil');
  };

  return (
    <>
      {/* NAV */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {usuario}
          </Link>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Inicio</Link>
              <Link className="nav-link" to="/modoAdministrador">Modo Admin</Link>
            </div>

            <div className="d-flex ms-auto">
              <button className="icon-btn" title="Perfil" onClick={irPerfil}>👤</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Título */}
      <div className="bienvenida">MODO ADMINISTRADOR - PRODUCTOS</div>

      {/* Botón añadir */}
      <div className="row">
        <div className="col d-flex justify-content-start">
          <div className="button-group">
            <button className="icon-btn" data-bs-toggle="modal" data-bs-target="#modalFormProducto" onClick={resetForm}>
              <img src={anadirImg} width="50" height="50" alt="Añadir" /><br />
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla productos */}
      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Coste</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.coste}</td>
                <td>{producto.tipo}</td>
                <td>{producto.enabled ? 'Activo' : 'Deshabilitado'}</td>
                <td>
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalFormProducto" onClick={() => handlePrepararEdicion(producto)}>Editar</button>
                  <button className="btn btn-danger ms-2" onClick={() => handleBorrar(producto.id_producto)}>Borrar</button>
                  <button className="btn btn-warning ms-2" onClick={() => handleToggleEstado(producto.id_producto, producto.enabled)}>
                    {producto.enabled ? 'Deshabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      <div className="modal fade" id="modalFormProducto" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAnadirEditar}>
              <div className="modal-header">
                <h5 className="modal-title">{editarId ? 'Editar Producto' : 'Añadir Producto'}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Coste</label>
                  <input type="number" className="form-control" value={coste} onChange={(e) => setCoste(parseInt(e.target.value))} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo</label>
                  <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                    <option value="EXPERIENCIA">EXPERIENCIA</option>
                    <option value="ROPA">ROPA</option>
                    <option value="TARJETAS">TARJETAS</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}