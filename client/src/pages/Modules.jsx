import React, { useState } from "react";
import axios from "axios";
import { BookOpenIcon, AcademicCapIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const difficulties = ["Beginner", "Intermediate", "Advanced"];

export default function QuizApp() {
  const [step, setStep] = useState("setup"); // setup | quiz | result
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch quiz from backend
  const startQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStep("setup");
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    try {
      const res = await axios.post("https://s76-harish-capstone-collab-o.onrender.com/api/ai-quiz/generate", {
        topic,
        numQuestions,
        difficulty,
      });
      if (res.data && Array.isArray(res.data.quiz)) {
        setQuestions(res.data.quiz);
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
    else setStep("result");
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleRestart = () => {
    setStep("setup");
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setError("");
  };

  const score = Object.entries(answers).filter(
    ([idx, ans]) => questions[idx]?.answer === ans
  ).length;

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <AcademicCapIcon className="h-12 w-12 text-[#FC427B] mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AI Quiz Platform</h1>
          </div>
          <p className="text-lg text-gray-600">Test your knowledge with AI-generated quizzes</p>
        </div>

        {/* Setup Step */}
        {step === "setup" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <BookOpenIcon className="h-8 w-8 text-[#FC427B] mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Create Your Quiz</h2>
            </div>
            
            <form onSubmit={startQuiz} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Topic
                </label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., JavaScript, Python, React..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC427B] focus:border-[#FC427B] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  id="numQuestions"
                  type="number"
                  min={1}
                  max={30}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC427B] focus:border-[#FC427B] transition-colors"
                />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FC427B]hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Quiz...
                  </>
                ) : (
                  "Start Quiz"
                )}
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

        {/* Quiz Step */}
        {step === "quiz" && questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">
                  {current + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#FC427B]h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Question {current + 1}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
              </div>
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                {questions[current].question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {questions[current].options.map((opt, i) => (
                  <label 
                    key={i} 
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      answers[current] === opt 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${current}`}
                      value={opt}
                      checked={answers[current] === opt}
                      onChange={() => handleAnswer(opt)}
                      className="h-4 w-4 text-[#FC427B]border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-900">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[current]}
                className="px-6 py-2 bg-[#FC427B]hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {current === questions.length - 1 ? "Finish Quiz" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === "result" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            {/* Score Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                  {score}/{questions.length}
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-lg text-gray-600">
                You scored {Math.round((score / questions.length) * 100)}%
              </p>
            </div>

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
                className="px-8 py-3 bg-[#FC427B]hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}