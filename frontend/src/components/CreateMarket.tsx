import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateMarket: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    category: 'Football',
    subcategory: '',
    oddsYes: 1.5,
    oddsNo: 1.5,
  });

  const categories = ['Football', 'Election', 'Weather'];
  const subcategories = {
    Football: ['Premier League', 'Kenyan Premier League', 'International'],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'oddsYes' || name === 'oddsNo' ? parseFloat(value) || 1.5 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || formData.oddsYes <= 1 || formData.oddsNo <= 1) {
      alert("Please provide a valid question and odds greater than 1!");
      return;
    }
    // Mock market creation
    console.log("Creating market:", formData);
    alert("Dev mode: Market created successfully! Redirecting to markets.");
    navigate('/markets');
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
                placeholder="e.g., Will Gor Mahia win next match?"
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
            {formData.category === 'Football' && (
              <div>
                <label className="block text-white mb-2">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">None</option>
                  {subcategories.Football.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-white mb-2">Odds for Yes</label>
              <input
                type="number"
                name="oddsYes"
                value={formData.oddsYes}
                onChange={handleChange}
                step="0.1"
                min="1.1"
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 1.5"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Odds for No</label>
              <input
                type="number"
                name="oddsNo"
                value={formData.oddsNo}
                onChange={handleChange}
                step="0.1"
                min="1.1"
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 1.5"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition transform hover:-translate-y-1"
            >
              Create Market
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