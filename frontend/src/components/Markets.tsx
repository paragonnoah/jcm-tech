import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Market {
  id: number;
  question: string;
  category: string;
  subcategory?: string;
  total_stake: number;
  outcome_options: string[] | null;
  progress: number;
  bets: { id: number; user_id: number; outcome: string; amount: number; timestamp: string }[];
}

const Markets: React.FC = () => {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchMarkets = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/api/markets', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // Add timeout to catch slow responses
        });
        console.log('API Response:', res.data); // Debug response
        // Handle outcome_options safely
        const formattedMarkets = res.data.map((market: any) => ({
          ...market,
          outcome_options: Array.isArray(market.outcome_options) 
            ? market.outcome_options 
            : market.outcome_options 
              ? JSON.parse(market.outcome_options) 
              : [],
        }));
        setMarkets(formattedMarkets);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching markets:', err);
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message || 'Server error'
          : 'Network or unknown error';
        setError(`Error fetching markets: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarkets();
  }, [token, navigate]);

  const filteredMarkets = markets.filter(market =>
    market.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || market.category === filter) &&
    (filter === 'Football' ? !filterSubcategory || market.subcategory === filterSubcategory : true)
  );

  if (isLoading) {
    return <div className="text-white text-center py-16">Loading markets...</div>;
  }

  if (error) {
    return <div className="text-white text-center py-16">{error}</div>;
  }

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
              <option value="La Liga">La Liga</option>
              <option value="Serie A">Serie A</option>
              <option value="UEFA Champions League">UEFA Champions League</option>
              <option value="World Cup">World Cup</option>
              <option value="Africa Cup of Nations">Africa Cup of Nations</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('Election'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Election' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Election
          </button>
          {filter === 'Election' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Elections</option>
              <option value="National">National</option>
              <option value="Local">Local</option>
              <option value="Referendum">Referendum</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('Weather'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Weather' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Weather
          </button>
          {filter === 'Weather' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Weather</option>
              <option value="Rain">Rain</option>
              <option value="Temperature">Temperature</option>
              <option value="Wind">Wind</option>
              <option value="Storm">Storm</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('General'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'General' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            General
          </button>
          {filter === 'General' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All General</option>
              <option value="Personal Bets">Personal Bets</option>
              <option value="Challenges">Challenges</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('Sports'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Sports' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Sports
          </button>
          {filter === 'Sports' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Sports</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Cricket">Cricket</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('Politics'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Politics' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Politics
          </button>
          {filter === 'Politics' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Politics</option>
              <option value="Elections">Elections</option>
              <option value="Referendum">Referendum</option>
            </select>
          )}
          <button
            onClick={() => { setFilter('Other'); setFilterSubcategory(''); }}
            className={`px-4 py-2 rounded-full ${filter === 'Other' ? 'bg-blue-500 text-white' : 'bg-white/30 text-white'} hover:bg-blue-600 transition`}
          >
            Other
          </button>
          {filter === 'Other' && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Other</option>
              <option value="Custom">Custom</option>
            </select>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.length > 0 ? (
            filteredMarkets.map((market) => (
              <div key={market.id} className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 animate-fade-in">
                <h3 className="text-xl font-semibold text-white mb-2">{market.question}</h3>
                <p className="text-gray-200 mb-2">Category: {market.category} {market.subcategory && `(${market.subcategory})`}</p>
                <p className="text-white mb-2">Total Stake: {market.total_stake} KSH</p>
                <p className="text-white mb-2">Outcomes: {market.outcome_options ? market.outcome_options.join(', ') : 'No outcomes available'}</p>
                <div className="w-full bg-gray-300 rounded-full h-3 mb-2">
                  <div className="bg-blue-400 h-3 rounded-full" style={{ width: `${market.progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-100 mb-2">{market.progress}% Complete</p>
                <h4 className="text-white mt-2">Ongoing Bets:</h4>
                {market.bets.length > 0 ? (
                  <ul className="text-gray-100 text-sm">
                    {market.bets.map((bet) => (
                      <li key={bet.id}>
                        User {bet.user_id} bet {bet.amount} KSH on {bet.outcome} at {new Date(bet.timestamp).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-200 text-sm">No bets yet.</p>
                )}
                <button
                  onClick={() => navigate(`/place-bet/${market.id}`)}
                  className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                >
                  Place Bet
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No markets found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Markets;