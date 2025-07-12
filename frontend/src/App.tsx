import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import MarketPreview from './components/MarketPreview';
import HowItWorks from './components/HowItWorks';
import PaymentOptions from './components/PaymentOptions';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Markets from './components/Markets';
import Wallet from './components/Wallet';
import CreateMarket from './components/CreateMarket';
import Dashboard from './components/Dashboard';
import { Web3 } from 'web3';

interface AppProps {
  web3?: Web3;
}

const App: React.FC<AppProps> = ({ web3 }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <Routes>
        <Route path="/" element={<><Hero /><MarketPreview /><HowItWorks /><PaymentOptions /><Testimonials /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/create-market" element={<CreateMarket />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;