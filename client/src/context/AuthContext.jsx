import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await registerUser(name, email, password);
      setUser(userData);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 