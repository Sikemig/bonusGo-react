// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Creamos el contexto
const AuthContext = createContext();

// Hook para usar el contexto más fácil
export const useAuth = () => useContext(AuthContext);

// Provider que envuelve toda la aplicación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, correo, rol }
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Función para hacer login
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    fetchUser(token);
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // Traer info del usuario con el token
  const fetchUser = async (currentToken) => {
    try {
      const response = await axios.get("/auth/token/info", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      logout(); // Si falla el token, hacemos logout
    } finally {
      setLoading(false);
    }
  };

  // Cuando arranca el provider, si hay token, tratamos de cargar al usuario
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
