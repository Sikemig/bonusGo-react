import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [rol, setRol] = useState('user');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = rol === 'admin' ? '/auth/loginAdmin' : '/auth/loginUser';
      const { data } = await axios.post(endpoint, { correo, pass });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch {
      setMensaje('Credenciales incorrectas');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h3 className="text-center">Iniciar sesión</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} required />
            </div>
            <div className="mb-3">
              <select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button className="btn btn-primary w-100" type="submit">Ingresar</button>
            {mensaje && <div className="alert alert-danger mt-2">{mensaje}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
