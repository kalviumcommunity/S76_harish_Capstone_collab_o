const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});
const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  period: String,
  description: String,
});
const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
});

const SkillAssessmentSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  difficulty: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true }
});

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: String,
  username: String,
  title: String,
  location: String,
  hourlyRate: String,
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  lastActive: Date,
  profileImage: String,
  bio: String,
  skills: { type: [String], default: [] },
  skillAssessments: { type: [SkillAssessmentSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  experience: { type: [ExperienceSchema], default: [] },
  portfolio: { type: [PortfolioSchema], default: [] },
  currentProjects: { type: Number, default: 0 },
  earnings: String,
});
module.exports = mongoose.model("Profile", ProfileSchema);