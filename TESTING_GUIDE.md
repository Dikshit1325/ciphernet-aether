# ✅ TESTING & VERIFICATION GUIDE

## Status: Fixed! 🎉
Your extension now has **valid Firebase credentials** matching your dashboard.

---

## 🧪 Step 1: Reload Extension

1. Go to **chrome://extensions/**
2. Find **CipherNet Shield**
3. Click the **refresh icon** 🔄
4. Keep the tab open

---

## 🧪 Step 2: Test Extension Console

1. **Right-click** CipherNet Shield icon (top right of Chrome)
2. Click **"Inspect popup"**
3. Go to **Console** tab
4. You should immediately see:

```
✅ Firebase initialized successfully
✅ Firestore connected and ready
```

If you see ❌ errors instead:
- Copy the full error message
- Check Firebase credentials in `extensions/popup.js` match `.env` file

---

## 🧪 Step 3: Test a Scan

1. In the **same popup window**, click **"Scan Current Site"**
2. **Wait 2 seconds** while extension analyzes
3. You should see:
   - Trust score appears (0-100)
   - Threat level badge (SAFE/LOW/MEDIUM/HIGH)
   - Green/yellow/red color
   - AI explanation text

4. Check **Console** for success message:

```
✅ Firebase initialized successfully
✅ Firestore connected and ready
📤 Sending scan to Firestore... https://google.com
✅ Scan saved to Firestore with ID: abc123xyz
✓ Scan saved to dashboard
```

**If you see the extension UI but NOT the success message:**
- Check browser console for errors
- Check that the status message shows "✓ Scan saved to dashboard"

---

## 🧪 Step 4: Verify Firestore Received Data

1. Open **https://console.firebase.google.com**
2. Click your project: **cipherai-62911**
3. Go to **Firestore Database** (left menu)
4. You should see **browser_scans** collection
5. Click it to expand
6. You should see **documents** appearing (each document = one scan)

Each document should contain:
```json
{
  "aiExplanation": "This site appears to be legitimate...",
  "hostname": "google.com",
  "manipulationScore": 5,
  "phishingRisk": 10,
  "riskFactors": ["low_domain_age"],
  "scannedAt": "May 10, 2026 2:35:22 PM",
  "threatLevel": "SAFE",
  "trustScore": 95,
  "url": "https://google.com"
}
```

---

## 🧪 Step 5: Check Dashboard Updates

1. **Open Browser Shield Dashboard:** http://localhost:5173/browser-shield
2. **Open Console** (F12 → Console tab)
3. You should see:

```
[Firestore listener] Scans updated: [...]
```

4. **Look at Dashboard UI:**
   - **Extension Popup Mock:** Should show latest scan
   - **Real-Time Threat Feed:** Should list recent threats
   - **Stats:** Should show:
     - Total Scans: 1+ 
     - Average Trust Score: your score
     - Safe Sites: 1

5. **Test Live Updates:**
   - Keep dashboard open
   - Go back to extension
   - Click extension icon again
   - Scan another website
   - **Dashboard should update automatically** in <1 second (no refresh needed!)

---

## ✅ Success Checklist

- [ ] Extension icon shows no errors
- [ ] Right-click → Inspect popup → Console shows ✅ messages
- [ ] "Scan Current Site" button works
- [ ] Extension shows trust score after scanning
- [ ] Console shows "✅ Scan saved to Firestore"
- [ ] Firebase Console shows documents in browser_scans
- [ ] Dashboard shows data WITHOUT refreshing page
- [ ] Scanning new website updates dashboard automatically

---

## 🔴 Troubleshooting

### Problem: "Permission denied" in console

**Fix:** Update Firestore security rules

1. Go to **Firebase Console → Firestore Database → Rules**
2. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /browser_scans/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

### Problem: "Firestore SDK not loaded from CDN"

**Check:** Open `extensions/popup.html`
Verify it has this line:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore-compat.js"></script>
```

### Problem: Dashboard shows "Waiting for scan..."

**Possible causes:**
1. Extension scans haven't been saved to Firestore
2. Dashboard listener hasn't connected
3. Firestore security rules block reads

**Fix:** 
- Check browser console for errors
- Run a scan with extension
- Verify data appears in Firebase Console

### Problem: Dashboard works but doesn't update automatically

**Cause:** Listener not connected

**Fix:**
1. Check `src/firebase.ts` has valid config
2. Reload dashboard page
3. Run new scan with extension
4. Check browser console for listener logs

---

## 🚀 What's Happening Behind the Scenes

When you scan a website:

```
1. Extension analyzes URL (12 security checks)
   ↓
2. Extension displays results in popup UI
   ↓
3. Extension saves to Firestore:
   db.collection("browser_scans").add({
     url, trustScore, threatLevel, 
     phishingRisk, manipulationScore, ...
   })
   ↓
4. Firestore stores document
   ↓
5. Dashboard listener (onSnapshot) 
   detects new document
   ↓
6. Dashboard updates UI automatically
   (no refresh needed!)
   ↓
7. You see: Real-time threat feed updates,
   stats change, extension popup shows new scan
```

**Total time: <100ms**

---

## 📊 Real-Time Flow (What Should Happen)

### Extension Console
```
✅ Firebase initialized successfully
✅ Firestore connected and ready
User clicks "Scan Current Site"
📤 Sending scan to Firestore... https://github.com
✅ Scan saved to Firestore with ID: K7mN9pQ2R4sT6uVwX
✓ Scan saved to dashboard
```

### Dashboard Console
```
[Firestore listener] Scans updated: (1) […]
```

### Dashboard UI Updates
- Extension Popup: Shows new scan
- Threat Feed: New threat appears with animation
- Stats: Totals increment
- All in <1 second without page refresh

---

## 💡 Tips

- **Test with different websites** to see various threat levels
- **Keep both extension popup and dashboard open** to see live updates
- **Check browser console** for detailed debugging info
- **Refresh dashboard if needed** to restart listeners

