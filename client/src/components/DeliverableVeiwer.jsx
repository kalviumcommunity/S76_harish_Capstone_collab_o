import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiDownload, FiFile, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios from 'axios';

const DeliverableViewer = ({ proposal }) => {
  const [deliverables, setDeliverables] = useState([]);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('not_submitted');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (proposal._id) {
      fetchDeliverables();
    }
  }, [proposal._id]);

  const fetchDeliverables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/proposals/${proposal._id}/deliverables`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeliverables(response.data.deliverables || []);
      setDeliveryMessage(response.data.deliveryMessage || '');
      setDeliveryStatus(response.data.deliveryStatus || 'not_submitted');
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deliverables:", error);
      setLoading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/proposals/${proposal._id}/deliverables/${fileId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Get the file from the response
      const file = response.data;
      const deliverable = deliverables.find(d => d._id === fileId);
      const fileName = deliverable ? deliverable.filename : 'download';
      
      // Create a URL for the file and initiate download
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file. Please try again.");
    }
  };

  const handleApproveDeliverables = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/proposals/${proposal._id}/deliverables/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeliveryStatus('approved');
      toast.success("Deliverables approved successfully!");
    } catch (error) {
      console.error("Error approving deliverables:", error);
      toast.error("Failed to approve deliverables. Please try again.");
    }
  };

  const handleRejectDeliverables = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/proposals/${proposal._id}/deliverables/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeliveryStatus('rejected');
      toast.info("Deliverables have been rejected. Please provide feedback to the freelancer.");
    } catch (error) {
      console.error("Error rejecting deliverables:", error);
      toast.error("Failed to reject deliverables. Please try again.");
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-center items-center h-40">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 border-opacity-50 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!deliverables || deliverables.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiFile className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">No Deliverables Yet</h3>
          <p className="text-gray-500 mt-2">
            The freelancer hasn't submitted any deliverables for this project yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Project Deliverables</h3>
        {deliveryStatus === 'submitted' && (
          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
            Pending Review
          </span>
        )}
        {deliveryStatus === 'approved' && (
          <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
            Approved
          </span>
        )}
        {deliveryStatus === 'rejected' && (
          <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
            Rejected
          </span>
        )}
      </div>
      
      {/* Deliverables list */}
      <div className="space-y-3 mb-6">
        {deliverables.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-md">
                <FiFile className="text-blue-500" size={18} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {file.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleDownload(file._id)}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                title="Download file"
              >
                <FiDownload size={18} />
              </button>
              <button 
                className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                title="Preview file"
              >
                <FiEye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Freelancer's message */}
      {deliveryMessage && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Message from Freelancer:</h4>
          <p className="text-sm text-gray-600">{deliveryMessage}</p>
        </div>
      )}
      
      {/* Action buttons for submitted deliverables */}
      {deliveryStatus === 'submitted' && (
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <button
            onClick={handleApproveDeliverables}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <FiCheckCircle className="mr-2" />
            Approve Deliverables
          </button>
          <button
            onClick={handleRejectDeliverables}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <FiXCircle className="mr-2" />
            Request Changes
          </button>
        </div>
      )}
      
      {/* Status messages for approved/rejected */}
      {deliveryStatus === 'approved' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg text-center">
          <p className="text-green-600 flex items-center justify-center gap-2 font-medium">
            <FiCheckCircle size={20} />
            <span>You've approved these deliverables</span>
          </p>
        </div>
      )}
      
      {deliveryStatus === 'rejected' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-center">
          <p className="text-red-600 flex items-center justify-center gap-2 font-medium">
            <FiXCircle size={20} />
            <span>You've requested changes to these deliverables</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliverableViewer;