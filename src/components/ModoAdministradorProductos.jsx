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
  const [file, setFile] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [monedasUsuario, setMonedasUsuario] = useState(0);
  const [imagen, setImagen] = useState('');
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

    const productoData = {
      nombre,
      descripcion,
      coste,
      tipo,
      imagen, // Ahora es directamente la URL
      enabled: true
    };

    try {
      if (editarId === null) {
        await axios.post('http://localhost:8080/producto/registrar', productoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.put(`http://localhost:8080/producto/actualizar/${editarId}`, productoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
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
    setImagen('');
  };

  const closeModal = () => {
    const modalElement = document.getElementById('modalFormProducto');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const irPerfil = () => {
    navigate('/perfil');
  };

  return (
    <>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {monedasUsuario} PigCoins
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link" href="/registro" target="_blank">REGISTRO</a>
              <a className="nav-link" href="/login" target="_blank">LOGIN</a>
              <a className="nav-link" href="/index_usuario" target="_blank">RODAJE</a>
              <a className="nav-link" href="/index_usuario_administrador" target="_blank">usuario</a>
              <a className="nav-link" href="/index_modo_administrador" target="_blank">admin</a>
              <a className="nav-link" href="/mi_perfil" target="_blank">MI PERFIL</a>
              <a className="nav-link" href="/modo_administrador_objetivo" target="_blank">objetivo</a>
              <a className="nav-link" href="/modo_administrador_productos" target="_blank">productos</a>
              <a className="nav-link" href="/catalogo_objetivos" target="_blank">CATÁLOGO</a>
              <a className="nav-link" href="/historico_transacciones" target="_blank">HISTÓRICO</a>
              <a className="nav-link" href="/productos" target="_blank">PRODUCTOS</a>
              <a className="nav-link" href="/carrito" target="_blank">CARRITO</a>
            </div>

            <form className="form-inline mt-3 ms-3">
              <input className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Buscar" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Buscar</button>
            </form>

            <span className="saludo">Hola, {usuario}</span>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <button className="icon-btn" title="Perfil" id="profileBtn" onClick={irPerfil}>👤</button>
              <div className="text-white">Perfil</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="bienvenida">MODO ADMINISTRADOR - PRODUCTOS</div>

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

      <div className="table-responsive mt-4">
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
            {productos.map(producto => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.tipo}</td>
                <td>{producto.coste}</td>
                <td>
                  {producto.imagen && <img src={producto.imagen} alt={producto.nombre} width="80" />}
                </td>
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
                  <label className="form-label">Nombre Producto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-control"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                  >
                    <option value="" disabled>Seleccione un tipo</option>
                    <option value="EXPERIENCIA">EXPERIENCIA</option>
                    <option value="ROPA">ROPA</option>
                    <option value="TARJETAS">TARJETAS</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Coste</label>
                  <input
                    type="number"
                    className="form-control"
                    value={coste}
                    onChange={(e) => setCoste(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Imagen (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    placeholder="Pega la URL de la imagen"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
