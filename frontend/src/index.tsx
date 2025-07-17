import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Remove the global window.ethereum declaration since it's no longer needed
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// Remove Web3 import and initializeWeb3 function
// import { Web3 } from 'web3';
// const initializeWeb3 = async () => { ... };

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);