const Project = require('../models/Project');

// Create a new project
const createProject = async (req, res) => {
    try {
        const { title, description, price, category, image, requiredSkills, deadline } = req.body;

        // Validate required fields
        if (!title || !description || !price || !category || !image || !requiredSkills || !deadline) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure the `createdBy` field is populated from the authenticated user
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: Missing user information.' });
        }

        const newProject = new Project({
            title,
            description,
            price,
            category,
            image,
            requiredSkills,
            deadline,
            createdBy: req.user.id, // Automatically set the authenticated user ID
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully!', project: newProject });
    } catch (err) {
        console.error('Error in creating project:', err); // Log the full error
        res.status(500).json({ error: 'Server error while creating project. Please try again later.' });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name email');
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching all projects:', err);
        res.status(500).json({ error: 'Server error while fetching projects. Please try again later.' });
    }
};

// Update a project by ID
const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
    } catch (err) {
        console.error('Error updating project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID format.' });
        }
        res.status(500).json({ error: 'Server error while updating project. Please try again later.' });
    }
};

// Get projects by user ID
const getProjectsByUser = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.params.userId });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects by user:', error);
        res.status(500).json({ message: 'Server error while fetching projects. Please try again later.' });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    updateProject,
    getProjectsByUser,
};