import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend, FiZap, FiDollarSign, FiClock, FiFileText } from 'react-icons/fi';
import AIProposalGenerator from '../components/AIProposalGenerator';
import { buildApiUrl } from '../config/api';

const ProposalSubmission = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [workPlan, setWorkPlan] = useState('');

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(buildApiUrl(`/projects/${projectId}`));
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        // Pre-fill budget with project budget
        setProposedBudget(data.price || '');
      } else {
        setError('Failed to load project details');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleAIProposalGenerated = (generatedData) => {
    // Populate form with AI-generated data
    if (generatedData.coverLetter) {
      setCoverLetter(generatedData.coverLetter);
    }
    
    if (generatedData.pricing && generatedData.pricing.suggested) {
      // Extract just the number from pricing
      const budgetMatch = generatedData.pricing.suggested.match(/\$?(\d+(?:,\d+)?)/);
      if (budgetMatch) {
        setProposedBudget(budgetMatch[1].replace(',', ''));
      }
    }
    
    if (generatedData.timeline && generatedData.timeline.totalDuration) {
      setEstimatedDuration(generatedData.timeline.totalDuration);
    }
    
    if (generatedData.workPlan && generatedData.workPlan.length > 0) {
      let workPlanText = '';
      generatedData.workPlan.forEach((step, idx) => {
        workPlanText += `${idx + 1}. ${step}\n`;
      });
      
      // Add timeline phases if available
      if (generatedData.timeline && generatedData.timeline.phases) {
        workPlanText += '\n**Timeline Breakdown:**\n';
        generatedData.timeline.phases.forEach((phase) => {
          workPlanText += `\n${phase.phase} (${phase.duration}):\n`;
          if (phase.deliverables) {
            phase.deliverables.forEach((del) => {
              workPlanText += `  • ${del}\n`;
            });
          }
        });
      }
      
      // Add questions if available
      if (generatedData.questionsForClient && generatedData.questionsForClient.length > 0) {
        workPlanText += '\n**Questions for you:**\n';
        generatedData.questionsForClient.forEach((q, idx) => {
          workPlanText += `${idx + 1}. ${q}\n`;
        });
      }
      
      setWorkPlan(workPlanText);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setSubmitting(true);
    setError('');

    const freelancerId = localStorage.getItem('userId');
    
    // Combine all proposal parts into a message
    let fullMessage = coverLetter;
    
    if (workPlan) {
      fullMessage += '\n\n**Work Plan:**\n' + workPlan;
    }
    
    if (proposedBudget) {
      fullMessage += `\n\n**Proposed Budget:** $${proposedBudget}`;
    }
    
    if (estimatedDuration) {
      fullMessage += `\n**Estimated Duration:** ${estimatedDuration}`;
    }

    const proposalData = {
      freelancerId,
      projectId,
      message: fullMessage,
    };

    try {
      const response = await fetch(buildApiUrl('/api/proposals'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        alert('Proposal submitted successfully!');
        navigate('/freelance');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit proposal');
      }
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError('Failed to submit proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/freelance')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/freelance')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft />
            <span>Back to Projects</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Proposal</h1>
          <p className="text-gray-600">
            Create a compelling proposal to win this project
          </p>
        </div>

        {/* Project Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{project.title}</h2>
          <p className="text-gray-700 mb-4">{project.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiDollarSign className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-semibold text-gray-900">${project.price}</p>
              </div>
            </div>
            
            {project.deadline && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiClock className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiFileText className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold text-gray-900">{project.category}</p>
              </div>
            </div>
          </div>

          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Generator Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <FiZap className="text-purple-600 text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Proposal Assistant
              </h3>
              <p className="text-gray-700 mb-4">
                Let AI help you create a professional proposal in seconds. Generate a complete proposal
                or improve your existing draft with our AI assistant.
              </p>
              <AIProposalGenerator
                projectData={{
                  title: project.title,
                  description: project.description,
                  budget: project.price,
                  deadline: project.deadline
                }}
                existingProposal={coverLetter || workPlan}
                onProposalGenerated={handleAIProposalGenerated}
                mode="button"
              />
            </div>
          </div>
        </div>

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Proposal Details</h3>
          
          {/* Cover Letter */}
          <div className="mb-6">
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Introduce yourself and explain why you're the best fit for this project
            </p>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Dear Client,&#10;&#10;I am excited about this opportunity..."
              required
            />
          </div>

          {/* Work Plan */}
          <div className="mb-6">
            <label htmlFor="workPlan" className="block text-sm font-medium text-gray-700 mb-2">
              Work Plan & Approach
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Describe how you'll complete the project, including milestones and deliverables
            </p>
            <textarea
              id="workPlan"
              value={workPlan}
              onChange={(e) => setWorkPlan(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="1. Initial analysis and planning&#10;2. Design phase&#10;3. Development..."
            />
          </div>

          {/* Budget and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="proposedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Budget ($)
              </label>
              <input
                type="number"
                id="proposedBudget"
                value={proposedBudget}
                onChange={(e) => setProposedBudget(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="5000"
              />
            </div>
            
            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration
              </label>
              <input
                type="text"
                id="estimatedDuration"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="2-3 weeks"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSend />
                  <span>Submit Proposal</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/freelance')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalSubmission;
