import React from 'react';

interface Market {
  id: number;
  question: string;
  type: string;
  progress: number; // Percentage for progress bar (0-100)
}

const MarketList: React.FC = () => {
  const markets: Market[] = [
    { id: 1, question: "Will Gor Mahia win next match?", type: "Football", progress: 75 },
    { id: 2, question: "Will Party X win 2027 election?", type: "Election", progress: 45 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Markets</h2>
      <ul className="space-y-6">
        {markets.map((market) => (
          <li key={market.id} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">{market.question}</h3>
            <p className="text-gray-500">Type: {market.type}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${market.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{market.progress}% Complete</p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Bet Now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketList;