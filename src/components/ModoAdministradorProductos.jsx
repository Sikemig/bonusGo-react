import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import anadirImg from '../assets/images/anadir.jpg';

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
  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);


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

    const productoData = {
      nombre,
      descripcion,
      coste,
      tipo,
      imagen,
    };

    try {
      if (editarId === null) {
        const response = await axios.post('http://localhost:8080/producto/registrar', productoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProductos(prev => [...prev, response.data]);
      } else {
        const response = await axios.put(`http://localhost:8080/producto/actualizar/${editarId}`, productoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProductos(prev => prev.map(producto => producto.id_producto === editarId ? response.data : producto));
        setEditarId(null);
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
    console.log("Producto a editar:", producto);
    setEditarId(producto.id_Producto);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setCoste(producto.coste);
    setTipo(producto.tipo);
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
            <button className="icon-btn" onClick={() => { resetearFormulario(); setShowModal(true); }}>
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
                  <button className="btn btn-primary" onClick={() => { handlePrepararEdicion(producto); setShowModal(true); }}>Editar</button>
                  <button className="btn btn-danger ms-2" onClick={() => handlePrepararBorrado(producto)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetearFormulario(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editarId ? 'Editar Producto' : 'Añadir Producto'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleAnadirEditar}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Nombre Producto</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" variant="success">Guardar</Button>
          </Modal.Footer>
        </form>
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

      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
