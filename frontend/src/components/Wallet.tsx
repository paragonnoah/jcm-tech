import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<{ balance: number; transactions: any[] }>({
    balance: 0,
    transactions: [],
  });

  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<{ type: string; amount: number } | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWallet = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWallet(res.data);
      } catch (err) {
        console.error('Error fetching wallet:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            navigate('/login');
          }
        } else {
          alert('Unexpected error occurred while fetching wallet');
        }
      }
    };
    fetchWallet();
  }, [token, navigate]);

  const handleDeposit = () => {
    if (depositAmount <= 0) {
      alert("Please enter a valid deposit amount!");
      return;
    }
    setCurrentAction({ type: 'Deposit', amount: depositAmount });
    setShowConfirm(true);
  };

  const handleWithdraw = () => {
    if (withdrawAmount <= 0 || withdrawAmount > wallet.balance) {
      alert("Invalid amount or insufficient balance!");
      return;
    }
    setCurrentAction({ type: 'Withdrawal', amount: withdrawAmount });
    setShowConfirm(true);
  };

  const confirmTransaction = async () => {
    if (!currentAction || !token) return;
    setIsLoading(true);
    setShowConfirm(false);
    try {
      await axios.post(
        'http://localhost:5000/api/wallet/transaction',
        { type: currentAction.type, amount: currentAction.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get('http://localhost:5000/api/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
      alert(`Mock ${currentAction.type} of ${currentAction.amount} KSH successful!`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert('Transaction failed: ' + err.response?.data?.message || 'Unknown error');
      } else {
        alert('Unexpected error during transaction');
      }
    }
    setIsLoading(false);
    setCurrentAction(null);
    setDepositAmount(0);
    setWithdrawAmount(0);
  };

  const cancelTransaction = () => {
    setShowConfirm(false);
    setCurrentAction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center animate-fade-in">My Wallet</h2>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-white">Balance</h3>
            <p className="text-4xl font-bold text-blue-200">{wallet.balance.toFixed(2)} KSH</p>
            <p className="text-lg text-gray-200 mt-2">Registered M-Pesa: 0712345678 (Locked)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-800/50 rounded-lg text-white">
              <h4 className="text-lg font-medium mb-2">Deposit</h4>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 mb-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Amount in KSH"
              />
              <button
                onClick={handleDeposit}
                disabled={isLoading}
                className={`w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Deposit'}
              </button>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg text-white">
              <h4 className="text-lg font-medium mb-2">Withdraw</h4>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 mb-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Amount in KSH"
              />
              <button
                onClick={handleWithdraw}
                disabled={isLoading}
                className={`w-full bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="p-4 bg-gray-800/50 rounded-lg text-white text-center">
              <h4 className="text-lg font-medium">M-Pesa</h4>
              <p className="text-sm text-gray-300 mb-2">0712345678 (Locked)</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-semibold text-white mb-4">Transaction History</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {wallet.transactions.map((tx, index) => (
                <div key={index} className="p-2 bg-gray-700/50 rounded-lg text-white animate-slide-up">
                  {tx.type}: {tx.amount} KSH via {tx.method} - {tx.date}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition transform hover:-translate-y-1"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg w-11/12 max-w-md text-white">
              <h3 className="text-xl font-semibold mb-4">Confirm Transaction</h3>
              <p>Are you sure you want to {currentAction?.type.toLowerCase()} {currentAction?.amount} KSH via M-Pesa?</p>
              <p className="text-sm text-gray-200 mt-2">Phone: 0712345678</p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={cancelTransaction}
                  className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTransaction}
                  disabled={isLoading}
                  className={`bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
