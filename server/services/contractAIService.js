/**
 * AI Contract Generation Service
 * Uses Gemini AI to generate professional contracts
 */

const { generateCourse } = require('./geminiService');

/**
 * Generate a professional contract using AI
 * @param {Object} contractData - Contract details
 * @returns {Promise<Object>} Generated contract content
 */
async function generateContract(contractData) {
  const {
    projectTitle,
    projectDescription,
    clientName,
    freelancerName,
    paymentAmount,
    timeline,
    deliverables,
    requiredSkills
  } = contractData;

  const prompt = `
Generate a professional freelance service contract with the following details:

PROJECT INFORMATION:
- Project Title: ${projectTitle}
- Description: ${projectDescription}
- Required Skills: ${requiredSkills.join(', ')}

PARTIES:
- Client: ${clientName}
- Freelancer: ${freelancerName}

TERMS:
- Total Payment: $${paymentAmount}
- Timeline: ${timeline}
- Deliverables: ${deliverables.join(', ')}

Create a comprehensive contract that includes:
1. Project Scope - Clear description of work to be done
2. Deliverables - Specific items to be delivered
3. Payment Terms - How and when payment will be made
4. Timeline - Project duration and milestones
5. Revisions - Number of revisions included
6. Intellectual Property Rights - Ownership of work
7. Confidentiality - Protection of sensitive information
8. Termination Clause - How either party can end the contract
9. Dispute Resolution - How disagreements will be handled
10. Warranties and Liability - Quality guarantees and limitations

Format the response as a JSON object with these keys:
{
  "contractText": "Full formatted contract text",
  "projectScope": "Brief project scope",
  "deliverables": ["deliverable 1", "deliverable 2"],
  "paymentTerms": "Payment terms description",
  "timeline": "Timeline description",
  "revisions": "Revision policy",
  "confidentialityClause": "Confidentiality clause text",
  "intellectualPropertyClause": "IP rights clause text",
  "disputeResolutionClause": "Dispute resolution clause text"
}

Make it professional, legally sound, and fair to both parties.
`;

  try {
    // Use the existing Gemini service (reusing generateCourse since it returns JSON)
    const contractContent = await generateCourse(prompt);
    
    // Validate the response has required fields
    if (!contractContent.contractText || !contractContent.projectScope) {
      throw new Error('AI generated incomplete contract content');
    }
    
    return contractContent;
  } catch (error) {
    console.error('Contract generation failed:', error);
    
    // Fallback to template if AI fails
    return generateFallbackContract(contractData);
  }
}

/**
 * Fallback contract template if AI generation fails
 */
function generateFallbackContract(contractData) {
  const {
    projectTitle,
    projectDescription,
    clientName,
    freelancerName,
    paymentAmount,
    timeline,
    deliverables
  } = contractData;

  const contractText = `
FREELANCE SERVICE AGREEMENT

This Agreement is entered into as of ${new Date().toLocaleDateString()} between:

CLIENT: ${clientName} ("Client")
FREELANCER: ${freelancerName} ("Freelancer")

1. PROJECT SCOPE
${projectDescription}

2. DELIVERABLES
${deliverables.map((d, i) => `${i + 1}. ${d}`).join('\n')}

3. PAYMENT TERMS
Total Project Fee: $${paymentAmount}
Payment Schedule: Upon completion and approval of deliverables
Payment Method: PayPal or Razorpay

4. TIMELINE
Project Duration: ${timeline}
The Freelancer agrees to complete the work within the specified timeline, subject to timely feedback from the Client.

5. REVISIONS
Two (2) rounds of revisions are included in the project fee. Additional revisions may be subject to additional charges.

6. INTELLECTUAL PROPERTY
Upon full payment, all intellectual property rights to the deliverables will be transferred to the Client.

7. CONFIDENTIALITY
Both parties agree to keep confidential any proprietary information shared during the project.

8. TERMINATION
Either party may terminate this agreement with written notice. In case of termination, payment will be prorated based on work completed.

9. DISPUTE RESOLUTION
Any disputes will be resolved through good-faith negotiation. If resolution cannot be reached, parties agree to mediation before legal action.

10. WARRANTIES
The Freelancer warrants that all work will be original and will not infringe on third-party rights.

ACCEPTANCE
By signing below, both parties agree to the terms and conditions outlined in this Agreement.
`;

  return {
    contractText,
    projectScope: projectDescription,
    deliverables: deliverables,
    paymentTerms: `Total payment of $${paymentAmount} upon completion`,
    timeline: timeline,
    revisions: '2 revisions included',
    confidentialityClause: 'Both parties agree to keep confidential any proprietary information shared during the project.',
    intellectualPropertyClause: 'Upon full payment, all intellectual property rights to the deliverables will be transferred to the Client.',
    disputeResolutionClause: 'Any disputes will be resolved through good-faith negotiation. If resolution cannot be reached, parties agree to mediation.'
  };
}

module.exports = {
  generateContract
};
