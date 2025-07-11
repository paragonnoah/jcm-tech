import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold mb-4 animate-fade-in">Welcome to JCM-P2P Prediction Market</h2>
        <p className="text-xl mb-6 animate-fade-in-delay">Bet on real-world outcomes with blockchain, M-Pesa, or card payments.</p>
        <div className="flex justify-center space-x-4 mb-6">
          <button className="bg-white text-blue-700 px-6 py-3 rounded-full hover:bg-blue-100 transition">Get Started</button>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition">Explore Markets</button>
        </div>
        <div className="flex justify-center space-x-4">
          <span>MetaMask</span>
          <span>M-Pesa</span>
          <span>Card</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;