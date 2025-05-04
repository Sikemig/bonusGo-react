import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import '../assets/styles/Index.css';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';

export default function Index() {
    // para navegar entre paginas
    const navigate = useNavigate();

    // para que aparezcan los elementos suavemente
    useEffect(() => {
        const sections = document.querySelectorAll('.section-appear');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = 1;
            }, index * 500);
        });
    }, []);

    // ir al login
    const loginClick = () => {
        navigate('/login');
    };

    // ir al register
    const registerClick = () => {
        navigate('/register');
    };

    return (
        <>
            {/* Barra de navegación */}
            <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="shadow-sm">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                        <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
                        <strong>BonusGo</strong>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
                        <button className="btn-perfil" onClick={loginClick}>👤 Login</button>
                        <button className="btn-perfil" onClick={registerClick}>👥 Registro</button>
                    </div>
                </Container>
            </Navbar>

            {/* Presentación */}
            <div className="hero section-appear">
                <h1>BonusGo</h1>
                <p>Tu dosis diaria de productividad 😎</p>
            </div>

            {/* Sección de lo que ofrece la APP */}
            <div className="container-fluid my-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 justify-content-center">
                        <div className="info-section section-appear">
                            <h3>🎯 INFO OBJETIVOS</h3>
                            <p>¡Todo lo que necesitas saber para conseguir tus recompensas!</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 justify-content-center">
                        <div className="info-section section-appear">
                            <h3>📦 INFO PRODUCTOS</h3>
                            <p>Explora nuestros productos y consulta nuestros objetivos</p>
                        </div>
                    </div>
                </div>
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
