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
            <div className="contenido">
                {/* Barra de navegación */}
                <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
                    <Container fluid>
                        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                            <img src={pigCoinLogo} width="40" height="40" alt="PigCoin Logo" className="rounded-circle" />
                            <strong>BonusGo</strong>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <div className="d-flex align-items-center gap-3 flex-wrap perfil-navbar">
                            <button className="btn-perfil" onClick={loginClick}>Login</button>
                            <button className="btn-perfil" onClick={registerClick}>Registro</button>
                        </div>
                    </Container>
                </Navbar>

                {/* Presentación */}
                <div className="hero section-appear d-flex flex-column justify-content-center align-items-center text-center">
                    <h1 className="display-3 fw-bold mb-3">BonusGo</h1>
                    <p className="lead fs-4 fst-italic">Tu dosis diaria de productividad</p>
                </div>
                {/* Sección de lo que ofrece la APP */}
                <div className="container my-2">
                    <div className="row gy-5 gx-4 justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="info-card section-appear card text-center shadow-lg border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                                    <div className="icon-box mb-0">🎯</div>
                                    <h4 className="card-title fw-bold mb-0">-OBJETIVOS-</h4>
                                    <p className="card-text fs-5">
                                        En BonusGo se definirán una serie de misiones y tareas por parte de tu empresa que 
                                        te permitirán acumular la moneda principal de la aplicación (PigCoins) como recompensa
                                        para posteriormente darte algun capricho o facilitarte tu desempeño laboral.
                                    </p>
                                    <p className="card-text fs-5">
                                        ¡Empieza a acumular esos PigCoins!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="info-card section-appear card text-center shadow-lg border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                                    <div className="icon-box mb-0">📦</div>
                                    <h4 className="card-title fw-bold mb-0">-PRODUCTOS-</h4>
                                    <p className="card-text fs-5">
                                        Preparate para canjear todos esos PigCoins acumulados en distintos productos
                                        ofertados por tu empresa como recompensa a tu ardua labor. Echale un vistazo a todas
                                        las posibilidades ofertadas por los administradores a través de esta plataforma.
                                    </p>
                                    <p className="card-text fs-5">
                                        ¡Canjea tus PigCoins por recompensas!
                                    </p>
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
