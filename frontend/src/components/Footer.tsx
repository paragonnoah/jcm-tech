import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-4">
          <a href="#" className="hover:text-blue-200 mx-2">About Us</a>
          <a href="#" className="hover:text-blue-200 mx-2">Terms of Service</a>
          <a href="#" className="hover:text-blue-200 mx-2">Privacy Policy</a>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:text-blue-200">Twitter</a>
          <a href="#" className="hover:text-blue-200">Telegram</a>
        </div>
        <p>Contact: <a href="mailto:support@jcm-p2p.com" className="hover:text-blue-200">support@jcm-p2p.com</a></p>
        <div className="mt-4 flex justify-center space-x-4">
          <span>MetaMask</span>
          <span>M-Pesa</span>
          <span>Card</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;