import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function IndexUsuarioAdmin() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/auth/token/info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(data);
      } catch {
        navigate('/login');
      }
    };
    fetchInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


    return (
      <div className="contenedor_principal">
        {/* NAVBAR */}
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src="/IMG/PigCoin_2.jpg" width="50" height="50" className="d-inline-block align-top" alt="Logo" />
              <span id="monedasUsuario" className="nav-link">
                {/* Aquí va la cantidad de PigCoins dinámicamente */}
                X PigCoins
              </span>
            </a>
  
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
  
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="nav-link" href="registro.html" target="_blank">REGISTRO</a>
                <a className="nav-link" href="login.html" target="_blank">LOGIN</a>
                <a className="nav-link" href="index_usuario.html" target="_blank">RODAJE</a>
                <a className="nav-link" href="index_usuario_administrador.html" target="_blank">usuario</a>
                <a className="nav-link" href="index_modo_administrador.html" target="_blank">admin</a>
                <a className="nav-link" href="mi_perfil.html" target="_blank">MI PERFIL</a>
                <a className="nav-link" href="modo_administrador_objetivo.html" target="_blank">objetivo</a>
                <a className="nav-link" href="modo_administrador_productos.html" target="_blank">productos</a>
                <a className="nav-link" href="catalogo_objetivos.html" target="_blank">CATALOGO</a>
                <a className="nav-link" href="historico_transacciones.html" target="_blank">HISTÓRICO</a>
                <a className="nav-link" href="productos.html" target="_blank">PRODUCTOS</a>
                <a className="nav-link" href="carrito.html" target="_blank">CARRITO</a>
              </div>
  
              <form className="form-inline mt-3">
                <input className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Search" />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Buscar</button>
              </form>
  
              <div className="navbar-nav">
                <div className="col">
                  <span className="saludo">Hola, {/* Aquí va el nombre del usuario */} X</span>
                  <a className="nav-link admin" href="modo_administrador.html" target="_blank">MODO ADMINISTRADOR</a>
                </div>
              </div>
  
              <div className="d-flex ms-auto">
                <button className="icon-btn" title="Notificaciones" id="notifBtn">🔔</button>
                <button className="icon-btn" title="Perfil" id="profileBtn">👤</button>
              </div>
            </div>
          </div>
        </nav>
  
        {/* BIENVENIDA */}
        <div className="bienvenida">
          <p>Hola, usuario {/* nombre dinámico */} X en modo usuario, bienvenido.<br />
            Actualmente tienes {/* PigCoins dinámico */} X PigCoins</p>
        </div>
  
        {/* INFO SECCIONES */}
        <div className="container my-4">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="info-section section-appear">
                <h3>🎯 CONSULTAR OBJETIVOS</h3>
                <p>¡Échale un vistazo a los objetivos disponibles en tu empresa y reclama tus PigCoins!</p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="info-section section-appear">
                <h3>📦 CONSULTAR PRODUCTOS</h3>
                <p>¡Empieza a canjear todos esos PigCoins que has ido almacenando al cumplir objetivos!</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* FOOTER */}
        <footer className="footer">
          <h5>Información de empresa</h5>
          <p>Nombre de empresa: Inventada</p>
          <p>CIF: XXXXXXXXX</p>
          <p>Teléfono de contacto: YYYYYYYY</p>
          <p>Email de dirección: jajeji@email.es</p>
          <h5>Contacta con los administradores</h5>
          <button>Contacta con los administradores de la aplicación</button>
        </footer>
      </div>
    );
  }
