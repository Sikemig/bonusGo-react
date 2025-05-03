import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoUsuarioObjetivos() {
  const [objetivos, setObjetivos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [objetivosHabilitados, setObjetivosHabilitados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObjetivos().then((listaObjetivos) => fetchObjetivosHabilitadosParaUsuario(listaObjetivos));
    fetchUsuario();
  }, []);

  const fetchObjetivos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/objetivos/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjetivos(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los objetivos:', error);
      return [];
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

  const fetchObjetivosHabilitadosParaUsuario = async (listaObjetivos) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      const habilitados = [];
  
      for (const obj of listaObjetivos) {
        const response = await axios.get(`http://localhost:8080/ganancia/habilitados?idObjetivo=${obj.idObjetivo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.includes(parseInt(idUsuario))) {
          habilitados.push(obj.idObjetivo);
        }
      }
  
      setObjetivosHabilitados(habilitados);
    } catch (error) {
      console.error('Error al verificar objetivos habilitados para usuario:', error);
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
      fetchObjetivos().then(fetchObjetivosHabilitadosParaUsuario);
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
      <div className="container mt-4">
        <div className="row">
          {objetivos.map((objetivo) => {
            const estaHabilitado = objetivosHabilitados.includes(objetivo.idObjetivo);
            return (
              <div className="col-md-4 mb-4" key={objetivo.idObjetivo}>
                <div className={`card h-100 shadow-sm ${!estaHabilitado ? 'bg-light text-muted' : ''}`}>
                  {objetivo.imagen && (
                    <img
                      src={objetivo.imagen}
                      className="card-img-top"
                      alt={objetivo.nombre}
                      style={{ filter: !estaHabilitado ? 'grayscale(100%) brightness(70%)' : 'none' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{objetivo.nombre}</h5>
                      <p className="card-text">{objetivo.descripcion}</p>
                      <p className="card-text"><strong>Coste:</strong> {objetivo.monedas} PigCoins</p>
                    </div>
                    <button
                      className="btn btn-success mt-3"
                      onClick={() => handleCanjearObjetivo(objetivo.idObjetivo)}
                      disabled={!estaHabilitado}
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
