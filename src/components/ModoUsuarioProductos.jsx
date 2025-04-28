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
      const response = await axios.get(`http://localhost:8080/producto/disponibles/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos disponibles:', error);
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

  const handleCanjearProducto = async (idProducto) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      await axios.put(`http://localhost:8080/producto/canjear/${idProducto}?idUsuario=${idUsuario}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Producto canjeado con éxito!');
      fetchProductos();
      fetchUsuario();
    } catch (error) {
      console.error('Error al canjear producto:', error);
      alert('Error al canjear producto. Revisa tus PigCoins.');
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

      {/* Tabla productos */}
      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Coste</th>
              <th>Tipo</th>
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
                <td>
                  <button className="btn btn-success" onClick={() => handleCanjearProducto(producto.id_producto)}>
                    Canjear
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
