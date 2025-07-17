import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsername(res.data.name || 'User');
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUsername('User');
        }
      };
      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">JCM-P2P</h1>
        <nav className="space-x-6">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/markets" className="hover:text-blue-200">Markets</Link>
          <Link to="/create-market" className="hover:text-blue-200">Create Market</Link>
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/wallet" className="hover:text-blue-200">Wallet</Link>
        </nav>
        <div className="space-x-4 flex items-center">
          {token ? (
            <>
              <span className="text-white">Hi {username}</span>
              <Link to="/profile" className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition">Login</Link>
              <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;