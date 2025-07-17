import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold mb-4 animate-fade-in">Welcome to JCM-P2P Prediction Market</h2>
        <p className="text-xl mb-6 animate-fade-in-delay">Bet on real-world outcomes with secure M-Pesa payments and more.</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Link to="/signup" className="bg-white text-blue-700 px-6 py-3 rounded-full hover:bg-blue-100 transition">Get Started</Link>
          <Link to="/markets" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition">Explore Markets</Link>
        </div>
        <div className="flex justify-center space-x-4">
          <span className="hover:text-yellow-300 transition">MetaMask</span>
          <span className="hover:text-green-300 transition">M-Pesa</span>
          <span className="hover:text-gray-300 transition">Card</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;