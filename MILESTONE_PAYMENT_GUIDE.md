# Milestone Payment & Deliverables Guide

## Complete Workflow Overview

This guide explains how the milestone-based payment system works with deliverable uploads and PayPal integration.

## 🔄 Complete Workflow

### Step 1: Contract Signing
1. Both client and freelancer sign the AI-generated contract
2. Once fully signed, the first milestone automatically changes to "in_progress"
3. Contract status changes to "fully_signed"

### Step 2: Freelancer Uploads Deliverables
**Freelancer Actions (when milestone is "in_progress"):**
1. Navigate to the contract view page
2. For the active milestone, click the file upload button
3. Select deliverables (supports multiple files up to 50MB each)
4. Add optional notes describing the deliverables
5. Click "Upload Files" button
6. Review uploaded files and click "Mark as Completed"

**File Types Supported:**
- Images: JPEG, JPG, PNG, GIF
- Documents: PDF, DOC, DOCX, TXT
- Archives: ZIP, RAR
- Videos: MP4, MOV, AVI

**Important:** Freelancer MUST upload deliverables before marking milestone as complete!

### Step 3: Mark Milestone Complete
1. After uploading deliverables, freelancer clicks "Mark as Completed"
2. Backend validates that deliverables exist
3. Milestone status changes to "completed"
4. Client receives real-time notification via Socket.IO

### Step 4: Client Reviews & Pays
**Client Actions (when milestone is "completed"):**
1. Navigate to the contract view page
2. Review the uploaded deliverables
3. Read any notes from freelancer
4. Click the PayPal payment button
5. Complete payment through PayPal checkout

**PayPal Payment Flow:**
1. PayPal overlay opens with payment details
2. Client logs in to PayPal and confirms payment
3. Backend captures the payment
4. Milestone status changes to "paid"
5. Contract `totalPaid` increments by milestone amount
6. Freelancer receives real-time payment notification

### Step 5: Project Completion
- When ALL milestones are marked as "paid"
- Contract status automatically changes to "completed"
- Total paid matches the contract amount

## 🔧 Technical Implementation

### Backend Endpoints

#### Upload Deliverables
```
POST /api/contracts/:contractId/milestone/:milestoneIndex/deliverables
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- deliverables: File[] (max 10 files, 50MB each)
- notes: String (optional)
```

#### Complete Milestone
```
POST /api/contracts/:contractId/milestone/:milestoneIndex/complete
Headers: Authorization: Bearer <token>

Response: Updated milestone with status "completed"
```

#### Record Payment
```
POST /api/contracts/:contractId/milestone/:milestoneIndex/pay
Headers: Authorization: Bearer <token>

Body:
{
  "paymentId": "capture-id-from-paypal",
  "paypalOrderId": "order-id",
  "paypalPayerId": "payer-id"
}
```

### PayPal Integration

#### Create Order
```
POST /api/paypal/create-order
{
  "amount": 500,
  "currency": "USD",
  "description": "Project Name - Milestone Description",
  "contractId": "contract-id",
  "milestoneIndex": 0
}

Response: { orderId: "paypal-order-id" }
```

#### Capture Payment
```
POST /api/paypal/capture-order
{
  "orderId": "paypal-order-id"
}

Response: {
  "captureId": "payment-capture-id",
  "orderId": "paypal-order-id",
  "payerId": "payer-id"
}
```

## 📊 Milestone Status States

1. **pending**: Initial state, waiting to start
2. **in_progress**: Freelancer is working (can upload deliverables)
3. **completed**: Freelancer finished, deliverables uploaded, awaiting payment
4. **paid**: Client has paid, milestone complete

## 🔐 Access Control

### Freelancer Can:
- Upload deliverables to in-progress milestones
- Mark milestones as completed (after uploading deliverables)
- View all milestone details and deliverables

### Client Can:
- View uploaded deliverables
- Make payments for completed milestones
- View payment history

## 📁 File Storage

- Deliverables are stored in: `server/uploads/deliverables/`
- Filename format: `deliverable-{timestamp}-{random}.{extension}`
- File metadata stored in MongoDB (filename, path, size, uploadedAt)

## 🔔 Real-Time Notifications

### Socket.IO Events:
1. **deliverablesUploaded**: Sent to client when freelancer uploads files
2. **milestoneCompleted**: Sent to client when milestone marked complete
3. **paymentReceived**: Sent to freelancer when client pays

## 💡 Best Practices

### For Freelancers:
1. Upload deliverables progressively as you complete work
2. Add clear notes explaining what's included
3. Organize files logically (zip if many files)
4. Test files before uploading
5. Only mark complete when truly finished

### For Clients:
1. Review deliverables thoroughly before paying
2. Download and test deliverables
3. Communicate issues before paying if work is incomplete
4. Pay promptly when satisfied
5. Keep payment receipts from PayPal

## 🐛 Error Handling

### Common Errors:

**"Please upload deliverables before completing milestone"**
- Solution: Upload at least one file before clicking "Mark as Completed"

**"Invalid file type"**
- Solution: Only upload supported file types (images, PDFs, documents, videos, archives)

**"File too large"**
- Solution: Reduce file size or split into multiple smaller files (max 50MB each)

**"Payment failed"**
- Solution: Check PayPal account, ensure sufficient funds, retry payment

**"Only freelancer can upload deliverables"**
- Solution: Make sure you're logged in as the freelancer on this contract

**"Cannot upload deliverables for paid milestone"**
- Solution: Once paid, milestones are locked. Contact support if changes needed

## 📈 Progress Tracking

The contract view shows:
- Total paid vs. total contract amount
- Individual milestone status badges
- Deliverable count per milestone
- Payment dates and IDs
- Completion timeline

## 🔄 Next Milestone Activation

- Milestones are sequential
- Only one milestone can be "in_progress" at a time
- Next milestone starts when previous one is paid
- Manual activation coming in future updates

## 🎯 Success Metrics

Monitor in contract view:
- Number of uploaded deliverables
- Milestone completion rate
- Payment velocity
- Total amount paid
- Outstanding balance

---

**Need Help?**
- Check CONTRACT_SYSTEM.md for overall architecture
- See QUICKSTART_CONTRACTS.md for setup guide
- Review CONTRACT_TROUBLESHOOTING.md for common issues
