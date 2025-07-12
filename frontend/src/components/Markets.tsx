import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Market {
  id: number;
  question: string;
  type: string;
  subcategory?: string;
  progress: number;
  oddsYes: number;
  oddsNo: number;
}

const Markets: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const markets: Market[] = [
    { id: 1, question: "Will Gor Mahia win next match?", type: "Football", subcategory: "Kenyan Premier League", progress: 75, oddsYes: 1.8, oddsNo: 2.2 },
    { id: 2, question: "Will Manchester City win EPL?", type: "Football", subcategory: "Premier League", progress: 45, oddsYes: 2.5, oddsNo: 1.6 },
    { id: 3, question: "Will rain fall tomorrow?", type: "Weather", progress: 60, oddsYes: 1.5, oddsNo: 2.7 },
    { id: 4, question: "Will Party X win 2027 election?", type: "Election", progress: 30, oddsYes: 2.0, oddsNo: 1.9 },
    { id: 5, question: "Will Harambee Stars qualify?", type: "Football", subcategory: "International", progress: 50, oddsYes: 2.1, oddsNo: 1.7 },
  ];

  const filteredMarkets = markets.filter(market => 
    market.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || market.type === filter) &&
    (filter === 'Football' ? !filterSubcategory || market.subcategory === filterSubcategory : true)
  );

  const handleBet = (marketId: number) => {
    console.log(`Betting on market ID: ${marketId}`);
    alert("Dev mode: Redirecting to bet placement (to be implemented).");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">All Markets</h2>
        <div className="mb-6 flex justify-center space-x-4 flex-wrap">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search markets..."
            className="px-4 py-2 rounded-full bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => { setFilter('all'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            All
          </button>
          <button
            onClick={() => { setFilter('Football'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Football' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Football
          </button>
          {filter === 'Football' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Football</option>
              <option value="Premier League">Premier League</option>
              <option value="Kenyan Premier League">Kenyan Premier League</option>
              <option value="International">International</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('Election'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Election' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Election
          </button>
          <button
            onClick={() => { setFilter('Weather'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Weather' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Weather
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <div key={market.id} className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-2">{market.question}</h3>
              <p className="text-gray-200 mb-2">Type: {market.type} {market.subcategory && `(${market.subcategory})`}</p>
              <div className="w-full bg-gray-300 rounded-full h-3 mb-2">
                <div className="bg-blue-400 h-3 rounded-full" style={{ width: `${market.progress}%` }}></div>
              </div>
              <p className="text-sm text-gray-100 mb-2">{market.progress}% Complete</p>
              <div className="flex justify-between text-sm text-gray-100 mb-4">
                <span>Yes: {market.oddsYes.toFixed(1)}</span>
                <span>No: {market.oddsNo.toFixed(1)}</span>
              </div>
              <button
                onClick={() => handleBet(market.id)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
              >
                Bet Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Markets;