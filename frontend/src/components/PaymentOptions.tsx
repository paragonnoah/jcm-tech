import React from 'react';

const PaymentOptions: React.FC = () => {
  const options = [
    { id: 1, name: "MetaMask", description: "Secure blockchain wallet", action: "Connect" },
    { id: 2, name: "M-Pesa", description: "Fast mobile payments in Kenya", action: "Link" },
    { id: 3, name: "Card", description: "Credit/Debit card support", action: "Add Card" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Multiple Payment Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <div key={option.id} className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                {option.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentOptions;