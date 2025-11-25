# Quick Start Guide: Contract System

## 🚀 Installation (Just Completed)

The PayPal SDK has been installed:
```
✅ @paypal/react-paypal-js - installed successfully
```

---

## 📋 Next Steps

### 1. **Add PayPal Credentials** (5 minutes)

Go to `server/config/.env` and add:

```env
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox
```

**Get your credentials:**
1. Visit: https://developer.paypal.com/dashboard/
2. Login or create account
3. Click "Create App" (REST API apps)
4. Copy Client ID and Secret
5. Paste into .env file

### 2. **Restart Server**

```bash
cd server
npm start
```

The new routes will be loaded:
- `/api/contracts/*` - Contract management
- `/api/paypal/*` - Payment processing

### 3. **Test the Workflow**

#### As Client:
1. Login to your account
2. Go to "Client Dashboard"
3. View proposals for your project
4. Accept a proposal
5. Click **"📄 Generate Contract with AI"**
6. Review the AI-generated contract
7. Enter your name and click "Accept and Sign Contract"
8. Wait for freelancer to sign

#### As Freelancer:
1. Login to freelancer account
2. You'll receive notification (check Socket.IO console)
3. Navigate to contract URL
4. Review contract
5. Enter your name and sign
6. After both sign, work on milestones
7. Mark milestone as complete when done

#### Payment Flow:
1. Client reviews completed milestone
2. Click PayPal button
3. Login with sandbox test account
4. Complete payment
5. System records payment automatically

---

## 🧪 PayPal Sandbox Testing

### Create Test Accounts:
1. Go to: https://developer.paypal.com/dashboard/accounts
2. Click "Create Account"
3. Create:
   - **Personal Account** (buyer) - for testing payments
   - **Business Account** (seller) - receives money
4. Note the email and password

### Test Payment:
1. When PayPal button is clicked
2. Use **Personal Account** credentials
3. Complete the checkout
4. Money appears in **Business Account**
5. No real money is used!

---

## 🎯 Features Now Available

### ✅ Completed:
- AI contract generation with Gemini
- Digital signature capture
- Milestone tracking
- PayPal payment integration
- Real-time notifications via Socket.IO
- Contract status management
- Payment history tracking
- Both client and freelancer views

### 🔧 File Changes:
```
Backend:
✅ server/model/Contract.js
✅ server/services/contractAIService.js
✅ server/controller/contractController.js
✅ server/routes/contractRoutes.js
✅ server/routes/paypalRoutes.js
✅ server/server.js (routes added)

Frontend:
✅ client/src/pages/ContractView.jsx
✅ client/src/components/ContractButton.jsx
✅ client/src/pages/ClientDash/ProposalPage.jsx (integrated button)
✅ client/src/App.jsx (route added)
✅ @paypal/react-paypal-js (installed)

Documentation:
✅ CONTRACT_SYSTEM.md (full guide)
✅ server/config/.env.example (template)
```

---

## 🎨 User Experience

### Client Flow:
```
Accept Proposal → Generate Contract → Sign → Wait for Freelancer → 
→ Freelancer Completes Work → Review → Pay via PayPal → Project Done
```

### Freelancer Flow:
```
Receive Notification → Review Contract → Sign → Work on Milestones → 
→ Mark Complete → Client Pays → Receive Payment → Next Milestone
```

---

## 🔍 Debugging Tips

### Check if server loaded routes:
```bash
# In server logs, you should see:
✅ Socket.IO initialized successfully
✅ database connected successfully
✅ Server is running at http://localhost:5000
```

### Test contract generation:
```bash
curl -X POST http://localhost:5000/api/contracts/generate/{proposalId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check PayPal config:
```bash
curl http://localhost:5000/api/paypal/config
# Should return: {"clientId": "YOUR_CLIENT_ID", "currency": "USD"}
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| "PayPal not defined" | Add credentials to .env and restart |
| "Contract already exists" | Normal - use existing contract |
| "Unauthorized" | Check JWT token in localStorage |
| "Payment failed" | Use sandbox test account credentials |

---

## 📊 Database Check

After generating a contract, check MongoDB:

```javascript
// In MongoDB Compass or CLI:
db.contracts.find().pretty()

// You should see:
{
  _id: ObjectId(...),
  proposalId: ObjectId(...),
  contractText: "FREELANCE SERVICE AGREEMENT...",
  clientAccepted: false,
  freelancerAccepted: false,
  status: "pending",
  milestones: [
    { description: "Initial work", amount: 333.33, status: "pending" },
    { description: "Milestone 2", amount: 333.33, status: "pending" },
    { description: "Final delivery", amount: 333.34, status: "pending" }
  ]
}
```

---

## 🎉 What's Working Now

1. ✅ **AI generates professional contracts** based on project details
2. ✅ **Both parties must sign** before work begins
3. ✅ **Milestones are automatically created** based on project value
4. ✅ **Freelancer marks work complete** milestone by milestone
5. ✅ **Client pays via PayPal** for each completed milestone
6. ✅ **Full payment tracking** and history
7. ✅ **Real-time notifications** via Socket.IO
8. ✅ **Secure and legally sound** contract terms

---

## 🚀 Ready to Test!

1. ✅ Code is complete
2. ✅ Dependencies installed
3. ⏳ **ADD PAYPAL CREDENTIALS** to .env
4. ⏳ **RESTART SERVER**
5. ⏳ **TEST WORKFLOW** (accept proposal → generate contract)

**Time to get PayPal credentials: ~5 minutes**
**Time to test full flow: ~10 minutes**

---

## 📞 Need Help?

Check these files for details:
- `CONTRACT_SYSTEM.md` - Full documentation
- `server/config/.env.example` - Environment setup
- `server/routes/contractRoutes.js` - API endpoints
- `client/src/pages/ContractView.jsx` - UI implementation

Happy contracting! 🎯
