import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/IndexUsuarios.css';

export default function IndexUsuarioAdministrador() {
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

        axios.get(`http://backend_bonusgo:8080/usuario/${userId}`, {
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

    const irPerfil = () => navigate('/perfil');
    const handleGestionUsuarios = () => navigate('/ModoAdministradorUsuarios');
    const handleGestionProductos = () => navigate('/modoAdministradorProductos');
    const handleGestion = () => navigate('/modoAdministrador');
    const handleUsuarioObjetivos = () => navigate('/objetivos');
    const handleUsuarioProducto = () => navigate('/productos');
    const handleGestionObjetivos = () => navigate('/ModoAdministradorObjetivos');

    return (
        <>
            <div className="contenido">
                {/* Navbar */}
                <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
                    <Container fluid>
                        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
                            <strong>{monedas} PigCoins</strong>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
                            <Nav>
                            <Nav.Link className="btn-perfil nav-btn-center" onClick={handleGestion}> Menú Administrador</Nav.Link>
                                <NavDropdown title="Gestión" id="gestion-dropdown">
                                    <NavDropdown.Item onClick={handleGestionUsuarios}>Gestionar Usuarios</NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleGestionProductos}>Gestionar Productos</NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleGestionObjetivos}>Gestionar Objetivos</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Ver" id="ver-dropdown">
                                    <NavDropdown.Item onClick={handleUsuarioObjetivos}>Ver Objetivos</NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleUsuarioProducto}>Ver Productos</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
                                <span className="text-white fw-semibold m-0">¡Hola, {usuario || 'Usuario'}!</span>
                                <Button className="btn-perfil" onClick={irPerfil}>
                                    Mi Perfil
                                </Button>
                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Bienvenida */}
                <div className="contenedor_principal">
                    <div className="bienvenida">
                        <p>Hola, administrador {usuario} en modo usuario, bienvenido.<br />Actualmente tienes {monedas} PigCoins.</p>
                    </div>

                    <div className="container my-4">
                        <div className="row g-4">
                            {/* Sección de objetivos */}
                            <div className="col-12 col-md-6 h-100">
                                <div className="info-section section-appear">
                                    <button type="button" className="btn-info" onClick={handleUsuarioObjetivos}>
                                        <h4 className="card-title fw-bold">🎯 CONSULTAR OBJETIVOS</h4>
                                        <p className="card-text fs-5">¡Échale un vistazo a los objetivos disponibles en tu empresa y reclama tus PigCoins!</p>
                                    </button>
                                </div>
                            </div>

                            {/* Sección de productos */}
                            <div className="col-12 col-md-6">
                                <div className="info-section section-appear">
                                    <button type="button" className="btn-info" onClick={handleUsuarioProducto}>
                                        <h4 className="card-title fw-bold">📦 CONSULTAR PRODUCTOS</h4>
                                        <p className="card-text fs-5">¡Empieza a canjear todos esos PigCoins que has ido almacenando al cumplir objetivos!</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <footer className="footer">
                <h4>📬 BonusGo - 2025</h4>
                <div className="d-flex justify-content-center gap-4">
                    <span>
                        Manual de usuario -{" "}
                        <a
                            href="https://www.notion.so/Estructura-de-trabajo-BonusGo-1e98c574388f806ba392fc3fe89f6912"
                            target="_blank"
                        >
                            Notion BonusGo
                        </a>
                    </span>
                    <span>
                        Contacto - <a href="mailto:BonusGo@BonusGo.es">BonusGo@BonusGo.es</a>
                    </span>
                </div>
            </footer>
        </>
    );
}
