# 🔧 FIX: Extension Not Saving to Firestore

## Problem
✅ Extension analyzes URLs (shows trust score)
❌ Results don't appear on Browser Shield Dashboard
❌ Data not saved to Firestore

## Root Cause
Your extension's Firebase credentials are **not configured**. The `popup.js` file has placeholder values like `"YOUR_FIREBASE_API_KEY"`.

---

## ✅ Solution: Get Real Firebase Credentials

### Step 1: Open Firebase Console
1. Go to: **https://console.firebase.google.com**
2. Click your project
3. Click the **gear icon** (⚙️) → **Project Settings**

### Step 2: Get Credentials
Copy these exact values:

```
API Key:                   apiKey
Auth Domain:              authDomain  
Project ID:               projectId
Storage Bucket:           storageBucket
Messaging Sender ID:      messagingSenderId
App ID:                   appId
```

They look like this in the console:
```
{
  "apiKey": "AIzaSyD_3K9m... (long string)",
  "authDomain": "ciphernet-12345.firebaseapp.com",
  "projectId": "ciphernet-12345",
  "storageBucket": "ciphernet-12345.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef1234567890"
}
```

### Step 3: Update Extension Configuration
File: **`extensions/popup.js`** (around line 16-22)

**BEFORE (wrong):**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  // ... etc
};
```

**AFTER (correct):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD_3K9m7fY2pQ8xZ9a0bC1dE2fG3hI4jK5l",
  authDomain: "ciphernet-12345.firebaseapp.com",
  projectId: "ciphernet-12345",
  storageBucket: "ciphernet-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

### Step 4: Reload Extension
1. Right-click your browser
2. Click "Inspect popup" in extension
3. Go to **Console** tab
4. Look for:
   - ✅ `"✅ Firebase initialized successfully"`
   - ✅ `"✅ Firestore connected and ready"`

OR

4. Click **reload** in chrome://extensions/

### Step 5: Test Scan
1. Click extension icon
2. Click "Scan Current Site"
3. Check popup for status message:
   - ✅ `"✓ Scan saved to dashboard"` = SUCCESS
   - ❌ `"Permission denied"` = Check Firestore security rules (step below)
   - ❌ `"Not authenticated"` = Check Firebase credentials

### Step 6: Verify Firestore Rules (if getting "Permission denied")

Go to **Firebase Console** → **Firestore Database** → **Rules** tab

Paste this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads/writes for now (secure later)
    match /browser_scans/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish**

---

## 🔍 Debug: Check Extension Console

**Steps:**
1. Right-click CipherNet Shield icon
2. Click **"Inspect popup"**
3. Go to **Console** tab
4. Click "Scan Current Site" in extension
5. Watch the console for messages:

**Expected ✅:**
```
✅ Firebase initialized successfully
✅ Firestore connected and ready
📤 Sending scan to Firestore... https://example.com
✅ Scan saved to Firestore with ID: abc123xyz
```

**If you see ❌:**
```
❌ Firebase credentials not set!
⚠️ Firebase SDK not loaded from CDN
❌ Firebase initialization failed: [error]
```

---

## 🔍 Debug: Check Dashboard Console

**Steps:**
1. Open http://localhost:5173/browser-shield
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Look for:

**Expected ✅:**
```
[Firestore listener] Scans updated: [...]
```

**If you see errors:**
- Check that Firestore listener is working
- Verify `db` is initialized in `src/firebase.ts`

---

## ✅ Verify Data in Firestore

1. Open **Firebase Console**
2. Go to **Firestore Database**
3. Click **browser_scans** collection
4. Should see documents appearing with your scans

Each document should have:
```json
{
  "url": "https://example.com",
  "trustScore": 85,
  "threatLevel": "SAFE",
  "phishingRisk": 15,
  "scannedAt": "2026-05-10T14:35:22.123Z"
}
```

---

## 🚀 Once Configured

After updating the credentials:

1. **Extension** scans URL
2. Saves to **Firestore** (✅ you'll see success message)
3. **Dashboard** real-time listener detects new document
4. **Dashboard** updates instantly with:
   - Extension Popup shows latest scan
   - Real-Time Threat Feed updates
   - Stats recalculate
   - All in <100ms

---

## ⚡ Quick Checklist

- [ ] Got Firebase credentials from Firebase Console
- [ ] Updated extensions/popup.js with real credentials
- [ ] Reloaded extension in Chrome
- [ ] Check extension console shows "✅ Firebase initialized"
- [ ] Check extension console shows "✓ Scan saved to dashboard"
- [ ] Check Firestore has documents in browser_scans collection
- [ ] Check dashboard shows data without refresh

---

## 💡 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `"Firebase not loaded"` | CDN not loading | Check popup.html has Firebase script tag |
| `"Permission denied"` | Security rules too strict | Use rules from Step 6 above |
| `"Not authenticated"` | Wrong credentials | Double-check values from Firebase Console |
| Data not appearing on dashboard | Listener not connected | Check useFirestoreScan hooks mounted |
| Slow updates | Listener detached | Check Firestore listener cleanup |

---

## 📞 Support

Check the browser console (right-click extension → Inspect popup → Console) for detailed error messages that will tell you exactly what's wrong.

The extension now has **much better debugging** - it will tell you:
- ✅ If Firebase is initialized
- ❌ If credentials are wrong
- ❌ If Firestore rules deny access
- ❌ Exact error codes and messages

