const Project = require('../model/ProjectSchema');


const createProject = async (req, res) => {
    try {
        
        if (!req.body.title || !req.body.description || !req.body.price || !req.body.category || !req.body.image || !req.body.requiredSkills || !req.body.deadline) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newProject = new Project(req.body);

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Server error while creating project. Please try again later.' });
    }
};

module.exports = {
    createProject
};