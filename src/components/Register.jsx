import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
  });
  const [rol, setRol] = useState('user');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const endpoint = rol === 'admin' ? '/auth/registrarAdmin' : '/auth/registrar';
      await axios.post(endpoint, form);
      setMensaje('Registro exitoso, redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setMensaje('Error al registrar');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h3 className="text-center">Registro</h3>
          <form onSubmit={handleRegister}>
            {['nombre', 'apellido', 'correo', 'telefono', 'password'].map((campo) => (
              <div className="mb-3" key={campo}>
                <input
                  name={campo}
                  type={campo === 'password' ? 'password' : campo === 'correo' ? 'email' : 'text'}
                  className="form-control"
                  placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                  value={form[campo]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="mb-3">
              <select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button className="btn btn-success w-100">Registrarse</button>
            {mensaje && <div className="alert alert-info mt-2">{mensaje}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
