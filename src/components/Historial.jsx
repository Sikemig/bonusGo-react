import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Historial() {
    const [usuario, setUsuario] = useState('');
    const [monedas, setMonedas] = useState(0);
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
            const response = await axios.get(`http://localhost:8080/usuario/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuario(response.data.nombre);
            setMonedas(response.data.moneda);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
        }
    };

    const fetchProductosCanjeados = async () => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
    
        try {
            const response = await axios.get(`http://localhost:8080/transacciones/canjeados/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductosCanjeados(response.data);
        } catch (error) {
            console.error('Error al obtener productos canjeados:', error.response?.data || error.message);
        }
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
                    </div>
                </div>
            </nav>


            <Container className="mt-5 mb-5">
                <h2 className="mb-4 text-center">Historial de Productos Canjeados</h2>
                <div className="text-center mb-4">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>Volver al perfil</Button>
                </div>

                {productosCanjeados.length === 0 ? (
                    <p className="text-center">No has canjeado ningún producto todavía.</p>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {productosCanjeados.map((producto, idx) => (
                            <Col key={idx}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Img
                                        variant="top"
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{producto.nombre}</Card.Title>
                                        <Card.Text>{producto.descripcion}</Card.Text>
                                        <ul className="list-unstyled mb-0">
                                            <li><strong>Tipo:</strong> {producto.tipo}</li>
                                            <li><strong>Coste:</strong> {producto.coste} monedas</li>
                                        </ul>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>


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
