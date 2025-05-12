const Proposal = require('../model/Proposal');

// Create a new proposal
exports.createProposal = async (req, res) => {
  try {
    const proposal = await Proposal.create(req.body);
    res.status(201).json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all proposals for a specific project
exports.getProposalsForProject = async (req, res) => {
  try {
    const proposals = await Proposal.find({ projectId: req.params.projectId })
      .populate('freelancerId', 'name email') 
      .populate('projectId', 'title');        
    res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept a specific proposal
exports.acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );

    res.status(200).json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
