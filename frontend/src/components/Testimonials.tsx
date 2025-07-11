import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    { id: 1, quote: "Great platform with easy M-Pesa payments!", author: "Jane, Mombasa" },
    { id: 2, quote: "Love the MetaMask integration!", author: "Ali, Nairobi" },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Trusted by Bettors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-gray-900 font-medium">- {testimonial.author}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6 flex justify-center space-x-4">
          <span>Blockchain</span>
          <span>M-Pesa</span>
          <span>Visa</span>
          <span>MetaMask</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;