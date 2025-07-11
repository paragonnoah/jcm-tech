import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">JCM-P2P</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:text-blue-200">Home</a>
          <a href="#" className="hover:text-blue-200">Markets</a>
          <a href="#" className="hover:text-blue-200">My Bets</a>
          <a href="#" className="hover:text-blue-200">Wallet</a>
        </nav>
        <div className="space-x-4">
          <button className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition">Login</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">Signup</button>
        </div>
      </div>
    </header>
  );
};

export default Header;