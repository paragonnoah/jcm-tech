import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Web3 } from 'web3';
import './index.css';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const initializeWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error("User denied account access or MetaMask error:", error);
      return null;
    }
  } else {
    console.log("Please install MetaMask!");
    return null;
  }
};

initializeWeb3().then((web3) => {
  if (web3) {
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App web3={web3} />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
});