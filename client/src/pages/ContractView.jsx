import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const ContractView = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');
  const [signing, setSigning] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState('');
  const token = localStorage.getItem('token');
  
  // Get user data from localStorage (stored as separate items, not JSON)
  const user = {
    id: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email')
  };

  useEffect(() => {
    fetchContract();
    fetchPayPalConfig();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/${contractId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load contract');
      setLoading(false);
    }
  };

  const fetchPayPalConfig = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/paypal/config`
      );
      setPaypalClientId(response.data.clientId);
    } catch (err) {
      console.error('Failed to load PayPal config:', err);
    }
  };

  const handleAcceptContract = async () => {
    if (!signature.trim()) {
      alert('Please enter your signature');
      return;
    }

    try {
      setSigning(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/${contractId}/accept`,
        { signature },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Contract accepted successfully!');
      fetchContract();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept contract');
    } finally {
      setSigning(false);
    }
  };

  const handleCompleteMilestone = async (milestoneIndex) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/${contractId}/milestone/${milestoneIndex}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Milestone marked as completed!');
      fetchContract();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete milestone');
    }
  };

  const createPayPalOrder = async (milestoneIndex) => {
    try {
      const milestone = contract.milestones[milestoneIndex];
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/paypal/create-order`,
        {
          amount: milestone.amount,
          currency: 'USD',
          description: `${contract.projectId.title} - ${milestone.description}`,
          contractId: contract._id,
          milestoneIndex
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.orderId;
    } catch (err) {
      console.error('Failed to create PayPal order:', err);
      throw err;
    }
  };

  const capturePayPalOrder = async (orderId, milestoneIndex) => {
    try {
      const captureResponse = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/paypal/capture-order`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Record payment in contract
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/${contractId}/milestone/${milestoneIndex}/pay`,
        {
          paymentId: captureResponse.data.captureId,
          paypalOrderId: captureResponse.data.orderId,
          paypalPayerId: captureResponse.data.payerId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return captureResponse.data;
    } catch (err) {
      console.error('Failed to capture payment:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Please log in to view this contract</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user.id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Session expired. Please log in again.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isClient = contract.clientId._id === user.id;
  const isFreelancer = contract.freelancerId._id === user.id;
  const canSign = (isClient && !contract.clientAccepted) || (isFreelancer && !contract.freelancerAccepted);
  const fullyExecuted = contract.status === 'fully_signed' || contract.status === 'in_progress' || contract.status === 'completed';

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Contract Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Service Agreement</h1>
            <p className="text-gray-600 mt-1">Contract ID: {contract._id}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              contract.status === 'completed' ? 'bg-green-100 text-green-800' :
              contract.status === 'fully_signed' ? 'bg-blue-100 text-blue-800' :
              contract.status === 'partially_signed' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {contract.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Parties */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-sm font-semibold text-gray-600">CLIENT</h3>
            <p className="text-lg font-semibold">{contract.clientId.username}</p>
            <p className="text-sm text-gray-600">{contract.clientId.email}</p>
            {contract.clientAccepted && (
              <p className="text-sm text-green-600 mt-2">✓ Signed on {new Date(contract.clientAcceptedAt).toLocaleDateString()}</p>
            )}
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-sm font-semibold text-gray-600">FREELANCER</h3>
            <p className="text-lg font-semibold">{contract.freelancerId.username}</p>
            <p className="text-sm text-gray-600">{contract.freelancerId.email}</p>
            {contract.freelancerAccepted && (
              <p className="text-sm text-green-600 mt-2">✓ Signed on {new Date(contract.freelancerAcceptedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contract Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Project: {contract.projectId.title}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Scope</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{contract.projectScope}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Deliverables</h3>
            <ul className="list-disc list-inside space-y-1">
              {contract.deliverables.map((item, idx) => (
                <li key={idx} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment Terms</h3>
              <p className="text-gray-700">{contract.paymentTerms}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">${contract.paymentAmount}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Timeline</h3>
              <p className="text-gray-700">{contract.timeline}</p>
              <p className="text-sm text-gray-600 mt-2">Revisions: {contract.revisions}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-3">Full Contract Terms</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto border p-4 bg-white rounded">
              {contract.contractText}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      {canSign && !fullyExecuted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Sign Contract</h2>
          <p className="text-gray-700 mb-4">
            By signing this contract, you agree to all the terms and conditions outlined above.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Signature</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAcceptContract}
              disabled={signing || !signature.trim()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {signing ? 'Signing...' : 'Accept and Sign Contract'}
            </button>
          </div>
        </div>
      )}

      {/* Milestones */}
      {fullyExecuted && contract.milestones.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Project Milestones</h2>
          <div className="space-y-4">
            {contract.milestones.map((milestone, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{milestone.description}</h3>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      ${milestone.amount}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    milestone.status === 'paid' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    milestone.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  {/* Freelancer actions */}
                  {isFreelancer && milestone.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteMilestone(idx)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {/* Client payment actions */}
                  {isClient && milestone.status === 'completed' && paypalClientId && (
                    <div className="w-full">
                      <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'USD' }}>
                        <PayPalButtons
                          createOrder={async () => await createPayPalOrder(idx)}
                          onApprove={async (data) => {
                            try {
                              await capturePayPalOrder(data.orderID, idx);
                              alert('Payment successful!');
                              fetchContract();
                            } catch {
                              alert('Payment failed. Please try again.');
                            }
                          }}
                          onError={(err) => {
                            console.error('PayPal error:', err);
                            alert('Payment error. Please try again.');
                          }}
                          style={{ layout: 'horizontal', label: 'pay' }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}

                  {milestone.status === 'paid' && (
                    <p className="text-sm text-green-600">
                      ✓ Paid on {new Date(milestone.paidAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Paid:</span>
              <span className="text-2xl font-bold text-green-600">
                ${contract.totalPaid} / ${contract.paymentAmount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractView;
