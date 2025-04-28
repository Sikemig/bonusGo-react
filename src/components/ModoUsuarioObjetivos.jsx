import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoUsuarioObjetivos() {
  const [objetivos, setObjetivos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObjetivos();
    fetchUsuario();
  }, []);

  const fetchObjetivos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/objetivos/habilitados', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjetivos(response.data);
    } catch (error) {
      console.error('Error al obtener objetivos habilitados:', error);
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

  const handleCanjearObjetivo = async (idObjetivo) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      await axios.put(`http://localhost:8080/objetivos/canjear/${idObjetivo}?idUsuario=${idUsuario}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Objetivo canjeado con éxito!');
      fetchObjetivos();
      fetchUsuario();
    } catch (error) {
      console.error('Error al canjear objetivo:', error);
      alert('Error al canjear objetivo. Revisa tus PigCoins.');
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
      <div className="bienvenida">OBJETIVOS DISPONIBLES</div>

      {/* Tabla objetivos */}
      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Coste</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {objetivos.map(objetivo => (
              <tr key={objetivo.id_objetivo}>
                <td>{objetivo.nombre}</td>
                <td>{objetivo.descripcion}</td>
                <td>{objetivo.valor}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleCanjearObjetivo(objetivo.id_objetivo)}>
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
