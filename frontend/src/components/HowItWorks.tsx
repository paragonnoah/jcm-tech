import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    { id: 1, title: "Sign Up", description: "Create your account in seconds." },
    { id: 2, title: "Connect Payment", description: "Link MetaMask, M-Pesa, or Card." },
    { id: 3, title: "Place Bets", description: "Bet on your favorite outcomes." },
    { id: 4, title: "Earn Rewards", description: "Receive payouts securely." },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How JCM-P2P Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.id} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl font-bold text-blue-600 mb-2">{step.id}</div>
              <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;