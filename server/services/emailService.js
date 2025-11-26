const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

/**
 * Send email notification
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Collab-O Platform" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Email Templates
 */

// Proposal Accepted
const sendProposalAcceptedEmail = async (freelancerEmail, freelancerName, projectTitle, clientName) => {
  const subject = '🎉 Your Proposal Was Accepted!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FC427B 0%, #ff6b9d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #FC427B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations!</h1>
        </div>
        <div class="content">
          <p>Hi ${freelancerName},</p>
          <p>Great news! Your proposal has been <strong>accepted</strong> by ${clientName}.</p>
          <p><strong>Project:</strong> ${projectTitle}</p>
          <p>A contract will be generated shortly. Both you and the client need to sign it before you can start working.</p>
          <a href="${process.env.CLIENT_URL}/freelancer-dashboard" class="button">View Proposal</a>
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Wait for contract generation</li>
            <li>Review and sign the contract</li>
            <li>Start working on milestones</li>
            <li>Upload deliverables</li>
            <li>Get paid via PayPal</li>
          </ol>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(freelancerEmail, subject, html);
};

// Contract Generated
const sendContractGeneratedEmail = async (recipientEmail, recipientName, role, projectTitle) => {
  const subject = '📄 Contract Ready for Signature';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 Contract Ready</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>A contract has been generated for the project: <strong>${projectTitle}</strong></p>
          <p>Please review and sign the contract to proceed with the project.</p>
          <a href="${process.env.CLIENT_URL}/${role === 'client' ? 'client-dashboard' : 'freelancer-dashboard'}" class="button">View & Sign Contract</a>
          <p><strong>Important:</strong> Both parties must sign before work can begin.</p>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(recipientEmail, subject, html);
};

// Contract Signed
const sendContractSignedEmail = async (recipientEmail, recipientName, signerName, projectTitle, fullyExecuted) => {
  const subject = fullyExecuted ? '✅ Contract Fully Executed - Project Started!' : '✍️ Contract Partially Signed';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .success { background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${fullyExecuted ? '✅ Contract Active!' : '✍️ Signature Received'}</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>${signerName} has signed the contract for: <strong>${projectTitle}</strong></p>
          ${fullyExecuted ? `
            <div class="success">
              <strong>🎉 Contract is now fully executed!</strong><br>
              The first milestone has been activated. Work can begin now!
            </div>
          ` : `
            <p>Waiting for the other party to sign. Once both signatures are received, the project will begin.</p>
          `}
          <a href="${process.env.CLIENT_URL}/contract" class="button">View Contract</a>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(recipientEmail, subject, html);
};

// Deliverables Uploaded
const sendDeliverablesUploadedEmail = async (clientEmail, clientName, freelancerName, projectTitle, milestoneDescription, fileCount) => {
  const subject = '📎 New Deliverables Uploaded';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info-box { background: #FFF3E0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📎 Deliverables Ready</h1>
        </div>
        <div class="content">
          <p>Hi ${clientName},</p>
          <p>${freelancerName} has uploaded <strong>${fileCount} deliverable(s)</strong> for review.</p>
          <div class="info-box">
            <strong>Project:</strong> ${projectTitle}<br>
            <strong>Milestone:</strong> ${milestoneDescription}
          </div>
          <p>Please review the deliverables at your earliest convenience.</p>
          <a href="${process.env.CLIENT_URL}/contract" class="button">Review Deliverables</a>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(clientEmail, subject, html);
};

// Milestone Completed
const sendMilestoneCompletedEmail = async (clientEmail, clientName, freelancerName, projectTitle, milestoneDescription, amount) => {
  const subject = '✅ Milestone Completed - Payment Required';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #9C27B0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .amount { font-size: 32px; color: #4CAF50; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Milestone Complete!</h1>
        </div>
        <div class="content">
          <p>Hi ${clientName},</p>
          <p>${freelancerName} has marked a milestone as completed for: <strong>${projectTitle}</strong></p>
          <p><strong>Milestone:</strong> ${milestoneDescription}</p>
          <div class="amount">$${amount}</div>
          <p>Please review the work and make payment via PayPal to release funds to the freelancer.</p>
          <a href="${process.env.CLIENT_URL}/contract" class="button">Review & Pay Now</a>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(clientEmail, subject, html);
};

// Payment Received
const sendPaymentReceivedEmail = async (freelancerEmail, freelancerName, clientName, projectTitle, amount, totalPaid, totalAmount) => {
  const subject = '💰 Payment Received!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .amount { font-size: 36px; color: #4CAF50; font-weight: bold; margin: 20px 0; text-align: center; }
        .progress { background: #E0E0E0; height: 30px; border-radius: 15px; margin: 20px 0; overflow: hidden; }
        .progress-bar { background: #4CAF50; height: 100%; text-align: center; line-height: 30px; color: white; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Payment Received!</h1>
        </div>
        <div class="content">
          <p>Hi ${freelancerName},</p>
          <p>Great news! ${clientName} has paid for a milestone.</p>
          <p><strong>Project:</strong> ${projectTitle}</p>
          <div class="amount">+$${amount}</div>
          <p><strong>Total Progress:</strong></p>
          <div class="progress">
            <div class="progress-bar" style="width: ${(totalPaid / totalAmount * 100)}%">
              $${totalPaid} / $${totalAmount}
            </div>
          </div>
          <p>The payment has been processed via PayPal and will be available in your account shortly.</p>
          <a href="${process.env.CLIENT_URL}/freelancer-dashboard" class="button">View Details</a>
          <p>Keep up the great work!</p>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(freelancerEmail, subject, html);
};

// Project Completed
const sendProjectCompletedEmail = async (recipientEmail, recipientName, projectTitle, totalAmount) => {
  const subject = '🎉 Project Completed Successfully!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #FF6B6B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .celebration { text-align: center; font-size: 48px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Project Complete!</h1>
        </div>
        <div class="content">
          <div class="celebration">🎊 🎉 🎈</div>
          <p>Hi ${recipientName},</p>
          <p>Congratulations! The project <strong>${projectTitle}</strong> has been successfully completed.</p>
          <p><strong>Total Amount:</strong> $${totalAmount}</p>
          <p>All milestones have been delivered and paid. Thank you for using Collab-O!</p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="button">Back to Dashboard</a>
          <p>We hope to see you again soon!</p>
          <p>Best regards,<br>The Collab-O Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(recipientEmail, subject, html);
};

/**
 * Welcome Email (Signup)
 */
const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  const subject = '🎉 Welcome to Collab-O Platform!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FC427B 0%, #ff6b9d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #FC427B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #FC427B; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Collab-O!</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}! 👋</h2>
          <p>Thank you for joining <strong>Collab-O Platform</strong> - where clients and freelancers collaborate seamlessly!</p>
          
          <p>Your account as a <strong>${userRole}</strong> has been created successfully.</p>
          
          <h3>🚀 What's Next?</h3>
          
          ${userRole === 'client' ? `
          <div class="feature">
            <strong>📝 Post Your First Project</strong><br/>
            Create a project and get proposals from talented freelancers.
          </div>
          <div class="feature">
            <strong>👥 Review Proposals</strong><br/>
            Compare freelancer proposals and choose the best fit.
          </div>
          <div class="feature">
            <strong>🤝 AI-Generated Contracts</strong><br/>
            Our AI creates professional contracts automatically.
          </div>
          <div class="feature">
            <strong>💳 Secure Payments</strong><br/>
            Pay safely through PayPal with milestone-based payments.
          </div>
          ` : `
          <div class="feature">
            <strong>🔍 Browse Projects</strong><br/>
            Find exciting projects that match your skills.
          </div>
          <div class="feature">
            <strong>📄 Submit Proposals</strong><br/>
            Send proposals to clients with AI-assistance.
          </div>
          <div class="feature">
            <strong>✅ Digital Contracts</strong><br/>
            Sign contracts digitally and start working.
          </div>
          <div class="feature">
            <strong>💰 Get Paid Securely</strong><br/>
            Receive payments through PayPal upon milestone completion.
          </div>
          `}
          
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}" class="button">Get Started Now</a>
          </div>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Happy collaborating! 🎯</p>
        </div>
        <div class="footer">
          <p>© 2025 Collab-O Platform. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendProposalAcceptedEmail,
  sendContractGeneratedEmail,
  sendContractSignedEmail,
  sendDeliverablesUploadedEmail,
  sendMilestoneCompletedEmail,
  sendPaymentReceivedEmail,
  sendProjectCompletedEmail
};
