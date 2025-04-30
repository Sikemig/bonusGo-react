import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import anadirImg from '../assets/images/anadir.jpg';

export default function ModoAdministradorObjetivos() {
    const [objetivos, setObjetivos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosAsignadosPorObjetivo, setUsuariosAsignadosPorObjetivo] = useState({});
    const [objetivoActivo, setObjetivoActivo] = useState(null);
    const [editarId, setEditarId] = useState(null);
    const [usuario, setUsuario] = useState('');
    const [monedasUsuario, setMonedasUsuario] = useState(0);
    const [monedasObjetivo, setMonedasObjetivo] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagen, setImagen] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [objetivoAEliminar, setObjetivoAEliminar] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);


    useEffect(() => {
        fetchUsuario();
        fetchObjetivos();
    }, []);

    const fetchUsuario = async () => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        try {
            const response = await axios.get(`http://localhost:8080/usuario/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = response.data;
            setUsuario(user.nombre);
            setMonedasUsuario(user.moneda);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    };

    const fetchObjetivos = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/objetivos/getall', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setObjetivos(response.data);
        } catch (error) {
            console.error('Error al obtener los objetivos:', error);
        }
    };

    const handleAnadirEditar = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const objetivoData = {
            nombre,
            descripcion,
            monedas: parseInt(monedasObjetivo),
            categoria,
            imagen
        };

        try {
            if (editarId === null) {
                const response = await axios.post('http://localhost:8080/objetivos/registrar', objetivoData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setObjetivos(prev => [...prev, response.data]);
            } else {
                const response = await axios.put(`http://localhost:8080/objetivos/actualizar/${editarId}`, objetivoData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setObjetivos(prev => prev.map(objetivo => objetivo.id_objetivo === editarId ? response.data : objetivo));
                setEditarId(null);
            }


            fetchObjetivos();
            resetearFormulario();
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar objetivo:', error);
        }
    };

    const resetearFormulario = () => {
        setEditarId(null);
        setNombre('');
        setDescripcion('');
        setMonedasObjetivo(0);
        setCategoria('');
        setImagen('');
    };

    const handlePrepararEdicion = (objetivo) => {
        setEditarId(objetivo.id_objetivo);
        setNombre(objetivo.nombre);
        setDescripcion(objetivo.descripcion);
        setCategoria(objetivo.categoria);
        setMonedasObjetivo(objetivo.monedas);
        setImagen(objetivo.imagen);
    };


    const handlePrepararBorrado = (objetivo) => {
        setObjetivoAEliminar(objetivo);
        setMostrarConfirmacion(true);
    };

    const handleConfirmarBorrado = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/objetivos/eliminar/${objetivoAEliminar.id_objetivo}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchObjetivos();
        } catch (error) {
            console.error('Error al borrar objetivo:', error);
        }
        setMostrarConfirmacion(false);
        setObjetivoAEliminar(null);
    };

    const abrirGestionUsuarios = (id) => {
        setObjetivoActivo(id);
        const modal = new bootstrap.Modal(document.getElementById('modalGestionUsuarios'));
        modal.show();
    };

    const guardarCambiosUsuarios = () => {
        const seleccionados = Array.from(document.querySelectorAll('.usuario-toggle'))
            .filter(input => input.checked)
            .map(input => input.getAttribute('data-email'));

        setUsuariosAsignadosPorObjetivo(prev => ({
            ...prev,
            [objetivoActivo]: seleccionados
        }));

        const modalElement = document.getElementById('modalGestionUsuarios');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    };

    const irPerfil = () => {
        navigate('/perfil');
    };

    return (
        <>
            {/* Barra de navegación */}
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {monedasUsuario} PigCoins
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
                        </div>

                        <form className="form-inline mt-3 ms-3">
                            <input className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Buscar" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Buscar</button>
                        </form>

                        <span className="saludo">Hola, {usuario}</span>
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <button className="icon-btn" title="Perfil" id="profileBtn" onClick={irPerfil}>👤</button>
                            <div className="text-white">Perfil</div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="bienvenida">MODO ADMINISTRADOR - OBJETIVOS</div>

            {/* Boton superior */}
            <div className="col d-flex justify-content-start">
                <div className="button-group">
                    <button className="icon-btn" onClick={() => { resetearFormulario(); setShowModal(true); }}>
                        <img src={anadirImg} width="50" height="50" alt="" /><br />
                        <span>Añadir</span>
                    </button>
                </div>
            </div>


            {/* Tabla de objetivos */}
            <div className="table-responsive mt-4">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Categoría</th>
                            <th>Recompensa</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {objetivos.map(objetivo => (
                            <tr key={objetivo.id_objetivo}>
                                <td>{objetivo.nombre}</td>
                                <td>{objetivo.descripcion}</td>
                                <td>{objetivo.categoria}</td>
                                <td>{objetivo.monedas}</td>
                                <td>
                                    {objetivo.imagen && <img src={objetivo.imagen} alt={objetivo.nombre} width="80" />}
                                </td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => { handlePrepararEdicion(objetivo); setShowModal(true) }} >Editar</button>
                                    <button className="btn btn-danger ms-2" onClick={() => handlePrepararBorrado(objetivo)}>Borrar</button>
                                    <button className="btn btn-warning ms-2" onClick={() => handleToggleEstado(objetivo.id_objetivo, objetivo.enabled)}>
                                        {objetivo.enabled ? 'Deshabilitar' : 'Habilitar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => { setShowModal(false); resetearFormulario(); }}>
                <Form onSubmit={handleAnadirEditar}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editarId ? 'Editar Objetivo' : 'Añadir Objetivo'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Objetivo</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                required
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                required
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="" disabled>Seleccione una categoría</option>
                                <option value="ORO">ORO</option>
                                <option value="PLATA">PLATA</option>
                                <option value="BRONCE">BRONCE</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Recompensa</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                value={monedasObjetivo}
                                onChange={(e) => setMonedasObjetivo(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen (URL)</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={imagen}
                                onChange={(e) => setImagen(e.target.value)}
                                placeholder="Pega la URL de la imagen"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button type="submit" variant="success">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Borrado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas borrar el objetivo "<strong>{objetivoAEliminar?.nombre}</strong>"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleConfirmarBorrado}>Borrar</Button>
                    <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>



            {/* Modal Gestionar Usuarios */}
            <div className="modal fade" id="modalGestionUsuarios" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Gestionar Usuarios</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" id="usuariosModal">
                            {usuarios.map(usuario => (
                                <div key={usuario.email} className="mb-3 p-2 border rounded">
                                    <div className="form-check form-switch d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Nombre:</strong> {usuario.nombre}<br />
                                            <strong>Email:</strong> {usuario.email}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="form-check-input usuario-toggle"
                                            data-email={usuario.email}
                                            defaultChecked={usuariosAsignadosPorObjetivo[objetivoActivo]?.includes(usuario.email)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button className="btn btn-primary" onClick={guardarCambiosUsuarios}>Guardar cambios</button>
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
};