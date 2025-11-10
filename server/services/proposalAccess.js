const Proposal = require('../model/Proposal');

/**
 * Validates whether a user is either the client (project owner) or the freelancer
 * participating in a proposal conversation.
 *
 * @param {string} proposalId
 * @param {string} userId
 * @returns {Promise<{allowed: boolean, role?: 'client'|'freelancer', proposal?: any, status?: number, error?: string}>}
 */
const verifyProposalParticipant = async (proposalId, userId) => {
  if (!proposalId || !userId) {
    return { allowed: false, status: 400, error: 'Invalid proposal or user reference.' };
  }

  const proposal = await Proposal.findById(proposalId).populate('projectId', 'createdBy');
  if (!proposal) {
    return { allowed: false, status: 404, error: 'Proposal not found.' };
  }

  const userIdStr = userId.toString();
  const freelancerId = proposal.freelancerId ? proposal.freelancerId.toString() : null;
  const clientId = proposal.projectId && proposal.projectId.createdBy
    ? proposal.projectId.createdBy.toString()
    : null;

  if (freelancerId === userIdStr) {
    return { allowed: true, role: 'freelancer', proposal };
  }

  if (clientId === userIdStr) {
    return { allowed: true, role: 'client', proposal };
  }

  return { allowed: false, status: 403, error: 'You are not authorized to access this conversation.' };
};

module.exports = {
  verifyProposalParticipant,
};
