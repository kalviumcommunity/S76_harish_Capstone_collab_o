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
        console.error('Error in creating project:', err);
        res.status(500).json({ error: 'Server error while creating project. Please try again later.' });
    }
};





const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found' });
        }
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching all projects:', err);
        res.status(500).json({ error: 'Server error while fetching projects. Please try again later.' });
    }
};


const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (err) {
        console.error('Error updating project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }
        res.status(500).json({ error: 'Server error while updating project. Please try again later.' });
    }
};

module.exports = {
    createProject,getAllProjects,updateProject
};