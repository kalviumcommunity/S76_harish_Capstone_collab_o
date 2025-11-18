import React, { useState } from 'react';
import { FiZap, FiLoader, FiCheckCircle, FiAlertCircle, FiEdit3 } from 'react-icons/fi';
import { buildApiUrl } from '../config/api';

const AIProposalGenerator = ({ 
  projectData, 
  existingProposal = null,
  onProposalGenerated,
  mode = 'button' // 'button' or 'inline'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to use AI proposal generation');
        setIsGenerating(false);
        return;
      }

      const freelancerName = localStorage.getItem('username') || 'Freelancer';
      const freelancerSkills = localStorage.getItem('skills') || 'Professional skills';

      const requestBody = {
        projectTitle: projectData.title,
        projectDescription: projectData.description,
        projectBudget: projectData.budget || projectData.price,
        projectDeadline: projectData.deadline,
        freelancerName,
        freelancerSkills,
        freelancerExperience: 'Experienced professional',
        existingProposal: existingProposal || undefined
      };

      const response = await fetch(buildApiUrl('/api/ai-proposal/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate proposal');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setGeneratedData(result.data);
        if (onProposalGenerated) {
          onProposalGenerated(result.data);
        }
      } else {
        throw new Error('Invalid response from AI');
      }

    } catch (err) {
      console.error('AI Proposal Generation Error:', err);
      setError(err.message || 'Failed to generate proposal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseProposal = () => {
    if (generatedData && onProposalGenerated) {
      onProposalGenerated(generatedData);
      setShowModal(false);
      setGeneratedData(null);
    }
  };

  if (mode === 'inline') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <FiLoader className="animate-spin text-xl" />
              <span>{existingProposal ? 'Improving Proposal...' : 'Generating Proposal...'}</span>
            </>
          ) : (
            <>
              <FiZap className="text-xl" />
              <span>{existingProposal ? 'Improve with AI' : 'Generate with AI'}</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
      >
        {existingProposal ? (
          <>
            <FiEdit3 className="text-lg" />
            <span className="font-medium">Improve with AI</span>
          </>
        ) : (
          <>
            <FiZap className="text-lg" />
            <span className="font-medium">Generate with AI</span>
          </>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiZap className="text-3xl" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {existingProposal ? 'AI Proposal Improvement' : 'AI Proposal Generator'}
                    </h2>
                    <p className="text-purple-100 text-sm mt-1">
                      {existingProposal 
                        ? 'Let AI enhance your proposal to win more projects'
                        : 'Create a winning proposal in seconds'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setGeneratedData(null);
                    setError('');
                  }}
                  className="text-white hover:text-gray-200 text-2xl"
                  disabled={isGenerating}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {!generatedData && !isGenerating && (
                <>
                  {/* Project Info */}
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium text-gray-700">Title:</span> {projectData.title}</p>
                      <p><span className="font-medium text-gray-700">Budget:</span> ${projectData.budget || projectData.price}</p>
                      {projectData.deadline && (
                        <p><span className="font-medium text-gray-700">Deadline:</span> {projectData.deadline}</p>
                      )}
                    </div>
                  </div>

                  {/* What AI Will Generate */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <FiCheckCircle className="text-blue-600" />
                      What the AI will generate:
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6">
                      <li>• Personalized cover letter</li>
                      <li>• Detailed work plan</li>
                      <li>• Project timeline with phases</li>
                      <li>• Pricing suggestions & breakdown</li>
                      <li>• Relevant experience highlights</li>
                      <li>• Strategic questions for client</li>
                      {existingProposal && <li>• Specific improvement suggestions</li>}
                    </ul>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiZap className="text-2xl" />
                    <span>{existingProposal ? 'Improve My Proposal' : 'Generate Proposal Now'}</span>
                  </button>
                </>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="py-12 text-center">
                  <FiLoader className="animate-spin text-6xl text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {existingProposal ? 'Improving Your Proposal...' : 'Generating Your Proposal...'}
                  </h3>
                  <p className="text-gray-600">
                    AI is analyzing the project and crafting a winning proposal
                  </p>
                  <p className="text-sm text-gray-500 mt-2">This may take 15-30 seconds</p>
                </div>
              )}

              {/* Generated Proposal */}
              {generatedData && !isGenerating && (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <FiCheckCircle className="text-green-600 text-2xl flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-900">Proposal Generated Successfully!</h3>
                      <p className="text-sm text-green-700">Review the details below and use them in your proposal.</p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">📝 Cover Letter</h3>
                    <p className="text-gray-700 whitespace-pre-line">{generatedData.coverLetter}</p>
                  </div>

                  {/* Work Plan */}
                  {generatedData.workPlan && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">📋 Work Plan</h3>
                      <ol className="space-y-2">
                        {generatedData.workPlan.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Timeline */}
                  {generatedData.timeline && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">⏱️ Timeline</h3>
                      <p className="text-sm text-gray-600 mb-3">Total Duration: <span className="font-semibold">{generatedData.timeline.totalDuration}</span></p>
                      {generatedData.timeline.phases && (
                        <div className="space-y-3">
                          {generatedData.timeline.phases.map((phase, idx) => (
                            <div key={idx} className="border-l-4 border-blue-400 pl-4">
                              <h4 className="font-semibold text-gray-800">{phase.phase}</h4>
                              <p className="text-sm text-gray-600">Duration: {phase.duration}</p>
                              {phase.deliverables && (
                                <ul className="text-sm text-gray-700 mt-1 ml-4">
                                  {phase.deliverables.map((del, i) => (
                                    <li key={i}>• {del}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  {generatedData.pricing && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">💰 Pricing</h3>
                      <p className="text-lg font-semibold text-purple-600 mb-2">{generatedData.pricing.suggested}</p>
                      {generatedData.pricing.breakdown && (
                        <div className="space-y-2 mt-3">
                          {generatedData.pricing.breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.item}</span>
                              <span className="font-semibold">{item.cost}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {generatedData.pricing.notes && (
                        <p className="text-sm text-gray-600 mt-3 italic">{generatedData.pricing.notes}</p>
                      )}
                    </div>
                  )}

                  {/* Questions for Client */}
                  {generatedData.questionsForClient && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">❓ Questions to Ask Client</h3>
                      <ul className="space-y-2">
                        {generatedData.questionsForClient.map((q, idx) => (
                          <li key={idx} className="text-gray-700">• {q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 sticky bottom-0 bg-white pt-4 pb-2">
                    <button
                      onClick={handleUseProposal}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      Use This Proposal
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIProposalGenerator;
