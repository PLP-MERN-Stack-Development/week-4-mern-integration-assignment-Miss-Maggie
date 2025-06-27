import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <nav className="bg-blue-700 dark:bg-gray-900 text-white px-4 py-3 shadow flex items-center justify-between">
      <div className="font-bold text-xl">
        <Link to="/" className="hover:text-blue-200">MERN Blog</Link>
      </div>
      <div className="space-x-4 flex items-center">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-yellow-300 px-2 py-1 rounded mr-2"
          title="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        <Link to="/" className="hover:text-blue-200">Home</Link>
        {user && (
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
        )}
        {!user && (
          <>
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link to="/register" className="hover:text-blue-200">Register</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout} className="ml-2 bg-blue-800 px-3 py-1 rounded hover:bg-blue-900 transition">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar; 