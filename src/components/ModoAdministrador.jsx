import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/ModoAdministrador.css';

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
    }, []);

    const irPerfil = () => navigate('/perfil');
    const handleGestionObjetivos = () => navigate('/modoAdministradorObjetivos');
    const handleGestionProductos = () => navigate('/modoAdministradorProductos');
    const handleGestionUsuarios = () => navigate('/modoAdministradorUsuarios');

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                        <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
                        <strong>{monedas} PigCoins</strong>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Gestión
                                </a>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={handleGestionObjetivos}>Gestionar Objetivos</button></li>
                                    <li><button className="dropdown-item" onClick={handleGestionProductos}>Gestionar Productos</button></li>
                                    <li><button className="dropdown-item" onClick={handleGestionUsuarios}>Gestionar Usuarios</button></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Ver
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/catalogo_objetivos" target="_blank">Ver Objetivos</a></li>
                                    <li><a className="dropdown-item" href="/productos" target="_blank">Ver Productos</a></li>
                                </ul>
                            </li>
                        </ul>

                        <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
                            <form className="d-flex" role="search">
                                <input className="form-control me-2" type="search" placeholder="Buscar..." aria-label="Buscar" />
                                <button className="btn btn-outline-light" type="submit">Buscar</button>
                            </form>
                            <span className="text-white fw-semibold m-0">👋 ¡Hola, {usuario || 'Usuario'}!</span>
                            <button className="btn btn-perfil" onClick={irPerfil}>
                                👤 Mi Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal centrado */}
            <div className="container-fluid d-flex flex-column align-items-center px-4 mt-4">
                <div className="text-center mt-5 mb-4 w-100">
                    <h2 className="fw-bold">
                        🛠 Estás en el <span className="text-primary">Modo Administrador</span>
                    </h2>
                    <p className="text-muted">Desde aquí puedes gestionar usuarios, objetivos y recompensas del sistema BonusGo.</p>
                </div>

                <div className="row w-100 justify-content-center g-4">
                    <div className="col-md-3 section-appear">
                        <div className="card-admin bg-light-blue p-4 h-100" onClick={handleGestionObjetivos} role="button">
                            <h4>🎯 Gestionar Objetivos</h4>
                            <p className="text-muted">Crea, edita o elimina los desafíos que los usuarios deben cumplir.</p>
                        </div>
                    </div>
                    <div className="col-md-3 section-appear">
                        <div className="card-admin bg-light-green p-4 h-100" onClick={handleGestionProductos} role="button">
                            <h4>📦 Gestionar Productos</h4>
                            <p className="text-muted">Maneja el catálogo de recompensas disponibles en BonusGo.</p>
                        </div>
                    </div>
                    <div className="col-md-3 section-appear">
                        <div className="card-admin bg-light-gray p-4 h-100" onClick={handleGestionUsuarios} role="button">
                            <h4>👥 Gestionar Usuarios</h4>
                            <p className="text-muted">Administra roles, accesos y datos de los usuarios registrados.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer mt-5">
                <p className="mb-0">📬 Info contacto empresa y administradores</p>
            </footer>
        </>
    );
}
