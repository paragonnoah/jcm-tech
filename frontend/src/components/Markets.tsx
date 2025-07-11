import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Market {
  id: number;
  question: string;
  options: { label: string; percentage: number; color: string }[];
  volume: string;
  category: string;
}

const mockMarkets: Market[] = [
  {
    id: 1,
    question: "Will Gor Mahia win against AFC Leopards this weekend?",
    options: [
      { label: "Yes", percentage: 64, color: "bg-green-500" },
      { label: "No", percentage: 36, color: "bg-red-500" },
    ],
    volume: "KSh 2.1M Vol.",
    category: "Football",
  },
  {
    id: 2,
    question: "Will William Ruto win a second term in 2027?",
    options: [
      { label: "Yes", percentage: 58, color: "bg-green-500" },
      { label: "No", percentage: 42, color: "bg-red-500" },
    ],
    volume: "KSh 3.5M Vol.",
    category: "Politics",
  },
  {
    id: 3,
    question: "Will it rain in Nairobi CBD tomorrow?",
    options: [
      { label: "Yes", percentage: 47, color: "bg-green-500" },
      { label: "No", percentage: 53, color: "bg-red-500" },
    ],
    volume: "KSh 350K Vol.",
    category: "Weather",
  },
  {
    id: 4,
    question: "Will Safaricom stock price go up this month?",
    options: [
      { label: "Yes", percentage: 34, color: "bg-green-500" },
      { label: "No", percentage: 66, color: "bg-red-500" },
    ],
    volume: "KSh 780K Vol.",
    category: "Finance",
  },
];

const Markets: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const navigate = useNavigate();

  const filteredMarkets = filter === 'All'
    ? mockMarkets
    : mockMarkets.filter((m) => m.category === filter);

  const handleBet = (marketId: number) => {
    alert(`Redirecting to market ${marketId}`);
    navigate(`/market/${marketId}`); // Placeholder for actual market route
  };

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4 md:px-16 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Kenyan Prediction Markets</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["All", "Football", "Politics", "Weather", "Finance"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full border ${
              filter === cat ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            } hover:bg-blue-700 transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map((market) => (
          <div
            key={market.id}
            className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{market.question}</h2>
              <div className="space-y-2 mb-4">
                {market.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-700 rounded-full px-4 py-2"
                  >
                    <span>{opt.label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-20 h-2 rounded-full ${opt.color}`} style={{ width: `${opt.percentage}%` }} />
                      <span>{opt.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{market.volume}</span>
              <button
                onClick={() => handleBet(market.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full"
              >
                Bet
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => alert('Coming soon: Add Market')}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full"
        >
          + Add Your Own Market
        </button>
      </div>
    </div>
  );
};

export default Markets;
