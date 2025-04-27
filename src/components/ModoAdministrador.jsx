import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoAdministrador() {
    const [usuario, setUsuario] = useState('');
    const [monedas, setMonedas] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            console.error('Falta el userId o el token en localStorage');
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/usuario/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const user = response.data;
                setUsuario(user.nombre);
                setMonedas(user.moneda);
            })
            .catch(error => {
                console.error('Error al obtener los datos del usuario:', error);
                setUsuario('Usuario X');
                setMonedas(0);
            });

        document.querySelectorAll('.section-appear').forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = 1;
            }, index * 500);
        });
    }, []);


    const irModoAdministrador = () => {
        navigate('/modoAdministrador');
    };

    const irPerfil = () => {
        navigate('/perfil');
    };

    const handleGestionObjetivos = () => {
        // Aquí en el futuro navegaremos a gestionar objetivos
        // Ejemplo: navigate('/modoAdministradorObjetivos');
    };

    const handleGestionProductos = () => {
        // Aquí en el futuro navegaremos a gestionar productos
        // Ejemplo: navigate('/modoAdministradorProductos');
    };

    const handleGestionUsuarios = () => {
        // Aquí en el futuro navegaremos a gestionar productos
        // Ejemplo: navigate('/modoAdministradorProductos');
    };

    return (
        <>
            <div>
                {/* Barra de navegación */}
                <nav className="navbar navbar-expand-lg custom-navbar">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <img src={pigCoinLogo} width="50" height="50" alt="BonusGo Logo" className="d-inline-block align-top" /> {monedas} PigCoins
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
                                <button className="nav-link admin" onClick={irModoAdministrador}>
                                    MODO ADMINISTRADOR
                                </button>
                            </div>

                            {/* Barra de búsqueda */}
                            <form className="form-inline mt-3 ms-3">
                                <input className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Buscar" />
                                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Buscar</button>
                            </form>

                            {/* Saludo y botón de perfil */}
                            <span className="saludo">Hola, {usuario}</span>
                            <div className="d-flex flex-column align-items-center justify-content-center">

                                <button className="icon-btn" title="Perfil" id="profileBtn" onClick={irPerfil}>👤</button>
                                <div className="text-white">Perfil</div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="contenedor_principal">
                    <div className="bienvenida">
                        <p>MODO ADMINISTRADOR</p>
                    </div>

                    <div className="botones-admin">
                        <div className="info-section admin-info-section section-appear">
                            <button className="botonAdmin" onClick={handleGestionObjetivos}>
                                <h3>🎯 GESTIONAR OBJETIVOS</h3>
                                <p>Añade, modifica o elimina objetivos y desafíos para los usuarios de BonusGo.</p>
                            </button>
                        </div>

                        <div className="info-section admin-info-section section-appear">
                            <button className="botonAdmin" onClick={handleGestionProductos}>
                                <h3>📦 GESTIONAR PRODUCTOS</h3>
                                <p>Añade, modifica o elimina recompensas disponibles en tu sistema de BonusGo.</p>
                            </button>
                        </div>

                        <div className="info-section admin-info-section section-appear">
                            <button className="botonAdmin" onClick={handleGestionUsuarios}>
                                <h3>👥 GESTIONAR USUARIOS</h3>
                                <p>Añade manualmente, modifica los roles y elimina usuarios del sistema.</p>
                            </button>
                        </div>
                    </div>
                </div>


                <footer className="footer">
                    <p>📬 Info contacto empresa y administradores</p>
                </footer>
            </div>
        </>
    );
}