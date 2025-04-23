const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        
    
    },
    requiredSkills: {
        type: [String],
        required: true
    },
    deadline: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Deadline must be a future date.'
        }
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
    
