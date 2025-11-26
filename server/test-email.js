require('dotenv').config();
const emailService = require('./services/emailService');

async function testEmail() {
  console.log('\n🧪 Testing Email Configuration...\n');
  console.log('📧 Gmail User:', process.env.GMAIL_USER);
  console.log('🔑 App Password:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Not Set');
  
  if (!process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD === 'your-16-character-app-password') {
    console.log('\n⚠️  ERROR: Gmail App Password not configured!');
    console.log('\n📝 Steps to fix:');
    console.log('1. Go to: https://myaccount.google.com/apppasswords');
    console.log('2. Sign in with your Gmail account (imharishba@gmail.com)');
    console.log('3. Create an App Password named "Collab-O"');
    console.log('4. Copy the 16-character password');
    console.log('5. Update .env file: GMAIL_APP_PASSWORD=<your-password>');
    console.log('6. Run this test again\n');
    return;
  }
  
  console.log('\n📤 Sending test email to:', process.env.GMAIL_USER);
  
  try {
    const result = await emailService.sendEmail(
      process.env.GMAIL_USER,
      '🧪 Test Email - Collab-O Platform',
      `
        <h1>✅ Email Configuration Successful!</h1>
        <p>Your Collab-O platform can now send emails.</p>
        <p><strong>Tested at:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Gmail:</strong> ${process.env.GMAIL_USER}</p>
        <hr/>
        <p>Now your users will receive:</p>
        <ul>
          <li>✅ Welcome emails on signup</li>
          <li>✅ Proposal acceptance notifications</li>
          <li>✅ Contract generation alerts</li>
          <li>✅ Payment confirmations</li>
          <li>✅ And more!</li>
        </ul>
      `
    );
    
    if (result.success) {
      console.log('\n✅ SUCCESS! Email sent successfully!');
      console.log('📬 Check your inbox:', process.env.GMAIL_USER);
      console.log('📨 Message ID:', result.messageId);
      console.log('\n🎉 Your email system is working!\n');
    } else {
      console.log('\n❌ FAILED:', result.error);
    }
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\n💡 Common issues:');
    console.log('- Invalid App Password');
    console.log('- 2-Factor Authentication not enabled');
    console.log('- Wrong Gmail address');
    console.log('- Network/firewall issues\n');
  }
}

testEmail();
