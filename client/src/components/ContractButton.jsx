import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContractButton = ({ proposal, onContractGenerated }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [existingContract, setExistingContract] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGenerateContract = async () => {
    try {
      setGenerating(true);
      setError('');
      
      console.log('Generating contract for proposal:', proposal._id);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/generate/${proposal._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Contract generated:', response.data);
      
      // Notify parent component
      if (onContractGenerated) {
        onContractGenerated(response.data.contract);
      }
      
      // Navigate to contract view
      navigate(`/contract/${response.data.contract._id}`);
    } catch (err) {
      console.error('Contract generation error:', err.response?.data || err.message);
      const errorData = err.response?.data || {};
      let errorMsg = errorData.error || 'Failed to generate contract';
      
      // Add hint if available
      if (errorData.hint) {
        errorMsg += `\n${errorData.hint}`;
      }
      
      // Show current status if available
      if (errorData.currentStatus) {
        errorMsg += `\nCurrent status: ${errorData.currentStatus}`;
      }
      
      // If contract already exists, extract the ID and navigate
      if (errorMsg.includes('already exists') && errorData.contractId) {
        console.log('Contract already exists, navigating to:', errorData.contractId);
        navigate(`/contract/${errorData.contractId}`);
        return;
      }
      
      setError(errorMsg);
      setGenerating(false);
    }
  };

  const handleViewContract = () => {
    if (existingContract) {
      navigate(`/contract/${existingContract._id}`);
    }
  };

  // Check if contract exists on mount
  React.useEffect(() => {
    const checkContract = async () => {
      if (proposal.status === 'accepted') {
        setChecking(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/proposal/${proposal._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data && response.data._id) {
            setExistingContract(response.data);
          }
        } catch {
          // Contract doesn't exist yet
          setExistingContract(null);
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };
    
    checkContract();
  }, [proposal._id, proposal.status, token]);

  if (proposal.status !== 'accepted') {
    return null;
  }

  if (checking) {
    return (
      <div className="mt-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If contract exists, show "View Contract" button
  if (existingContract) {
    return (
      <div className="mt-4">
        <button
          onClick={handleViewContract}
          className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-colors"
        >
          📄 View Contract
        </button>
        <p className="mt-2 text-xs text-gray-600 text-center">
          Contract Status: <span className="font-semibold capitalize">{existingContract.status.replace('_', ' ')}</span>
        </p>
      </div>
    );
  }

  // Otherwise, show "Generate Contract" button
  return (
    <div className="mt-4">
      <button
        onClick={handleGenerateContract}
        disabled={generating}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
          generating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {generating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating Contract with AI...
          </span>
        ) : (
          '📄 Generate Contract with AI'
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 text-center">
          {error.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      
      <p className="mt-2 text-xs text-gray-600 text-center">
        AI will create a professional contract based on project details
      </p>
    </div>
  );
};

export default ContractButton;
