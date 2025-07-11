import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login for dev (no database)
    console.log("Logging in with:", identifier);
    alert("Dev login successful! Redirecting to homepage.");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/50 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter username or email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition transform hover:-translate-y-1"
          >
            Login
          </button>
          <div className="text-center">
            <a href="#" className="text-blue-200 hover:underline">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;