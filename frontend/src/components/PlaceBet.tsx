import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PlaceBet: React.FC = () => {
  const navigate = useNavigate();
  const { marketId } = useParams();
  const [market, setMarket] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get(`http://localhost:5000/api/markets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const marketData = res.data.find((m: any) => m.id === parseInt(marketId || '0'));
        if (marketData) {
          // Handle null or undefined outcome_options by providing a default empty array
          const outcomeOptions = marketData.outcome_options ? JSON.parse(marketData.outcome_options) : [];
          setMarket({ ...marketData, outcome_options: outcomeOptions });
          setSelectedOutcome(outcomeOptions[0] || '');
        } else {
          setMarket(null);
          setError('Market not found');
        }
      })
      .catch(err => {
        console.error('Error fetching market:', err);
        setError('Failed to load market data');
      });
  }, [navigate, token, marketId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!betAmount || betAmount <= 0 || !selectedOutcome) {
      setError('Please provide a valid amount (> 0) and select an outcome!');
      return;
    }
    axios.post('http://localhost:5000/api/place-bet', { marketId, outcome: selectedOutcome, amount: betAmount }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        alert(res.data.message);
        navigate('/markets');
      })
      .catch(err => {
        console.error('Error placing bet:', err);
        setError(err.response?.data?.message || 'Failed to place bet');
      });
  };

  if (!market) return <div className="text-white text-center py-16">{error || 'Loading...'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">Place Bet</h2>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl text-white">{market.question}</h3>
          <p className="text-white">Total Stake: {market.total_stake} KSH</p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-white mb-2">Outcome</label>
              <select
                value={selectedOutcome}
                onChange={(e) => setSelectedOutcome(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {market.outcome_options.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Amount (KSH)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            {error && <p className="text-red-200 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
            >
              Place Bet
            </button>
          </form>
          <button
            onClick={() => navigate('/markets')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Back to Markets
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceBet;