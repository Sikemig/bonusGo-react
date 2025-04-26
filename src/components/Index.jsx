import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bonusGoLogo from "../assets/images/BonusGo_logo.svg";
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

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
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={pigCoinLogo} width="50" height="50" alt="BonusGo Logo" className="d-inline-block align-top" /> BonusGo
                    </Link>

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
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>

                        <div className="d-flex ms-auto">
                            <div className="text-center">
                                <button className="icon-btn" title="Login" onClick={loginClick}>👤</button>
                                <div className="text-white">Login</div>
                            </div>

                            <div className="text-center">
                                <button className="icon-btn" title="Registro" onClick={registerClick}>👥</button>
                                <div className="text-white">Registro</div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Presentación */}
            <div className="hero section-appear">
                <h1><img src={bonusGoLogo} alt="BonusGo" /></h1>
                <p>Tu dosis diaria de productividad 😎</p>
            </div>

            {/* Sección de lo que ofrece la APP */}
            <div className="container my-4">
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="info-section section-appear">
                            <h4>🎯 Info Objetivos</h4>
                            <p>¡Todo lo que necesitas saber para conseguir tus recompensas!</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="info-section section-appear">
                            <h4>📦 Info Productos</h4>
                            <p>Explora nuestros productos y consulta nuestros objetivos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>📬 Info contacto empresa y administradores</p>
            </footer>
        </>
    );
}
