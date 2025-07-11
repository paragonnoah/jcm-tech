import React from 'react';

interface Market {
  id: number;
  question: string;
  type: string;
  progress: number;
}

const MarketPreview: React.FC = () => {
  const markets: Market[] = [
    { id: 1, question: "Will Gor Mahia win next match?", type: "Football", progress: 75 },
    { id: 2, question: "Will Party X win 2027 election?", type: "Election", progress: 45 },
    { id: 3, question: "Will rain fall tomorrow?", type: "Weather", progress: 60 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div key={market.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-medium text-gray-900">{market.question}</h3>
              <p className="text-gray-500 mb-2">Type: {market.type}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${market.progress}%` }}></div>
              </div>
              <p className="text-sm text-gray-600">{market.progress}% Complete</p>
              <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Bet Now
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="#" className="text-blue-600 hover:underline">See All Markets</a>
        </div>
      </div>
    </section>
  );
};

export default MarketPreview;