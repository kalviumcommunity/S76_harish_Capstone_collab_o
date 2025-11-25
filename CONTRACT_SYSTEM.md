# Contract System with AI Generation and PayPal Integration

## Overview
This implementation adds a comprehensive contract management system to Collab-O with:
- **AI-generated contracts** using Google Gemini
- **Digital signatures** from both parties
- **Milestone-based payments** via PayPal
- **Full contract lifecycle** management

---

## 🚀 Features Implemented

### 1. **AI Contract Generation**
- Automatically creates professional contracts after proposal acceptance
- Uses Google Gemini AI to generate customized terms
- Includes: scope, deliverables, payment terms, timeline, IP rights, confidentiality
- Fallback template if AI generation fails

### 2. **Contract Signing**
- Both client and freelancer must digitally sign
- Records signature, timestamp, and IP address
- Contract status tracking (pending → partially_signed → fully_signed)
- Email-like digital signature capture

### 3. **Milestone-Based Payments**
- Automatically creates payment milestones based on project amount
- Freelancer marks milestones as complete
- Client reviews and approves before payment
- Integrated PayPal payment buttons

### 4. **PayPal Integration**
- Complete PayPal payment flow (create order → capture payment)
- Records payment details in contract
- Support for both sandbox and live environments
- Automatic payment tracking

---

## 📁 Files Created

### Backend
1. **`server/model/Contract.js`** - MongoDB schema for contracts
2. **`server/services/contractAIService.js`** - AI contract generation service
3. **`server/controller/contractController.js`** - Contract CRUD and workflow
4. **`server/routes/contractRoutes.js`** - Contract API endpoints
5. **`server/routes/paypalRoutes.js`** - PayPal payment integration

### Frontend
1. **`client/src/pages/ContractView.jsx`** - Full contract display and signing UI
2. **`client/src/components/ContractButton.jsx`** - Button to generate contracts

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

#### Client (PayPal React SDK)
```bash
cd client
npm install @paypal/react-paypal-js
```

#### Server (No new dependencies needed)
All required packages are already installed (mongoose, jsonwebtoken, etc.)

### 2. Environment Variables

Add these to your **`server/config/.env`** file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live' for production

# Existing variables
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

#### **Getting PayPal Credentials:**

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a **Sandbox** or **Live** app
3. Copy the **Client ID** and **Secret**
4. Use `sandbox` mode for testing (no real money)
5. Switch to `live` mode for production

---

## 🔄 Workflow

### Step 1: Client Accepts Proposal
- Client views proposals and accepts one
- `POST /api/proposals/:proposalId/accept`

### Step 2: Generate Contract
- Client clicks **"Generate Contract with AI"** button
- System calls: `POST /api/contracts/generate/:proposalId`
- AI generates professional contract
- Contract is saved with status `pending`

### Step 3: Both Parties Sign
- Client and freelancer review contract
- Each signs digitally: `POST /api/contracts/:contractId/accept`
- Status updates: `pending` → `partially_signed` → `fully_signed`

### Step 4: Work on Milestones
- Freelancer completes work
- Marks milestone: `POST /api/contracts/:contractId/milestone/:index/complete`
- Status: `in_progress` → `completed`

### Step 5: Client Pays via PayPal
- Client reviews completed milestone
- Clicks **PayPal button**
- Payment flow:
  1. `POST /api/paypal/create-order` - Creates PayPal order
  2. User redirects to PayPal
  3. `POST /api/paypal/capture-order` - Captures payment
  4. `POST /api/contracts/:contractId/milestone/:index/pay` - Records payment
- Milestone status: `completed` → `paid`

### Step 6: Contract Completion
- When all milestones are paid
- Contract status: `fully_signed` → `completed`

---

## 📡 API Endpoints

### Contract Routes (`/api/contracts`)
```
POST   /generate/:proposalId          Generate AI contract
GET    /:contractId                   Get contract details
GET    /proposal/:proposalId          Get contract by proposal
POST   /:contractId/accept            Sign contract
POST   /:contractId/milestone/:index/complete    Mark milestone complete
POST   /:contractId/milestone/:index/pay         Record payment
```

### PayPal Routes (`/api/paypal`)
```
GET    /config                        Get PayPal client ID
POST   /create-order                  Create PayPal payment order
POST   /capture-order                 Capture completed payment
GET    /order/:orderId                Get order details
```

---

## 🎨 UI Components

### ContractView Page
- **Header**: Contract ID, status, parties info
- **Content**: Project scope, deliverables, payment terms, full contract text
- **Signature Section**: For unsigned contracts (input name + sign button)
- **Milestones**: List with status, PayPal buttons, action buttons
- **Progress Tracker**: Total paid vs total amount

### ContractButton Component
- Shows on accepted proposals
- "Generate Contract with AI" button
- Loading state with spinner
- Navigates to contract view after generation

---

## 🧪 Testing Guide

### 1. Test Contract Generation
```bash
# Accept a proposal (as client)
curl -X POST http://localhost:5000/api/proposals/{proposalId}/accept \
  -H "Authorization: Bearer YOUR_TOKEN"

# Generate contract
curl -X POST http://localhost:5000/api/contracts/generate/{proposalId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Signing
```bash
# Client signs
curl -X POST http://localhost:5000/api/contracts/{contractId}/accept \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"signature": "John Doe"}'

# Freelancer signs
curl -X POST http://localhost:5000/api/contracts/{contractId}/accept \
  -H "Authorization: Bearer FREELANCER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"signature": "Jane Smith"}'
```

### 3. Test PayPal (Sandbox)
1. Create [PayPal Sandbox accounts](https://developer.paypal.com/dashboard/accounts)
2. Use test buyer account credentials
3. Complete payment flow on PayPal
4. Verify payment recorded in contract

---

## 🔐 Security Features

1. **JWT Authentication**: All endpoints require valid token
2. **Access Control**: Only contract parties can view/sign
3. **IP Logging**: Records IP address of signers
4. **Signature Verification**: Both parties must sign
5. **Payment Verification**: PayPal signature verification
6. **Role-Based Actions**:
   - Only freelancer can mark milestones complete
   - Only client can approve and pay milestones

---

## 🎯 Contract Schema Highlights

```javascript
{
  proposalId: ObjectId,
  projectId: ObjectId,
  clientId: ObjectId,
  freelancerId: ObjectId,
  
  contractText: String,          // Full AI-generated contract
  projectScope: String,
  deliverables: [String],
  paymentAmount: Number,
  paymentTerms: String,
  timeline: String,
  
  clientAccepted: Boolean,
  clientAcceptedAt: Date,
  clientSignature: String,
  
  freelancerAccepted: Boolean,
  freelancerAcceptedAt: Date,
  freelancerSignature: String,
  
  status: enum['pending', 'partially_signed', 'fully_signed', 'completed'],
  
  milestones: [{
    description: String,
    amount: Number,
    dueDate: Date,
    status: enum['pending', 'in_progress', 'completed', 'paid'],
    paymentId: String
  }],
  
  totalPaid: Number,
  paypalOrderId: String
}
```

---

## 📊 Database Indexes

The Contract model includes indexes on:
- `proposalId` - Quick lookup by proposal
- `projectId` - Find all contracts for a project
- `clientId, freelancerId` - User-specific contract queries

---

## 🚨 Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Contract already exists" | Duplicate generation | Use existing contract |
| "Proposal must be accepted" | Wrong proposal state | Accept proposal first |
| "Only client can pay" | Wrong user role | Login as client |
| "Milestone not completed" | Premature payment | Freelancer must mark complete |
| "PayPal order creation failed" | Invalid credentials | Check PAYPAL_CLIENT_ID |

---

## 🎨 UI Screenshots Description

### Contract View
- **Clean white cards** with rounded corners
- **Status badges**: Color-coded (green=signed, yellow=pending, blue=in progress)
- **Gradient buttons**: Purple-to-indigo for actions
- **PayPal buttons**: Integrated inline for each milestone
- **Signature input**: Simple text field with sign button
- **Progress bar**: Shows total paid vs remaining

### Contract Button
- **Gradient background**: Blue-to-purple
- **AI emoji**: 📄 indicates AI generation
- **Loading spinner**: Shows during generation
- **Disabled state**: Gray when generating

---

## 🔄 Socket.IO Events

The contract system emits real-time events:

```javascript
// Contract generated
io.to(`user_${clientId}`).emit('contractGenerated', { contractId });

// Contract signed
io.to(`user_${otherPartyId}`).emit('contractSigned', { 
  contractId, 
  signedBy: 'client' | 'freelancer',
  fullyExecuted: true/false 
});

// Milestone completed
io.to(`user_${clientId}`).emit('milestoneCompleted', { 
  contractId, 
  milestoneIndex 
});

// Payment received
io.to(`user_${freelancerId}`).emit('paymentReceived', { 
  contractId, 
  amount 
});
```

---

## 🎓 Future Enhancements

1. **PDF Export**: Generate downloadable PDF contracts
2. **Email Notifications**: Send emails on contract events
3. **Escrow System**: Hold payments in escrow until approval
4. **Dispute Resolution**: Built-in arbitration system
5. **Multi-Currency**: Support for EUR, GBP, etc.
6. **Recurring Payments**: For subscription-based projects
7. **Contract Templates**: Pre-defined templates for common projects
8. **Version Control**: Track contract amendments
9. **Electronic Signature**: Legal e-signature integration (DocuSign, etc.)

---

## 📞 Support

For issues or questions:
1. Check contract status in database
2. Review server logs for AI generation errors
3. Verify PayPal sandbox credentials
4. Check JWT token expiration
5. Ensure proposal is accepted before generating contract

---

## ✅ Checklist

- [x] Contract model created
- [x] AI generation service implemented
- [x] Contract controller with full CRUD
- [x] PayPal integration routes
- [x] Frontend contract view page
- [x] Contract generation button
- [x] Routes registered in server
- [x] App.jsx route added
- [ ] Install `@paypal/react-paypal-js` package
- [ ] Add PayPal credentials to .env
- [ ] Test full workflow
- [ ] Deploy to production

---

**Remember**: Always use PayPal **sandbox mode** during development to avoid real charges!
