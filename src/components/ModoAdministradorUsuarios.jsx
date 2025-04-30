import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import pigCoinLogo from "../assets/images/PigCoin_2.jpg";

export default function ModoAdministradorUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editarId, setEditarId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('USUARIO');
  const [monedas, setMonedas] = useState(0);
  const [adminNombre, setAdminNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
    fetchAdmin();
  }, []);

  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8080/usuario/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const fetchAdmin = async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    try {
      const res = await axios.get(`http://localhost:8080/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminNombre(res.data.nombre);
    } catch (err) {
      console.error('Error al obtener admin:', err);
    }
  };

  const prepararEdicion = (usuario) => {
    setEditarId(usuario.id_usuario);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setRol(usuario.rol);
    setMonedas(usuario.moneda);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8080/usuario/actualizar/${editarId}`, {
        nombre,
        email,
        rol,
        moneda: monedas
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsuarios();
      cerrarModal();
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  const cerrarModal = () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario'));
    modal.hide();
    setEditarId(null);
    setNombre('');
    setEmail('');
    setRol('USUARIO');
    setMonedas(0);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={pigCoinLogo} width="50" height="50" alt="PigCoin Logo" /> {adminNombre}
          </Link>
        </div>
      </nav>

      <div className="bienvenida">MODO ADMINISTRADOR - USUARIOS</div>

      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Monedas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.moneda}</td>
                <td>
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEditarUsuario" onClick={() => prepararEdicion(usuario)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      <div className="modal fade" id="modalEditarUsuario" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleGuardar}>
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select className="form-select" value={rol} onChange={e => setRol(e.target.value)}>
                    <option value="USUARIO">USUARIO</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Monedas</label>
                  <input type="number" className="form-control" value={monedas} onChange={e => setMonedas(parseInt(e.target.value))} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>📬 Info contacto empresa y administradores</p>
      </footer>
    </>
  );
}
