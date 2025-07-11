import React, { useState } from 'react';

interface BettingFormProps {
  onBet: (choice: boolean, amount: string) => void;
}

const BettingForm: React.FC<BettingFormProps> = ({ onBet }) => {
  const [choice, setChoice] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBet(choice === 'yes', amount);
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Place Your Bet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Choice:</label>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value as 'yes' | 'no')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Amount (ETH):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Submit Bet
        </button>
      </form>
    </div>
  );
};

export default BettingForm;