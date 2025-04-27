import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Login from './components/Login';
import Register from './components/Register';
import IndexUsuario from './components/IndexUsuario';
import IndexUsuarioAdministrador from './components/IndexUsuarioAdministrador';
//import ModoAdministrador from './components/ModoAdministrador'
import ProtectedRoute from './utils/ProtectedRoute';
import ProtectedAdminRoute from './utils/ProtectedAdminRoute';



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


        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}