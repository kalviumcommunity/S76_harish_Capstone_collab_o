# Testing Complete Payment Flow

## Quick Test Checklist

### Prerequisites
- ✅ Server running on port 5000
- ✅ Client running on port 5173
- ✅ MongoDB connected
- ✅ PayPal sandbox credentials configured
- ✅ Two user accounts (one client, one freelancer)

## 🧪 Test Scenario: Complete Project Delivery & Payment

### Phase 1: Setup (Client)
1. Login as client
2. Create a new project
3. Wait for freelancer proposal

### Phase 2: Proposal & Contract (Freelancer → Client)
1. Login as freelancer
2. Submit proposal on client's project
3. Logout freelancer
4. Login as client
5. Accept freelancer's proposal
6. Click "Generate Contract" button
7. Review AI-generated contract
8. Type your full name as signature
9. Click "Accept and Sign Contract"
10. Logout client

### Phase 3: Sign Contract (Freelancer)
1. Login as freelancer
2. Navigate to Freelancer Dashboard
3. Find accepted proposal
4. Click "View Contract" button
5. Review contract terms
6. Type your full name as signature
7. Click "Accept and Sign Contract"
8. ✅ First milestone should now show "IN PROGRESS" status

### Phase 4: Upload Deliverables (Freelancer)
1. Scroll to "Project Milestones" section
2. Find first milestone (status: in_progress)
3. Click file upload input
4. Select 1-3 test files (images, PDFs, etc.)
5. Add delivery notes: "Initial version completed with all features"
6. Click "Upload Files" button
7. ✅ See uploaded files listed with file sizes
8. Click "Mark as Completed" button
9. ✅ Milestone status changes to "COMPLETED"
10. Logout freelancer

### Phase 5: Review & Pay (Client)
1. Login as client
2. Navigate to contract view (via notification or proposal page)
3. Scroll to milestones section
4. ✅ See milestone status: "COMPLETED"
5. ✅ Review uploaded deliverables
6. ✅ Read delivery notes
7. Click PayPal payment button
8. Complete PayPal sandbox payment:
   - Email: sb-buyer@personal.example.com
   - Password: Test1234
9. Confirm payment in PayPal
10. ✅ Return to contract page
11. ✅ Milestone status changes to "PAID"
12. ✅ Total Paid increases
13. ✅ Freelancer receives notification

### Phase 6: Subsequent Milestones (Repeat)
1. Next milestone automatically becomes "in_progress"
2. Repeat Phase 4 and 5 for each milestone
3. ✅ When all milestones paid, contract status: "COMPLETED"

## 🎯 Verification Points

### After Upload
- [ ] Files appear in milestone deliverables section
- [ ] File sizes displayed correctly
- [ ] Notes appear if provided
- [ ] Upload button becomes "Mark as Completed"
- [ ] Files saved to `server/uploads/deliverables/`

### After Mark Complete
- [ ] Milestone status badge shows "COMPLETED"
- [ ] Client sees deliverables
- [ ] PayPal button appears for client
- [ ] Socket notification sent to client

### After Payment
- [ ] Milestone status badge shows "PAID"
- [ ] Payment date displayed
- [ ] Total Paid amount updated
- [ ] Payment recorded in MongoDB
- [ ] Socket notification sent to freelancer
- [ ] Next milestone starts (if any)

### Final Completion
- [ ] All milestones show "PAID" status
- [ ] Total Paid = Contract Amount
- [ ] Contract status = "completed"
- [ ] Both parties see completion message

## 🐛 Test Error Cases

### Test 1: Complete Without Deliverables
1. Try to click "Mark as Completed" without uploading files
2. ✅ Should show error: "Please upload deliverables before completing milestone"

### Test 2: Unauthorized Upload
1. Login as client
2. Try to access milestone upload (won't show upload UI)
3. ✅ Client should NOT see upload controls

### Test 3: File Type Validation
1. Try uploading .exe or .sh file
2. ✅ Should show error: "Invalid file type"

### Test 4: Large File Upload
1. Try uploading file > 50MB
2. ✅ Should show error about file size

### Test 5: Payment Before Completion
1. As client, try to pay milestone still "in_progress"
2. ✅ PayPal button should NOT appear

## 📊 Database Verification

### Check Contract Document
```javascript
// In MongoDB or via API
{
  status: "completed",
  totalPaid: 1000, // matches paymentAmount
  milestones: [
    {
      status: "paid",
      deliverables: [
        {
          filename: "design.png",
          path: "uploads/deliverables/deliverable-123456.png",
          size: 245000,
          uploadedAt: "2025-11-25T..."
        }
      ],
      notes: [{ text: "Initial version...", createdAt: "..." }],
      paidAt: "2025-11-25T...",
      paymentId: "CAPTURE-123ABC..."
    }
  ]
}
```

## 🔍 Debug Checklist

### If Upload Fails:
- Check `server/uploads/deliverables/` directory exists
- Verify multer middleware attached to route
- Check file size < 50MB
- Verify file type is allowed
- Check Authorization header present

### If Complete Fails:
- Verify deliverables array not empty
- Check user is freelancer
- Verify milestone in "in_progress" status
- Check contract ID valid

### If Payment Fails:
- Verify PayPal sandbox credentials correct
- Check PayPal buttons script loaded
- Verify milestone in "completed" status
- Check user is client
- Review browser console for PayPal errors

## ✅ Success Criteria

### Complete Flow Success:
1. ✅ Contract generated from accepted proposal
2. ✅ Both parties signed contract
3. ✅ Freelancer uploaded deliverables for all milestones
4. ✅ Freelancer marked all milestones complete
5. ✅ Client paid all milestones via PayPal
6. ✅ Contract status shows "completed"
7. ✅ Total paid equals contract amount
8. ✅ All files stored correctly
9. ✅ Real-time notifications worked
10. ✅ No console errors

## 🎬 Quick Demo Script

**2-Minute Demo:**
1. Show signed contract with milestones (0:30)
2. Upload deliverables as freelancer (0:45)
3. Mark milestone complete (0:15)
4. Switch to client, review deliverables (0:15)
5. Complete PayPal payment (0:30)
6. Show updated status and total paid (0:15)

**Time Saver:**
- Pre-create accounts
- Pre-accept proposal
- Pre-sign contract
- Start from Phase 4 (Upload)

## 📝 Test Data

### Sample Deliverable Notes:
- "Initial design mockups with responsive layouts"
- "Backend API completed with authentication endpoints"
- "Final version with all requested revisions"
- "Documentation and deployment guide included"

### Sample Test Files:
- sample-design.png (500KB)
- project-report.pdf (2MB)
- code-archive.zip (5MB)
- demo-video.mp4 (10MB)

---

**Pro Tips:**
- Use browser dev tools to monitor network requests
- Check MongoDB Compass for real-time data updates
- Watch server console for logs and errors
- Test in incognito for clean sessions
- Use PayPal sandbox for safe testing
