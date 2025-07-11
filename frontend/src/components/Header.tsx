import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">JCM-P2P</h1>
        <nav className="space-x-6">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/markets" className="hover:text-blue-200">Markets</Link>
          <Link to="/bets" className="hover:text-blue-200">My Bets</Link>
          <Link to="/wallet" className="hover:text-blue-200">Wallet</Link>
        </nav>
        <div className="space-x-4">
          <Link to="/login" className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition">Login</Link>
          <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">Signup</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
