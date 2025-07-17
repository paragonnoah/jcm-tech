import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateMarket: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    category: 'General',
    subcategory: '',
    totalStake: 0,
    outcomeOptions: ['Option 1', 'Option 2'],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const categories = ['General', 'Sports', 'Politics', 'Weather', 'Other', 'Football', 'Election'];
  const subcategories = {
    General: ['Personal Bets', 'Challenges'],
    Sports: ['Football', 'Basketball', 'Cricket'],
    Politics: ['Elections', 'Referendum'],
    Weather: ['Rain', 'Temperature', 'Wind', 'Storm'],
    Other: ['Custom'],
    Football: ['Premier League', 'Kenyan Premier League', 'International', 'La Liga', 'Serie A', 'UEFA Champions League', 'World Cup', 'Africa Cup of Nations'],
    Election: ['National', 'Local', 'Referendum'],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalStake' ? parseFloat(value) || 0 : value,
    }));
    setError(null);
  };

  const handleOutcomeChange = (index: number, value: string) => {
    setFormData(prev => {
      const newOutcomes = [...prev.outcomeOptions];
      newOutcomes[index] = value;
      return { ...prev, outcomeOptions: newOutcomes };
    });
  };

  const addOutcome = () => {
    setFormData(prev => ({
      ...prev,
      outcomeOptions: [...prev.outcomeOptions, `Option ${prev.outcomeOptions.length + 1}`],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    if (!formData.question || formData.totalStake <= 0 || formData.outcomeOptions.length < 2) {
      setError('Please provide a valid question, stake amount (> 0), and at least 2 outcome options!');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/create-market',
        {
          question: formData.question,
          category: formData.category,
          subcategory: formData.category === 'General' || formData.category === 'Sports' || formData.category === 'Politics' || formData.category === 'Weather' || formData.category === 'Other' || formData.category === 'Football' || formData.category === 'Election' ? formData.subcategory : null,
          totalStake: formData.totalStake,
          outcomeOptions: formData.outcomeOptions,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (window.confirm('Market created successfully! Redirect to markets?')) {
        navigate('/markets');
      }
    } catch (err) {
      console.error('Error creating market:', err);
      setError(axios.isAxiosError(err) ? err.response?.data?.message : 'Failed to create market');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">Create Your Market</h2>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., Who will win the bet? (Team A or Team B)"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {(formData.category === 'General' || formData.category === 'Sports' || formData.category === 'Politics' || formData.category === 'Weather' || formData.category === 'Other' || formData.category === 'Football' || formData.category === 'Election') && (
              <div>
                <label className="block text-white mb-2">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">None</option>
                  {subcategories[formData.category].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-white mb-2">Total Stake Amount (KSH)</label>
              <input
                type="number"
                name="totalStake"
                value={formData.totalStake}
                onChange={handleChange}
                step="0.01"
                min="1"
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 1000"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Outcome Options</label>
              {formData.outcomeOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOutcomeChange(index, e.target.value)}
                  className="w-full p-3 mb-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Outcome ${index + 1}`}
                  required
                />
              ))}
              <button
                type="button"
                onClick={addOutcome}
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Outcome
              </button>
            </div>
            {error && <p className="text-red-200 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition transform hover:-translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating...' : 'Create Market'}
            </button>
          </form>
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

export default CreateMarket;