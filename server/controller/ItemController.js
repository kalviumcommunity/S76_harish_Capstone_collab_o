const Project = require('../model/ProjectSchema');
const mongoose = require('mongoose');

// Create a new project
const createProject = async (req, res) => {
    try {
        const { title, description, price, category, image, requiredSkills, deadline } = req.body;

        if (!title || !description || !price || !category || !image || !requiredSkills || !deadline) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

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
            createdBy: req.user.id,
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully!', project: newProject });
    } catch (err) {
        console.error('Error in creating project:', err);
        res.status(500).json({ error: 'Server error while creating project. Please try again later.' });
    }
};


const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the project by ID
        const project = await Project.findById(id).populate('createdBy', 'name email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Return the project details
        res.status(200).json(project);
    } catch (err) {
        console.error('Error fetching project by ID:', err);
        res.status(500).json({ error: 'Server error while fetching the project. Please try again later.' });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching all projects:', err);
        res.status(500).json({ error: 'Server error while fetching projects. Please try again later.' });
    }
};

// Update a project by ID (with authorization check)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // if (project.createdBy.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Forbidden: You cannot modify this project.' });
        // }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
    } catch (err) {
        console.error('Error updating project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID format.' });
        }
        res.status(500).json({ error: 'Server error while updating project. Please try again later.' });
    }
};

// Delete a project by ID (with proper authorization check)
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
       console.log(id)
        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid project ID format.' });
        }

        // Find the project
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Authorization check: Ensure the authenticated user is the owner
        // if (project.createdBy.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Forbidden: You cannot delete this project.' });
        // }

        // Proceed with deletion
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project deleted successfully.', project });
    } catch (err) {
        console.error('Error deleting project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID format.' });
        }
        res.status(500).json({ error: 'Server error while deleting project. Please try again later.' });
    }
};


const getProjectsByUser = async (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId);

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({
      message: "Invalid or missing user ID",
      success: false,
    });
  }

  try {
    const projects = await Project.find({ createdBy: userId }).sort({ createdAt: -1 }).populate("createdBy", "name email");

    return res.status(200).send({
      message: "Projects fetched successfully",
      data: projects,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


  
module.exports = {
    createProject,
    getAllProjects,
    updateProject,
    getProjectsByUser,
    deleteProject,
    getProjectById
};
