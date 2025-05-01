import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import anadirImg from '../assets/images/anadir.jpg';

export default function ModoAdministradorObjetivos() {
    const [objetivos, setObjetivos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
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
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [busquedaUsuario, setBusquedaUsuario] = useState('');
    const [usuariosHabilitados, setUsuariosHabilitados] = useState([]);
    const [showModalHabilitar, setShowModalHabilitar] = useState(false);




    useEffect(() => {
        fetchUsuario();
        fetchObjetivos();
    }, []);

    // busqueda de usuario logeado
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

    // buscar objetivos
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

    // buscar usuarios
    const fetchUsuarios = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get("http://localhost:8080/usuario/getTodos", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(response.data);
            setUsuariosFiltrados(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    // para cargar los checks en el modal, segun esten los objetivos habilitados para cada usuario o no
    const fetchUsuariosHabilitados = async (idObjetivo) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:8080/ganancia/habilitados?idObjetivo=${idObjetivo}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuariosHabilitados(response.data); 
        } catch (error) {
            console.error('Error al obtener usuarios habilitados:', error);
        }
    };
    

    // boton de añadir y editar
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

    // resetear el formulario cuando añadamos o editemos
    const resetearFormulario = () => {
        setEditarId(null);
        setNombre('');
        setDescripcion('');
        setMonedasObjetivo(0);
        setCategoria('');
        setImagen('');
    };

    // buscamos el objetivo a editar por id
    const handlePrepararEdicion = (objetivo) => {
        setEditarId(objetivo.idObjetivo);
        setNombre(objetivo.nombre);
        setDescripcion(objetivo.descripcion);
        setCategoria(objetivo.categoria);
        setMonedasObjetivo(objetivo.monedas);
        setImagen(objetivo.imagen);
    };

    // buscamos el objetivo a eliminar por id
    const handlePrepararBorrado = (objetivo) => {
        setObjetivoAEliminar(objetivo);
        setMostrarConfirmacion(true);
    };

    // confirmamos el borrado con mensaje de confirmacion
    const handleConfirmarBorrado = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/objetivos/eliminar/${objetivoAEliminar.idObjetivo}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchObjetivos();
        } catch (error) {
            console.error('Error al borrar objetivo:', error);
        }
        setMostrarConfirmacion(false);
        setObjetivoAEliminar(null);
    };

    // modal para habilitar
    const abrirModalHabilitar = (objetivo) => {
        setObjetivoActivo(objetivo);
        fetchUsuarios();
        fetchUsuariosHabilitados(objetivo.idObjetivo);
        setShowModalHabilitar(true);
    };



    // busqueda de usuarios para la habilitacion
    const handleBusquedaUsuarios = (e) => {
        const valor = e.target.value.toLowerCase();
        setBusquedaUsuario(valor);
        setUsuariosFiltrados(
            usuarios.filter(usuario =>
                usuario.nombre.toLowerCase().includes(valor) || usuario.correo.toLowerCase().includes(valor)
            )
        );
    };

    // habilitamos o deshabilitamos para cada usuario
    const toggleHabilitacionObjetivo = async (id_Usuario, habilitar) => {
        const token = localStorage.getItem('token');
        try {
            const body = {
                usuario: { id_Usuario: id_Usuario },
                objetivo: { idObjetivo: objetivoActivo.idObjetivo },
                habilitado: habilitar
            };
    
            await axios.post(`http://localhost:8080/ganancia/habilitar`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            setUsuariosHabilitados(prev =>
                habilitar ? [...prev, id_Usuario] : prev.filter(id => id !== id_Usuario)
            );
        } catch (error) {
            console.error('Error al cambiar la habilitación de objetivo:', error);
        }
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
                                    <button className="btn btn-warning ms-2" onClick={() => abrirModalHabilitar(objetivo)}>Habilitar</button>
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
            <Modal show={showModalHabilitar} onHide={() => setShowModalHabilitar(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Habilitar/Deshabilitar el objetivo "{objetivoActivo?.nombre}" para usuarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar usuario por nombre o correo"
                        value={busquedaUsuario}
                        onChange={handleBusquedaUsuarios}
                    />

                    {usuariosFiltrados.map(usuario => (
                        <div key={usuario.id_Usuario} className="form-check form-switch border p-2 mb-2 d-flex justify-content-between align-items-center">
                            <label className="form-check-label mb-0">
                                <strong>{usuario.nombre}</strong> - {usuario.correo}
                            </label>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={usuariosHabilitados.includes(usuario.id_Usuario)}
                                onChange={(e) => toggleHabilitacionObjetivo(usuario.id_Usuario, e.target.checked)}
                            />
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalHabilitar(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>



            {/* Footer */}
            <footer className="footer" >
                <p>📬 Info contacto empresa y administradores</p>
            </footer>
        </>
    );
};