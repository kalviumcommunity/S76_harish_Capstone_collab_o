# 🔍 Contract View Troubleshooting Guide

## ✅ System Status
- **Server Running:** ✅ (Port 5000)
- **Client Running:** ✅ (Vite dev server)
- **Contract Routes:** ✅ (Responding on /api/contracts)
- **Contract Button Component:** ✅ (Updated with view/generate logic)

---

## 🎯 How to Access Contract View

### Step 1: Accept a Proposal
1. Go to **Client Dashboard** (`/clientDashboard`)
2. Click on a project that has proposals
3. View the proposals for that project
4. **Accept one proposal** (click "Accept Proposal" button)
5. Wait for the page to refresh

### Step 2: Look for Contract Button
After accepting, you should see one of these buttons:

**If contract doesn't exist yet:**
```
📄 Generate Contract with AI
```

**If contract already exists:**
```
📄 View Contract
Contract Status: [status]
```

### Step 3: Generate or View Contract
- Click the button
- You'll be redirected to `/contract/:contractId`
- The contract page will display

---

## 🐛 Troubleshooting

### Problem 1: "Contract button not showing"
**Causes:**
- Proposal not accepted yet
- Not on the proposals page

**Solution:**
1. Navigate to: `/projects/:projectId/`
2. Make sure proposal status shows "Accepted" (green badge)
3. Scroll down to the accepted proposal section
4. Button should appear below freelancer info

### Problem 2: "Button is loading forever"
**Causes:**
- API request failing
- Network error

**Solution:**
1. Open browser console (F12)
2. Check for red errors
3. Look for failed API calls to `/api/contracts`
4. Verify JWT token exists: `localStorage.getItem('token')`

### Problem 3: "Generate button does nothing when clicked"
**Causes:**
- Missing environment variable (GEMINI_API_KEY)
- Contract generation error

**Solution:**
Check server logs for errors:
```bash
# In server terminal, you should see:
[Server] POST /api/contracts/generate/:proposalId
[Error] ... (if any)
```

### Problem 4: "404 Not Found on contract page"
**Causes:**
- Route not registered
- Server not restarted after adding routes

**Solution:**
```bash
# Restart server
cd server
# Stop with Ctrl+C, then:
npm start
```

---

## 🧪 Manual Testing Steps

### Test 1: Check if Routes Work
```bash
# Test contract config endpoint (no auth needed)
curl http://localhost:5000/api/paypal/config

# Expected response:
# {"clientId":"...","currency":"USD"}
```

### Test 2: Check Contract Button Logic
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to proposals page
4. Watch for these logs:
   - "Checking for existing contract..."
   - "Contract found" or "No contract yet"

### Test 3: Test Contract Generation
1. Click "Generate Contract with AI"
2. Watch Network tab in DevTools
3. Look for:
   - POST request to `/api/contracts/generate/:proposalId`
   - Response status 200 or 201
   - Navigation to `/contract/:id`

---

## 📍 Where to Find Contract Button

The button appears here:
```
/projects/:projectId/  (Proposals Page)
    ↓
Accepted Proposal Section
    ↓
[Freelancer Info Card]
    ↓
📄 Generate Contract with AI  ← HERE
```

**Visual Location:**
- Below the freelancer's email
- Above the "Active Project Deliverables" section
- Only visible when proposal status = 'accepted'

---

## 🔍 Debug Checklist

- [ ] Server is running on port 5000
- [ ] Client is running (Vite)
- [ ] JWT token exists in localStorage
- [ ] Proposal is accepted (status = 'accepted')
- [ ] On the correct page: `/projects/:projectId/`
- [ ] Browser console shows no errors
- [ ] Contract button is visible
- [ ] Button responds to clicks

---

## 💡 Quick Debug Commands

### Check if token exists:
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Check proposal status:
```javascript
// In browser console, on proposals page:
console.log('Proposals:', proposals); // Should show array
console.log('Accepted:', proposals.find(p => p.status === 'accepted'));
```

### Force navigate to contract (if you know ID):
```javascript
// In browser console:
window.location.href = '/contract/YOUR_CONTRACT_ID_HERE';
```

---

## 🎯 Expected Flow

```
1. Client accepts proposal
   ↓
2. Page refreshes, shows "Accepted" badge
   ↓
3. Contract button appears (Generate or View)
   ↓
4. Click button
   ↓
5. API call: POST /api/contracts/generate/:proposalId
   ↓
6. AI generates contract (2-5 seconds)
   ↓
7. Navigate to: /contract/:contractId
   ↓
8. Contract page loads with full details
```

---

## 🆘 Still Not Working?

### Check Server Logs
Look for:
```
✅ Socket.IO initialized successfully
✅ database connected successfully
✅ Server is running at http://localhost:5000

Then when you click button:
POST /api/contracts/generate/:proposalId
```

### Check Browser Console
Look for:
```
✅ Checking for existing contract...
✅ No contract found (or Contract exists: {...})
✅ Generating contract...
✅ Navigating to contract page...

OR errors:
❌ Failed to generate contract
❌ Unauthorized
❌ Network error
```

### Common Fixes

**Fix 1: Clear localStorage and login again**
```javascript
// In browser console:
localStorage.clear();
// Then login again
```

**Fix 2: Hard refresh the page**
```
Ctrl + Shift + R (or Cmd + Shift + R on Mac)
```

**Fix 3: Check if proposal ID is valid**
```javascript
// In browser console:
console.log(window.location.pathname); // Should show /projects/:projectId
```

---

## 📞 Need More Help?

1. Share screenshot of:
   - Proposals page (showing accepted proposal)
   - Browser console (F12 → Console tab)
   - Network tab (F12 → Network tab)

2. Check server terminal for errors

3. Verify you're on the right page:
   - URL should be: `http://localhost:5173/projects/:projectId/`
   - Proposal should have green "Accepted" badge

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Button appears after accepting proposal
- ✅ Button click shows loading spinner
- ✅ Page navigates to `/contract/:id`
- ✅ Contract displays with full details
- ✅ You can sign the contract

---

**Updated:** The ContractButton component now automatically checks for existing contracts and shows either "Generate" or "View Contract" button accordingly!
