import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiUpload, FiFile, FiTrash2, FiCheckCircle, FiDownload } from 'react-icons/fi';
import axios from 'axios';

const DeliverableUpload = ({ proposal }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deliverables, setDeliverables] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState('not_submitted');

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
      
      if (response.data.deliverables && response.data.deliverables.length > 0) {
        setDeliverables(response.data.deliverables);
        setDeliveryStatus(response.data.deliveryStatus);
        setMessage(response.data.deliveryMessage || '');
      }
    } catch (error) {
      console.error("Error fetching deliverables:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('message', message);

      const response = await axios.post(
        `http://localhost:5000/api/proposals/${proposal._id}/deliverables`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setDeliverables(response.data.deliverables || []);
      setDeliveryStatus('submitted');
      toast.success("Deliverables uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Error uploading deliverables:", error);
      toast.error(error.response?.data?.error || "Failed to upload deliverables");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (deliveryStatus === 'submitted') {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
            <FiCheckCircle className="text-green-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Deliverables Submitted</h3>
          <p className="text-gray-500 my-2">
            Your files have been submitted successfully.
          </p>
        </div>

        {/* Show submitted files */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">Submitted Files</h4>
          <div className="space-y-2">
            {deliverables.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <FiFile className="text-blue-500" size={16} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 truncate" style={{ maxWidth: '180px' }}>
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {/* You could add download functionality here if needed */}
                <button className="text-blue-500 hover:text-blue-700">
                  <FiDownload size={16} />
                </button>
              </div>
            ))}
          </div>

          {message && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Message to Client:</h4>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Project Deliverables</h3>
      
      <div className="mb-4 p-4 bg-[#fff5f8] border border-[#FC427B] border-opacity-20 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2 bg-[#FC427B] bg-opacity-10 rounded-full">
            <FiFile className="text-[#FC427B]" size={20} />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-800">{proposal.projectTitle}</h4>
            <p className="text-xs text-gray-500 mt-1">
              Deliver your completed work files for this project. All files will be available to the client.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files
          </label>
          
          <div className="border-2 border-dashed rounded-lg p-6 border-gray-200">
            {files.length === 0 ? (
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  <label className="cursor-pointer font-medium text-[#FC427B] hover:text-[#e03a6d]">
                    Click to upload
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple
                      onChange={handleFileChange} 
                    />
                  </label>
                  {" "}or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ZIP, PDF, PNG, JPG, DOC up to 50MB each
                </p>
              </div>
            ) : (
              <div>
                <div className="space-y-2 mb-4">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-md">
                          <FiFile className="text-blue-500" size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700 truncate" style={{ maxWidth: '180px' }}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(index)} 
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <label className="cursor-pointer text-sm text-[#FC427B] hover:text-[#e03a6d] font-medium">
                    Add more files
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message to Client (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#FC427B] focus:border-transparent resize-none"
            placeholder="Add any important notes or instructions about your deliverables..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className={`px-5 py-2.5 bg-[#FC427B] hover:bg-[#e03a6d] text-white rounded-lg font-medium transition-colors ${
              (uploading || files.length === 0) ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Submit Deliverables'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliverableUpload;