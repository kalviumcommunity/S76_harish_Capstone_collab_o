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
  education: { type: [EducationSchema], default: [] },
  experience: { type: [ExperienceSchema], default: [] },
  portfolio: { type: [PortfolioSchema], default: [] },
  currentProjects: { type: Number, default: 0 },
  earnings: String,
});
module.exports = mongoose.model("Profile", ProfileSchema);