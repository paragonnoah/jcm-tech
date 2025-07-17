import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  joinedDate: string;
  phone: string;
}

interface Transaction {
  type: string;
  amount: number;
  date: string;
  method?: string;
}

interface WalletData {
  balance: number;
  user: User;
  transactions: Transaction[];
}

interface Market {
  id: number;
  question: string;
  category: string;
  subcategory?: string;
  total_stake: number;
  outcome_options: string[];
  progress: number;
  bets: { id: number; user_id: number; outcome: string; amount: number; timestamp: string }[];
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in useEffect:', token);
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const [walletResponse, marketsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/wallet', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/markets', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        console.log('Wallet response:', walletResponse.data);
        console.log('Markets response:', marketsResponse.data);
        const walletData = walletResponse.data;
        setUser(walletData.user);
        setWallet({
          ...walletData,
          balance: typeof walletData.balance === 'number' ? walletData.balance : 0,
        });
        setMarkets(marketsResponse.data);
      } catch (err) {
        console.error('Auth error:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            navigate('/login');
          } else {
            alert('Error loading dashboard: ' + (err.response?.data?.message || 'Unknown error'));
          }
        } else if (err instanceof Error) {
          alert('Error loading dashboard: ' + err.message);
        } else {
          alert('Unexpected error occurred');
        }
      }
    };

    fetchUserData();

    const timer = setInterval(() => {
      if (wallet) {
        setWallet(prev => prev ? { ...prev, balance: typeof prev.balance === 'number' ? prev.balance + (Math.random() - 0.5) * 10 : 0 } : null);
      }
      setMarkets(prev => prev.map(m => ({ ...m, progress: Math.min(100, (m.progress || 0) + (Math.random() - 0.5) * 5) })));
      if (messages.length < 10) {
        const mockUsers = ["Jane", "Ali", "Fatima"];
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomMarket = markets.length > 0 ? markets[Math.floor(Math.random() * markets.length)] : { question: 'No active markets' };
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: randomUser,
          text: `Discussing ${randomMarket.question}`,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [navigate]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Logged out successfully!");
    navigate('/login');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: user.name,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setNewMessage('');
    }
  };

  if (!user || !wallet) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">Welcome, {user.name}!</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Profile</h3>
            <p className="text-gray-200">Name: {user.name}</p>
            <p className="text-gray-200">Email: {user.email}</p>
            <p className="text-gray-200">Joined: {user.joinedDate}</p>
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Wallet</h3>
            <p className="text-3xl font-bold text-blue-200 mb-2">{wallet.balance.toFixed(2)} KSH</p>
            <p className="text-gray-200 mb-4">Registered M-Pesa: {user.phone} (Locked)</p>
            <button
              onClick={() => navigate('/wallet')}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Manage Wallet
            </button>
          </div>

          <div className="lg:col-span-1 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Stats</h3>
            <p className="text-gray-200">Markets Participated: 3</p>
            <p className="text-gray-200">Total Bets: 5</p>
            <p className="text-gray-200">Wins: 2</p>
          </div>

          <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Active Markets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markets.map((market) => (
                <div key={market.id} className="p-4 bg-gray-800/50 rounded-lg text-white">
                  <h4 className="text-lg font-medium mb-2">{market.question || 'No question'}</h4>
                  <p className="text-sm text-gray-300 mb-1">Type: {market.category || 'Unknown'} {market.subcategory && `(${market.subcategory})`}</p>
                  <p className="text-sm text-gray-300 mb-1">Total Stake: {market.total_stake || 0} KSH</p>
                  <p className="text-sm text-gray-300 mb-1">Outcomes: {market.outcome_options ? market.outcome_options.join(', ') : 'No outcomes'}</p>
                  <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${market.progress || 0}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-100">Progress: {market.progress || 0}%</p>
                  <button
                    onClick={() => navigate(`/place-bet/${market.id}`)}
                    className="mt-2 w-full bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Place Bet
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4 flex justify-between items-center">
              Transaction History
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="text-blue-200 hover:text-blue-300"
              >
                {showTransactions ? 'Hide' : 'Show'}
              </button>
            </h3>
            {showTransactions && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {wallet.transactions.map((tx, index) => (
                  <div key={index} className="p-2 bg-gray-700/50 rounded-lg text-white animate-slide-up">
                    {tx.type}: {tx.amount} KSH via {tx.method || 'N/A'} - {tx.date || 'N/A'}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4 flex justify-between items-center">
              Chatroom
              <button
                onClick={() => setShowChat(!showChat)}
                className="text-blue-200 hover:text-blue-300"
              >
                {showChat ? 'Hide' : 'Show'}
              </button>
            </h3>
            {showChat && (
              <div className="h-64 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-2 rounded-lg ${msg.sender === user.name ? 'bg-blue-500 self-end' : 'bg-gray-700'} text-white animate-slide-up`}>
                      <p><strong>{msg.sender}</strong>: {msg.text}</p>
                      <p className="text-xs text-gray-300">{msg.timestamp}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;