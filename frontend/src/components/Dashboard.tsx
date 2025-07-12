import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wallet from './Wallet';

interface User {
  id: number;
  name: string;
  email: string;
  joinedDate: string;
}

interface Market {
  id: number;
  question: string;
  type: string;
  subcategory?: string;
  progress: number;
  oddsYes: number;
  oddsNo: number;
}

interface Transaction {
  type: string;
  amount: number;
  date: string;
  method?: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: "2025-06-01",
  });
  const [wallet, setWallet] = useState<{ balance: number; transactions: Transaction[] }>({
    balance: 1575,
    transactions: [],
  });
  const [markets, setMarkets] = useState<Market[]>([
    { id: 1, question: "Will Gor Mahia win next match?", type: "Football", subcategory: "Kenyan Premier League", progress: 75, oddsYes: 1.8, oddsNo: 2.2 },
    { id: 2, question: "Will Manchester City win EPL?", type: "Football", subcategory: "Premier League", progress: 45, oddsYes: 2.5, oddsNo: 1.6 },
  ]);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(true);

  useEffect(() => {
    // Simulate real-time updates and mock chat messages
    const timer = setInterval(() => {
      setWallet(prev => ({ ...prev, balance: prev.balance + (Math.random() - 0.5) * 10 }));
      setMarkets(prev => prev.map(m => ({ ...m, progress: Math.min(100, m.progress + (Math.random() - 0.5) * 5) })));
      if (messages.length < 10) {
        const mockUsers = ["Jane", "Ali", "Fatima"];
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: randomUser,
          text: `Discussing ${markets[Math.floor(Math.random() * markets.length)].question}`,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [messages.length, markets]);

  const handleLogout = () => {
    alert("Dev mode: Logged out successfully!");
    navigate('/login');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: user.name,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">Welcome, {user.name}!</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile */}
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

          {/* Wallet Summary */}
          <div className="lg:col-span-1 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Wallet</h3>
            <p className="text-3xl font-bold text-blue-200 mb-2">{wallet.balance.toFixed(2)} KSH</p>
            <p className="text-gray-200 mb-4">Registered M-Pesa: 0712345678 (Locked)</p>
            <button
              onClick={() => navigate('/wallet')}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Manage Wallet
            </button>
          </div>

          {/* Stats Card */}
          <div className="lg:col-span-1 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Stats</h3>
            <p className="text-gray-200">Markets Participated: 3</p>
            <p className="text-gray-200">Total Bets: 5</p>
            <p className="text-gray-200">Wins: 2</p>
          </div>

          {/* Active Markets */}
          <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-white mb-4">Active Markets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markets.map((market) => (
                <div key={market.id} className="p-4 bg-gray-800/50 rounded-lg text-white">
                  <h4 className="text-lg font-medium mb-2">{market.question}</h4>
                  <p className="text-sm text-gray-300 mb-1">Type: {market.type} {market.subcategory && `(${market.subcategory})`}</p>
                  <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${market.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-100">Progress: {market.progress}%</p>
                  <div className="flex justify-between text-xs text-gray-100 mt-2">
                    <span>Yes: {market.oddsYes.toFixed(1)}</span>
                    <span>No: {market.oddsNo.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
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
                    {tx.type}: {tx.amount} KSH via {tx.method} - {tx.date}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chatroom */}
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