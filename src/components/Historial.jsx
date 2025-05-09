import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function Historial() {
    const [usuario, setUsuario] = useState('');
    const [monedas, setMonedas] = useState(0);
    const [rol, setRol] = useState(1);
    const [productosCanjeados, setProductosCanjeados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsuario();
        fetchProductosCanjeados();
    }, []);

    const fetchUsuario = async () => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');

        try {
            const response = await axios.get(`/usuario/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuario(response.data.nombre);
            setMonedas(response.data.moneda);
            setRol(Number(response.data.rol.id_Rol));
        } catch (error) {
            console.error('Error al obtener usuario:', error);
        }
    };

    const fetchProductosCanjeados = async () => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');

        try {
            const response = await axios.get(`/transacciones/canjeados/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductosCanjeados(response.data);
        } catch (error) {
            console.error('Error al obtener productos canjeados:', error.response?.data || error.message);
        }
    };

    const irPerfil = () => navigate('/perfil');

    return (
        <>
            <div className="contenido">
                {/* NAV */}
                <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
                    <Container fluid>
                        <Navbar.Brand className="d-flex align-items-center gap-2">
                            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
                            <strong>{monedas} PigCoins</strong>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
                            <Nav>
                                <Link className="nav-link" to={rol === 2 ? "/indexUsuarioAdministrador" : "/indexUsuario"}>
                                    Inicio
                                </Link>
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

                <Container className="mt-5 mb-5">
                    <h2 className="bienvenida">Historial de Productos Canjeados</h2>
                    {productosCanjeados.length === 0 ? (
                        <p className="text-center">No has canjeado ningún producto todavía.</p>
                    ) : (
                        <div className="tabla-gestion">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Descripción</th>
                                            <th>Tipo</th>
                                            <th>Coste</th>
                                            <th>Imagen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productosCanjeados.map((producto, idx) => (
                                            <tr key={idx}>
                                                <td>{producto.nombre}</td>
                                                <td>{producto.descripcion}</td>
                                                <td>{producto.tipo}</td>
                                                <td>{producto.coste} monedas</td>
                                                <td>{producto.imagen && <img src={producto.imagen} alt={producto.nombre} width="80" />}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Container>
            </div>

            {/* Footer */}
            <footer className="footer mt-5">
                <h4>📬 BonusGo - 2025</h4>
                <div className="d-flex justify-content-center gap-4">
                    <span>
                        Manual de usuario -{" "}
                        <a
                            href="https://www.notion.so/Estructura-de-trabajo-BonusGo-1e98c574388f806ba392fc3fe89f6912"
                            target="_blank"
                            rel="noopener noreferrer"
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
