import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Wallet {
  balance: number;
  paymentMethods: { type: string; connected: boolean; details?: string }[];
}

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<Wallet>({
    balance: 10.5, // Mock initial balance in ETH
    paymentMethods: [
      { type: 'MetaMask', connected: true, details: '0x1234...abcd' },
      { type: 'M-Pesa', connected: false, details: '' },
      { type: 'Card', connected: false, details: '' },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate balance update animation
    const timer = setInterval(() => {
      setWallet(prev => ({ ...prev, balance: prev.balance + (Math.random() - 0.5) * 0.1 }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleConnect = (type: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setWallet(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map(method =>
          method.type === type ? { ...method, connected: !method.connected } : method
        ),
      }));
      setIsLoading(false);
      alert(`Dev mode: ${type} ${wallet.paymentMethods.find(m => m.type === type)?.connected ? 'disconnected' : 'connected'}!`);
    }, 1000); // Simulate API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">My Wallet</h2>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-white">Balance</h3>
            <p className="text-4xl font-bold text-blue-200 animate-pulse">{wallet.balance.toFixed(2)} ETH</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallet.paymentMethods.map((method) => (
              <div key={method.type} className="p-4 bg-gray-800/50 rounded-lg text-white text-center">
                <h4 className="text-lg font-medium">{method.type}</h4>
                <p className="text-sm text-gray-300 mb-2">{method.details || 'Not connected'}</p>
                <button
                  onClick={() => handleConnect(method.type)}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-full transition ${method.connected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Connecting...' : method.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/markets')}
              className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition transform hover:-translate-y-1"
            >
              Back to Markets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;