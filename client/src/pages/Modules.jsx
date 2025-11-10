import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { BookOpenIcon, AcademicCapIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, StarIcon, ShieldCheckIcon, CameraIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const popularSkills = [
  "JavaScript", "React", "Node.js", "Python", "Java", "C++", "HTML/CSS", 
  "TypeScript", "Angular", "Vue.js", "PHP", "Ruby", "Swift", "Kotlin",
  "UI/UX Design", "Graphic Design", "Digital Marketing", "Content Writing"
];

export default function SkillAssessment() {
  const [step, setStep] = useState("setup"); // setup | instructions | checks | quiz | result
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [assessmentSaved, setAssessmentSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [checksCompleted, setChecksCompleted] = useState({
    camera: false,
    microphone: false,
    fullscreen: false
  });
  
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const resetAssessment = useCallback((message = '') => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setStep("setup");
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setError(message);
    setAssessmentSaved(false);
    setTimeRemaining(0);
    setChecksCompleted({
      camera: false,
      microphone: false,
      fullscreen: false
    });
    setIsFullscreen(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (step === "quiz" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStep("result");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeRemaining]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If user exits fullscreen during quiz, show warning
      if (!isCurrentlyFullscreen && step === "quiz") {
        alert("You exited fullscreen. The assessment has been terminated.");
        resetAssessment("Assessment terminated for leaving fullscreen.");
        return;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [step, resetAssessment]);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AcademicCapIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to take skill assessments and save your progress.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#FC427B] hover:bg-[#e03a6d] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch quiz from backend
  const startQuiz = async (e) => {
    e.preventDefault();
    setStep("instructions");
  };

  const proceedToChecks = () => {
    setStep("checks");
  };

  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setChecksCompleted(prev => ({ ...prev, camera: true }));
    } catch (err) {
      alert("Camera access denied. Exiting the assessment.");
      resetAssessment("Assessment terminated due to missing camera access.");
    }
  };

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setChecksCompleted(prev => ({ ...prev, microphone: true }));
    } catch (err) {
      alert("Microphone access denied. Exiting the assessment.");
      resetAssessment("Assessment terminated due to missing microphone access.");
    }
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setChecksCompleted(prev => ({ ...prev, fullscreen: true }));
    } catch (err) {
      alert("Failed to enter fullscreen mode. Exiting the assessment.");
      resetAssessment("Assessment terminated because fullscreen mode could not be enabled.");
    }
  };

  const startActualQuiz = async () => {
    if (!Object.values(checksCompleted).every(check => check)) {
      alert("Please complete all checks before starting the assessment.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setAssessmentSaved(false);
    
    try {
      const res = await axios.post("http://localhost:5000/api/ai-quiz/generate", {
        topic,
        numQuestions,
        difficulty,
      });
      if (res.data && Array.isArray(res.data.quiz)) {
        setQuestions(res.data.quiz);
        // Set timer: 2 minutes per question
        setTimeRemaining(numQuestions * 120);
        setStep("quiz");
      } else {
        setError("Quiz format error from server.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not fetch quiz. Please try again."
      );
    }
    setLoading(false);
  };

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [current]: option });
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
    else finishAssessment();
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const finishAssessment = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setStep("result");
  };

  const handleRestart = () => {
    resetAssessment("");
  };

  const saveAssessment = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:5000/api/ai-quiz/save-assessment",
        {
          skill: topic,
          score: score,
          totalQuestions: questions.length,
          difficulty: difficulty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Assessment saved:', response.data);
      setAssessmentSaved(true);
    } catch (error) {
      console.error('Error saving assessment:', error);
      setError("Failed to save assessment to profile.");
    }
    setSaving(false);
  };

  const score = Object.entries(answers).filter(
    ([idx, ans]) => questions[idx]?.answer === ans
  ).length;

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const getSkillLevel = () => {
    if (percentage >= 90) return { level: 'Expert', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (percentage >= 75) return { level: 'Advanced', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 60) return { level: 'Intermediate', color: 'text-green-600', bgColor: 'bg-green-100' };
    return { level: 'Beginner', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={`min-h-screen ${step === 'quiz' ? 'bg-gray-900' : 'bg-gray-50'} ${step === 'quiz' ? 'p-0' : 'py-8 px-4 sm:px-6 lg:px-8'}`}>
      <div className={step === 'quiz' ? '' : 'max-w-4xl mx-auto'}>
        {/* Header - Only show when not in quiz */}
        {step !== 'quiz' && (
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <TrophyIcon className="h-12 w-12 text-[#FC427B] mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Skill Assessment</h1>
            </div>
            <p className="text-lg text-gray-600">Test your skills and showcase your expertise on your profile</p>
          </div>
        )}

        {/* Setup Step */}
        {step === "setup" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <BookOpenIcon className="h-8 w-8 text-[#FC427B] mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Choose Your Skill</h2>
            </div>
            
            {/* Popular Skills */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Popular Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setTopic(skill)}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      topic === skill
                        ? 'border-[#FC427B] bg-[#FC427B]/10 text-[#FC427B]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={startQuiz} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Custom Skill
                </label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., Machine Learning, Blockchain, etc."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC427B] focus:border-[#FC427B] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <select
                    id="numQuestions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC427B] focus:border-[#FC427B] transition-colors"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC427B] focus:border-[#FC427B] transition-colors"
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FC427B] hover:bg-[#e03a6d] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Continue to Instructions
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Instructions Step */}
        {step === "instructions" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-[#FC427B] mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Assessment Instructions</h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Assessment Details</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Skill:</strong> {topic}</li>
                  <li>• <strong>Questions:</strong> {numQuestions}</li>
                  <li>• <strong>Difficulty:</strong> {difficulty}</li>
                  <li>• <strong>Time Limit:</strong> {numQuestions * 2} minutes (2 minutes per question)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Important Rules</h3>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>✓ This is a proctored assessment - your camera and microphone will be monitored</li>
                  <li>✓ The assessment must be taken in fullscreen mode</li>
                  <li>✓ Once started, you cannot pause or restart the assessment</li>
                  <li>✓ Exiting fullscreen mode will be recorded as a violation</li>
                  <li>✓ You can navigate between questions before submitting</li>
                  <li>✓ Submit your answers before time runs out</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold text-green-900 mb-2">Scoring</h3>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• Each correct answer: 1 point</li>
                  <li>• No negative marking for incorrect answers</li>
                  <li>• Your final score and skill level will be displayed at the end</li>
                  <li>• You can save your results to your profile to showcase to clients</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep("setup")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={proceedToChecks}
                className="flex-1 px-6 py-3 bg-[#FC427B] hover:bg-[#e03a6d] text-white font-semibold rounded-lg transition-colors"
              >
                I Understand, Proceed
              </button>
            </div>
          </div>
        )}

        {/* System Checks Step */}
        {step === "checks" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-[#FC427B] mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">System Checks</h2>
            </div>

            <p className="text-gray-600 mb-8">
              Please complete the following checks before starting your assessment:
            </p>

            <div className="space-y-4 mb-8">
              {/* Camera Check */}
              <div className="flex items-center justify-between p-4 border-2 rounded-lg border-gray-200">
                <div className="flex items-center">
                  <CameraIcon className="h-6 w-6 text-gray-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Camera Access</h3>
                    <p className="text-sm text-gray-600">Required for proctoring</p>
                  </div>
                </div>
                {checksCompleted.camera ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    onClick={checkCamera}
                    className="px-4 py-2 bg-[#FC427B] hover:bg-[#e03a6d] text-white text-sm rounded-lg transition-colors"
                  >
                    Enable Camera
                  </button>
                )}
              </div>

              {/* Microphone Check */}
              <div className="flex items-center justify-between p-4 border-2 rounded-lg border-gray-200">
                <div className="flex items-center">
                  <MicrophoneIcon className="h-6 w-6 text-gray-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Microphone Access</h3>
                    <p className="text-sm text-gray-600">Required for proctoring</p>
                  </div>
                </div>
                {checksCompleted.microphone ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    onClick={checkMicrophone}
                    className="px-4 py-2 bg-[#FC427B] hover:bg-[#e03a6d] text-white text-sm rounded-lg transition-colors"
                  >
                    Enable Microphone
                  </button>
                )}
              </div>

              {/* Fullscreen Check */}
              <div className="flex items-center justify-between p-4 border-2 rounded-lg border-gray-200">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fullscreen Mode</h3>
                    <p className="text-sm text-gray-600">Required during assessment</p>
                  </div>
                </div>
                {checksCompleted.fullscreen ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    onClick={enterFullscreen}
                    className="px-4 py-2 bg-[#FC427B] hover:bg-[#e03a6d] text-white text-sm rounded-lg transition-colors"
                  >
                    Enter Fullscreen
                  </button>
                )}
              </div>
            </div>

            {Object.values(checksCompleted).every(check => check) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-green-800 font-semibold">All checks completed! You're ready to start.</span>
                </div>
              </div>
            )}

            <button
              onClick={startActualQuiz}
              disabled={!Object.values(checksCompleted).every(check => check) || loading}
              className="w-full bg-[#FC427B] hover:bg-[#e03a6d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting Assessment...
                </>
              ) : (
                "Start Assessment"
              )}
            </button>
          </div>
        )}

        {/* Quiz Step - Fullscreen Mode */}
        {step === "quiz" && questions.length > 0 && (
          <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Fixed Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <h2 className="text-xl font-bold">{topic} Assessment</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Question {current + 1} / {questions.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#FC427B] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-gray-800 rounded-2xl p-8 mb-6">
                  <div className="flex items-start mb-6">
                    <span className="flex-shrink-0 w-10 h-10 bg-[#FC427B] rounded-full flex items-center justify-center text-lg font-bold mr-4">
                      {current + 1}
                    </span>
                    <p className="text-2xl font-medium leading-relaxed">
                      {questions[current].question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 ml-14">
                    {questions[current].options.map((opt, i) => (
                      <label 
                        key={i} 
                        className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          answers[current] === opt 
                            ? 'border-[#FC427B] bg-[#FC427B]/20' 
                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${current}`}
                          value={opt}
                          checked={answers[current] === opt}
                          onChange={() => handleAnswer(opt)}
                          className="h-5 w-5 text-[#FC427B] border-gray-500 focus:ring-[#FC427B] bg-gray-700"
                        />
                        <span className="ml-4 text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Answer Status */}
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Questions Answered:</span>
                    <span className="font-semibold text-white">
                      {Object.keys(answers).length} / {questions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer Navigation */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={current === 0}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        idx === current 
                          ? 'bg-[#FC427B] text-white' 
                          : answers[idx] 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!answers[current]}
                  className="px-6 py-3 bg-[#FC427B] hover:bg-[#e03a6d] disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors font-medium"
                >
                  {current === questions.length - 1 ? "Submit Assessment" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === "result" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            {/* Score Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className={`text-6xl font-bold ${getSkillLevel().color}`}>
                  {score}/{questions.length}
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Assessment Complete!</h2>
              <p className="text-lg text-gray-600 mb-4">
                You scored {percentage}% on {topic}
              </p>
              
              {/* Skill Level Badge */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${getSkillLevel().bgColor} ${getSkillLevel().color} font-semibold`}>
                <StarIcon className="h-5 w-5 mr-2" />
                {getSkillLevel().level} Level
              </div>
            </div>

            {/* Save to Profile */}
            {!assessmentSaved && (
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">Save this assessment to your profile to showcase your skills to clients!</p>
                <button
                  onClick={saveAssessment}
                  disabled={saving}
                  className="bg-[#FC427B] hover:bg-[#e03a6d] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center mx-auto"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <TrophyIcon className="h-5 w-5 mr-2" />
                      Save to Profile
                    </>
                  )}
                </button>
              </div>
            )}

            {assessmentSaved && (
              <div className="text-center mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                    <span className="text-green-800 font-semibold">Assessment saved to your profile!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results */}
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Detailed Results
              </h3>
              {questions.map((q, idx) => (
                <div key={idx} className="border rounded-lg p-6">
                  <div className="flex items-start mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center">
                          {answers[idx] === q.answer ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className={`font-medium ${
                            answers[idx] === q.answer ? 'text-green-700' : 'text-red-700'
                          }`}>
                            Your answer: {answers[idx] || "No answer"}
                          </span>
                        </div>
                        {answers[idx] !== q.answer && (
                          <div className="flex items-center ml-7">
                            <span className="text-green-700 font-medium">
                              Correct answer: {q.answer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-[#FC427B] hover:bg-[#e03a6d] text-white font-semibold rounded-lg transition-colors"
              >
                Take Another Assessment
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-8 py-3 border border-[#FC427B] text-[#FC427B] hover:bg-[#FC427B] hover:text-white font-semibold rounded-lg transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
