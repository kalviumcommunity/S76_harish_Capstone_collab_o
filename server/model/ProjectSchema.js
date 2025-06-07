const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    requiredSkills: { type: [String], required: true },
    deadline: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    proposals: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);