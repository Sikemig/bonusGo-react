import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";
import anadirImg from '../assets/images/anadir.jpg';
import editImg from '../assets/images/edit.jpg';
import borrarImg from '../assets/images/borrar.jpg';


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

    // useEffect para obtener los datos del usuario administrador
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id'); // <-- aquí cambiamos 'userId' por 'id'

        axios.get(`http://localhost:8080/usuario/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const user = response.data;
                setUsuario(user.nombre);
                setMonedasUsuario(user.moneda);
            })
            .catch(error => {
                console.error('Error al obtener datos del usuario conectado:', error);
            });
    }, []);


    // useEffect para cargar los objetivos que hay en bbdd
    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8080/objetivos/getall', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log(response.data);
                setObjetivos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los objetivos:', error);
            });
    }, []);


    // submit del formulario de añadir y editar un objetivo en la API
    const handleAnadirEditar = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const objetivoData = {
            nombre: nombre,
            descripcion: descripcion,
            monedas: parseInt(monedasObjetivo),
            categoria: categoria,
            imagen: imagen
        };

        try {
            if (editarId === null) {
                // Nuevo objetivo
                const response = await axios.post(
                    'http://localhost:8080/objetivos/registrar',
                    objetivoData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setObjetivos(prev => [...prev, response.data]);
            } else {
                // Editar objetivo
                const objetivoSeleccionado = objetivos.find(obj => obj.id_objetivo === editarId);
                const objetivoId = objetivoSeleccionado?.id_objetivo;

                const response = await axios.put(
                    `http://localhost:8080/objetivos/actualizar/${objetivoId}`,
                    objetivoData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Objetivo actualizado:', response.data);
                setObjetivos(prev => prev.map(obj => obj.id_objetivo === editarId ? response.data : obj));
                setEditarId(null);
            }

            // Limpiar formulario
            setNombre('');
            setDescripcion('');
            setMonedasObjetivo('');
            setCategoria('');
            setImagen('');

            // Cerrar modal
            const modalElement = document.getElementById('modalForm');
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.hide();

        } catch (error) {
            console.error('Error al guardar objetivo:', error);
        }
    };


    const handlePrepararEdicion = () => {
        if (editarId !== null) {
            const objetivoSeleccionado = objetivos.find(obj => obj.id_objetivo === editarId);
            if (objetivoSeleccionado) {
                setNombre(objetivoSeleccionado.nombre);
                setDescripcion(objetivoSeleccionado.descripcion);
                setCategoria(objetivoSeleccionado.categoria);
                setMonedasObjetivo(objetivoSeleccionado.monedas);
                setImagen(objetivoSeleccionado.imagen);
            }
        } else {
            setNombre('');
            setDescripcion('');
            setCategoria('');
            setMonedasObjetivo('');
            setImagen('');
        }
    };


    const handleBorrar = () => {
        const seleccionados = Array.from(document.querySelectorAll('.individual-checkbox:checked'))
            .map(checkbox => parseInt(checkbox.getAttribute('data-index')));
        const nuevosObjetivos = objetivos.filter((_, index) => !seleccionados.includes(index));
        setObjetivos(nuevosObjetivos);
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

            {/* Botones */}
            <div className="row">
                <div className="col d-flex justify-content-start">
                    <div className="button-group">
                        <button className="icon-btn" data-bs-toggle="modal" data-bs-target="#modalForm">
                            <img src={anadirImg} width="50" height="50" alt="" /><br />
                            <span>Añadir</span>
                        </button>
                    </div>
                    <div className="button-group">
                        <button className="icon-btn" data-bs-toggle="modal" data-bs-target="#modalForm" onClick={handlePrepararEdicion}>
                            <img src={editImg} width="50" height="50" alt="" /><br />
                            <span>Editar</span>
                        </button>
                    </div>
                    <div className="button-group">
                        <button className="icon-btn" id="borrarBtn" onClick={handleBorrar}>
                            <img src={borrarImg} width="50" height="50" alt="" /><br />
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Formulario */}
            <div className="modal fade" id="modalForm" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form id="formularioObjetivo" onSubmit={handleAnadirEditar}>
                            <div className="modal-header">
                                <h5 className="modal-title">Formulario de Objetivo</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nombre Objetivo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombreObjetivo"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="descripcionObjetivo"
                                        rows="3"
                                        required
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Categoría</label>
                                    <select
                                        className="form-select"
                                        id="categoriaObjetivo"
                                        required
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    >
                                        <option value="" disabled>Seleccione una categoría</option>
                                        <option value="ORO">ORO</option>
                                        <option value="PLATA">PLATA</option>
                                        <option value="BRONCE">BRONCE</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Monedas</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="monedasObjetivo"
                                        required
                                        value={monedasObjetivo}
                                        onChange={(e) => setMonedasObjetivo(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Imagen</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="imagenObjetivo"
                                        required
                                        value={imagen}
                                        onChange={(e) => setImagen(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Tabla de objetivos */}
            <div className="table-responsive mt-4">
                <table className="table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="seleccionarTodos" className="form-check-input" /></th>
                            <th>Nº</th>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Categoría</th>
                            <th>Monedas</th>
                            <th>Imagen</th>
                            <th>Usuarios</th>
                        </tr>
                    </thead>

                    <tbody id="objetivosFormulario">
                        {objetivos.map((objetivo, index) => (
                            <tr key={objetivo.id_objetivo}>
                                <td><input
                                    type="checkbox"
                                    checked={editarId === objetivo.id_objetivo}
                                    onChange={() => setEditarId(editarId === objetivo.id_objetivo ? null : objetivo.id_objetivo)}
                                /></td>
                                <td>{index + 1}</td>
                                <td>{objetivo.nombre}</td>
                                <td>{objetivo.descripcion.length > 20 ? objetivo.descripcion.substring(0, 20) + "..." : objetivo.descripcion}</td>
                                <td>{objetivo.categoria}</td>
                                <td>{objetivo.monedas}</td>
                                <td><img src={objetivo.imagen} width="50" height="50" alt="" /></td>
                                <td><button className="btn btn-primary" onClick={() => abrirGestionUsuarios(objetivo.id_objetivo)}>Gestionar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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