import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Login failed: An unknown error occurred';
      if (err instanceof AxiosError) {
        errorMessage = 'Login failed: ' + (err.response?.data?.message || 'Invalid credentials');
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-center">
      <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
            Login
          </button>
        </form>
        <p className="text-center text-gray-200 mt-4">
          Don't have an account? <a href="/signup" className="text-blue-200 hover:text-blue-300">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;