# 🔐 Gmail App Password Setup - Step by Step

## Current Issue
You're using your regular Gmail password, but Google requires an **App Password** for third-party apps like Nodemailer.

---

## ✅ Step-by-Step Instructions

### Step 1: Enable 2-Factor Authentication

1. Open: **https://myaccount.google.com/security**
2. Sign in with **imharishba@gmail.com**
3. Scroll down to "**How you sign in to Google**"
4. Click on "**2-Step Verification**"
5. If not enabled, click "**Get Started**" and follow the setup
6. ✅ Verify it shows "**2-Step Verification is on**"

### Step 2: Generate App Password

1. Open: **https://myaccount.google.com/apppasswords**
   - OR go to Security → 2-Step Verification → scroll down to "App passwords"
2. You might need to sign in again
3. You'll see "**App passwords**" page
4. Under "**Select app**", choose:
   - **Option A**: Select "**Mail**" from dropdown
   - **Option B**: Select "**Other (Custom name)**" and type `Collab-O`
5. Under "**Select device**", choose your device or "**Other**"
6. Click "**Generate**"
7. You'll see a **yellow box** with a 16-character password like:
   ```
   abcd efgh ijkl mnop
   ```
8. **COPY THIS PASSWORD IMMEDIATELY** (you won't see it again!)

### Step 3: Update .env File

Open: `/server/.env`

Update the line:
```env
GMAIL_APP_PASSWORD=your-current-password
```

To:
```env
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important:**
- Remove all spaces: `abcdefghijklmnop` (16 characters)
- Or keep spaces: `abcd efgh ijkl mnop` (both work)
- Do NOT use your regular Gmail password
- Do NOT use `harish$2006` or similar

### Step 4: Test Email

Run:
```bash
cd server
node test-email.js
```

You should see:
```
✅ SUCCESS! Email sent successfully!
📬 Check your inbox: imharishba@gmail.com
```

---

## 🐛 Troubleshooting

### "Application-specific password required"
❌ You're using regular password  
✅ Use the 16-character App Password from Step 2

### "Can't find App passwords option"
❌ 2-Factor Authentication not enabled  
✅ Enable 2FA first (Step 1)

### "Invalid login" error
- Make sure you copied the ENTIRE 16-character password
- Remove any extra spaces at the beginning/end
- Generate a NEW App Password if you lost it

### Still not working?
1. Delete the old App Password from Google
2. Generate a FRESH App Password
3. Copy it carefully (all 16 characters)
4. Update .env immediately
5. Restart server: `npm run dev`
6. Test: `node test-email.js`

---

## 📧 What happens after setup?

Once working, your platform will automatically send:

1. **Welcome Email** - When users sign up
2. **Proposal Accepted** - When client accepts freelancer proposal
3. **Contract Generated** - When AI creates contract
4. **Contract Signed** - When either party signs
5. **Deliverables Uploaded** - When freelancer uploads files
6. **Milestone Completed** - When work is done
7. **Payment Received** - When client pays via PayPal
8. **Project Completed** - When all milestones are paid

All emails will be sent FROM: **imharishba@gmail.com**  
All emails will be sent TO: **User's registered email**

---

## 🔒 Security Notes

- App Passwords are SAFER than using your main password
- Each app gets its own password
- You can revoke App Passwords anytime
- Never share App Passwords
- Keep .env file in .gitignore

---

## ✅ Quick Checklist

- [ ] 2-Factor Authentication enabled
- [ ] App Password generated (16 characters)
- [ ] .env file updated with App Password
- [ ] Test email sent successfully
- [ ] Checked inbox for test email
- [ ] Server restarted

---

**Need help?** The error message will guide you if something is wrong!
