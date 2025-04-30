import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Login from './components/Login';
import Register from './components/Register';
import IndexUsuario from './components/IndexUsuario';
import IndexUsuarioAdministrador from './components/IndexUsuarioAdministrador';
import ModoAdministrador from './components/ModoAdministrador';
import ModoAdministradorObjetivos from './components/ModoAdministradorObjetivos';
import ProtectedRoute from './utils/ProtectedRoute';
import ProtectedAdminRoute from './utils/ProtectedAdminRoute';
import ModoAdministradorProductos from './components/ModoAdministradorProductos';
import ModoUsuarioProductos from './components/ModoUsuarioProductos';
import ModoUsuarioObjetivos from './components/ModoUsuarioObjetivos';
import ModoAdministradorUsuarios from './components/ModoAdministradorUsuarios';
import Perfil from './components/Perfil';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/indexUsuario"
          element={
            <ProtectedRoute>
              <IndexUsuario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/indexUsuarioAdministrador"
          element={
            <ProtectedAdminRoute>
              <IndexUsuarioAdministrador />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/modoAdministrador"
          element={
            <ProtectedAdminRoute>
              <ModoAdministrador />
            </ProtectedAdminRoute>
          }
        />

        <Route 
        path="/modoAdministradorObjetivos" 
        element={
          <ProtectedAdminRoute>
            <ModoAdministradorObjetivos />
          </ProtectedAdminRoute>
        } />

        <Route
          path="/modoAdministradorProductos"
          element={
            <ProtectedAdminRoute>
              <ModoAdministradorProductos />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/modoAdministradorUsuarios"
          element={
            <ProtectedAdminRoute>
              <ModoAdministradorUsuarios />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <ModoUsuarioProductos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/objetivos"
          element={
            <ProtectedRoute>
              <ModoUsuarioObjetivos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}