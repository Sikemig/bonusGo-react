import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoUsuarioProductos() {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchUsuario();
  }, []);

  const fetchProductos = async () => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
  
    try {
      const responseProductos = await axios.get(`http://localhost:8080/producto/getall`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productos = responseProductos.data;
  
      // Verificar los productos canjeados del backend
      const responseCanjeados = await axios.get(`http://localhost:8080/transacciones/canjeados/${idUsuario}`, {
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
      const response = await axios.get(`http://localhost:8080/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuario(response.data.nombre);
      setMonedas(response.data.moneda);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  };

  const handleCanjearProducto = async (id_Producto) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      await axios.post(`http://localhost:8080/transacciones/canjear?idProducto=${id_Producto}&idUsuario=${idUsuario}`, {}, {
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

  const irPerfil = () => {
    navigate('/perfil');
  };

  return (
    <>
      {/* NAV */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {usuario} ({monedas} PigCoins)
          </Link>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" to="/indexUsuario">Inicio</Link>
            </div>
            <div className="d-flex ms-auto">
              <button className="icon-btn" title="Perfil" onClick={irPerfil}>👤</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Título */}
      <div className="bienvenida">PRODUCTOS DISPONIBLES</div>

      {/* Tarjetas de productos */}
      <div className="container mt-4">
        <div className="row">
          {productos.map((producto) => (
            <div className="col-md-4 mb-4" key={producto.id_Producto}>
              <div className={`card h-100 shadow-sm ${producto.canjeado ? 'disabled' : ''}`} style={producto.canjeado ? { opacity: 0.5 } : {}}>
                {producto.imagen && (
                  <img
                    src={producto.imagen}
                    className="card-img-top"
                    alt={producto.nombre}
                  />
                )}
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.descripcion}</p>
                    <p className="card-text"><strong>Coste:</strong> {producto.coste} PigCoins</p>
                    <p className="card-text"><strong>Tipo:</strong> {producto.tipo}</p>
                  </div>
                  <button
                    className="btn btn-success mt-3"
                    onClick={() => handleCanjearProducto(producto.id_Producto)}
                    disabled={producto.canjeado}
                  >
                    Canjear
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
