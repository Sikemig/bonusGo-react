import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MySwal = withReactContent(Swal);

export default function ObjetivosUsuario() {
  const [objetivos, setObjetivos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [monedas, setMonedas] = useState(0);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const [objetivosHabilitados, setObjetivosHabilitados] = useState([]);
  const navigate = useNavigate();
>>>>>>> Stashed changes

  useEffect(() => {
    fetchObjetivos().then((listaObjetivos) => fetchObjetivosHabilitadosParaUsuario(listaObjetivos));
    fetchUsuario();
  }, []);

  const fetchObjetivos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/objetivos/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjetivos(response.data);
      return response.data;
    } catch (error) {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      console.error('Error al obtener objetivos:', error);
=======
      console.error('Error al obtener todos los objetivos:', error);
      return [];
>>>>>>> Stashed changes
=======
      console.error('Error al obtener todos los objetivos:', error);
      return [];
>>>>>>> Stashed changes
=======
      console.error('Error al obtener todos los objetivos:', error);
      return [];
>>>>>>> Stashed changes
    }
  };

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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const marcarObjetivo = async (idObjetivo, nombre, pigcoins) => {
=======
  const fetchObjetivosHabilitadosParaUsuario = async (listaObjetivos) => {
=======
  const fetchObjetivosHabilitadosParaUsuario = async (listaObjetivos) => {
=======
  const fetchObjetivosHabilitadosParaUsuario = async (listaObjetivos) => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      const habilitados = [];
  
      for (const obj of listaObjetivos) {
        const response = await axios.get(`http://localhost:8080/ganancia/habilitados?idObjetivo=${obj.idObjetivo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.includes(parseInt(idUsuario))) {
          habilitados.push(obj.idObjetivo);
        }
      }
  
      setObjetivosHabilitados(habilitados);
    } catch (error) {
      console.error('Error al verificar objetivos habilitados para usuario:', error);
    }
  };

  const handleCanjearObjetivo = async (idObjetivo) => {
>>>>>>> Stashed changes
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      const habilitados = [];
  
      for (const obj of listaObjetivos) {
        const response = await axios.get(`http://localhost:8080/ganancia/habilitados?idObjetivo=${obj.idObjetivo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.includes(parseInt(idUsuario))) {
          habilitados.push(obj.idObjetivo);
        }
      }
  
      setObjetivosHabilitados(habilitados);
    } catch (error) {
      console.error('Error al verificar objetivos habilitados para usuario:', error);
    }
  };

  const handleCanjearObjetivo = async (idObjetivo) => {
>>>>>>> Stashed changes
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');
    try {
      const habilitados = [];
  
      for (const obj of listaObjetivos) {
        const response = await axios.get(`http://localhost:8080/ganancia/habilitados?idObjetivo=${obj.idObjetivo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.includes(parseInt(idUsuario))) {
          habilitados.push(obj.idObjetivo);
        }
      }
  
      setObjetivosHabilitados(habilitados);
    } catch (error) {
      console.error('Error al verificar objetivos habilitados para usuario:', error);
    }
  };

  const handleCanjearObjetivo = async (idObjetivo) => {
>>>>>>> Stashed changes
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('id');

    try {
      await axios.put(`http://localhost:8080/objetivos/canjear/${idObjetivo}?idUsuario=${idUsuario}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

      await MySwal.fire({
        title: '🎉 ¡Buen trabajo!',
        html: `
          <div style="font-size: 1.2rem;">
            Has completado <strong>${nombre}</strong><br>
            <div class="mt-2">
              <img src="Pigcoin.png" alt="Pigcoin" style="width: 25px; vertical-align: middle; margin-right: 5px;">
              <strong>${pigcoins} Pigcoins</strong> han sido añadidos a tu cuenta.
            </div>
          </div>
        `,
        icon: 'success',
        iconColor: '#4caf50',
        background: '#f0f9ff',
        showConfirmButton: true,
        confirmButtonText: '¡Seguir cumpliendo!',
        customClass: {
          popup: 'rounded-4 shadow-lg',
          title: 'text-success fw-bold',
          confirmButton: 'btn btn-primary rounded-pill px-4'
        }
      });

      fetchObjetivos();
=======
      alert('Objetivo canjeado con éxito!');
      fetchObjetivos().then(fetchObjetivosHabilitadosParaUsuario);
>>>>>>> Stashed changes
=======
      alert('Objetivo canjeado con éxito!');
      fetchObjetivos().then(fetchObjetivosHabilitadosParaUsuario);
>>>>>>> Stashed changes
=======
      alert('Objetivo canjeado con éxito!');
      fetchObjetivos().then(fetchObjetivosHabilitadosParaUsuario);
>>>>>>> Stashed changes
      fetchUsuario();

    } catch (error) {
      console.error('Error al canjear objetivo:', error);
      MySwal.fire('Error', 'No se pudo canjear este objetivo.', 'error');
    }
  };

  const colorClass = (categoria) => {
    if (categoria.includes('Capacitación')) return 'pastel-blue';
    if (categoria.includes('Innovación')) return 'pastel-green';
    if (categoria.includes('Compromiso')) return 'pastel-pink';
    return 'pastel-gray';
  };

  return (
    <div className="container py-5">
      <style>{`
        .img-uniform {
          object-fit: cover;
          height: 200px;
          width: 100%;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }

        .pigcoin-icon {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }

        .pastel-blue {
          background: linear-gradient(#e3f2fd, #bbdefb);
          border: 2px solid #90caf9;
          border-radius: 1rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .pastel-green {
          background: linear-gradient(#e8f5e9, #c8e6c9);
          border: 2px solid #81c784;
          border-radius: 1rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .pastel-pink {
          background: linear-gradient(#fce4ec, #f8bbd0);
          border: 2px solid #f48fb1;
          border-radius: 1rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .pastel-gray {
          background: linear-gradient(#f1f1f1, #dddddd);
          border: 2px solid #bcbcbc;
          border-radius: 1rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <h3 className="mb-4">Hola {usuario}, tienes {monedas} PigCoins</h3>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        {objetivos.map((obj) => (
          <div className="col" key={obj.id_objetivo}>
            <div className={`card h-100 ${colorClass(obj.categoria)}`}>
              <img src={obj.imagenUrl || 'https://via.placeholder.com/300x200'} className="card-img-top img-uniform" alt={obj.nombre} />
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{obj.nombre}</h5>
                  <p className="badge bg-secondary mb-2">{obj.categoria}</p>
                  <p className="text-muted small mb-2">{obj.descripcion}</p>
                </div>
                <div>
                  <button
                    className="btn btn-outline-dark rounded-pill mt-3"
                    onClick={() => marcarObjetivo(obj.id_objetivo, obj.nombre, obj.valor)}
                  >
                    Marcar como completado
                  </button>
                  <p className="fw-bold mt-2 d-flex justify-content-center align-items-center">
                    <img src="Pigcoin.png" alt="Pigcoin" className="pigcoin-icon" />
                    {obj.valor} Pigcoins
                  </p>
                </div>
              </div>
            </div>
          </div>
<<<<<<< Updated upstream
        ))}
=======
        </div>
      </nav>

      {/* Título */}
      <div className="bienvenida">OBJETIVOS DISPONIBLES</div>

      {/* Tabla objetivos */}
      <div className="container mt-4">
        <div className="row">
          {objetivos.map((objetivo) => {
            const estaHabilitado = objetivosHabilitados.includes(objetivo.idObjetivo);
            return (
              <div className="col-md-4 mb-4" key={objetivo.idObjetivo}>
                <div className={`card h-100 shadow-sm ${!estaHabilitado ? 'bg-light text-muted' : ''}`}>
                  {objetivo.imagen && (
                    <img
                      src={objetivo.imagen}
                      className="card-img-top"
                      alt={objetivo.nombre}
                      style={{ filter: !estaHabilitado ? 'grayscale(100%) brightness(70%)' : 'none' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{objetivo.nombre}</h5>
                      <p className="card-text">{objetivo.descripcion}</p>
                      <p className="card-text"><strong>Coste:</strong> {objetivo.valor} PigCoins</p>
                    </div>
                    <button
                      className="btn btn-success mt-3"
                      onClick={() => handleCanjearObjetivo(objetivo.idObjetivo)}
                      disabled={!estaHabilitado}
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
