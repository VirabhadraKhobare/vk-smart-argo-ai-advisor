# ❌ LOGIN FAILED - TROUBLESHOOTING GUIDE

## 🔴 ISSUE IDENTIFIED

**Error:** `Network error - please check your connection`

**Root Cause:** Backend server is NOT running on port 5000

---

## ✅ SOLUTION

### Step 1: Start the Backend Server

**Option A: Using Batch File (EASIEST)**
Double-click: `START_BACKEND.bat`

**Option B: Manual Command**
```bash
cd c:\Users\virbh\Downloads\smart-agro-ai-advisor\smart-agro-ai-advisor\server
npm run dev
```

**Step 2: Wait for Backend to Start**
You should see:
```
[nodemon] 3.0.2
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): .
[nodemon] watching extensions: js,json
[nodemon] exec "node server.js"
✅ Server running on port 5000
✅ Database connected
```

**Step 3: Try Login Again**
- Go back to http://localhost:3000/login
- Enter credentials
- Click Sign In
- Should succeed now! ✅

---

## 📊 CURRENT SETUP STATUS

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| Frontend (React) | ✅ Running | 3000 | http://localhost:3000 |
| Backend (Node.js) | ❌ NOT Running | 5000 | http://localhost:5000 |
| Database (MongoDB) | ? | 27017 | mongodb://localhost:27017 |

---

## 🔧 HOW TO RUN BOTH SERVERS

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Wait for: `✅ Server running on port 5000`

### Terminal 2 - Frontend
```bash
cd client
npm start
```
Wait for: App opens at http://localhost:3000

### Terminal 3 - (Optional) MongoDB
If not running as service:
```bash
mongod
```

---

## 🧪 TEST THE CONNECTION

### Quick Test:
1. Open browser: http://localhost:5000/api/auth
2. Should show: `{"message":"Auth API route"}` or similar
3. If connection refused → Backend not running
4. If JSON appears → Backend is running ✅

### Check Backend Status:
```bash
netstat -ano | findstr :5000
```
- If shows a PID: Backend is running
- If nothing: Backend is NOT running

---

## 📋 TROUBLESHOOTING CHECKLIST

- [ ] Backend server started (see "✅ Server running on port 5000")
- [ ] Port 5000 is not blocked by firewall
- [ ] MongoDB is running/accessible
- [ ] No port conflicts (other apps using 5000)
- [ ] Client .env has correct API URL
- [ ] Frontend can reach backend on http://192.168.181.143:5000/api
- [ ] Try login again with test credentials

---

## 🔑 TEST CREDENTIALS

**Email:** basweshward123@gmail.com  
**Password:** (whatever you registered with, or check database)

Or create a new account via Register page.

---

## ⚠️ COMMON ISSUES & FIXES

### Issue 1: "Address already in use"
**Solution:** Port 5000 is taken
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 2: "Cannot find module"
**Solution:** Missing dependencies
```bash
cd server
npm install
```

### Issue 3: "MongoDB connection failed"
**Solution:** MongoDB not running
- Start MongoDB service
- Or check .env DB connection URL

### Issue 4: CORS errors
**Solution:** Already configured in server.js
- Make sure backend is running
- Frontend should access http://localhost:5000

---

## 📝 BOTH SERVERS MUST RUN

✅ **Frontend working alone** doesn't help  
✅ **Backend working alone** doesn't help  
✅ **BOTH working together** = Login works ✅

---

## 🚀 QUICK START COMMAND

Open two Command Prompts side by side:

**Tab 1:**
```bash
cd c:\Users\virbh\Downloads\smart-agro-ai-advisor\smart-agro-ai-advisor\server
npm run dev
```

**Tab 2:**
```bash
cd c:\Users\virbh\Downloads\smart-agro-ai-advisor\smart-agro-ai-advisor\client
npm start
```

Then go to: http://localhost:3000/login

---

## ✅ WHAT SHOULD HAPPEN AFTER FIX

1. **Backend Tab:**
   ```
   ✅ Server running on port 5000
   ✅ Database connected
   ```

2. **Frontend Tab:**
   ```
   webpack compiled successfully
   ```

3. **Browser:**
   - Login page loads
   - Can enter email/password
   - Click Sign In
   - Login succeeds, redirected to dashboard

---

## 🎯 IMMEDIATE NEXT STEPS

1. **Right now:**
   - Double-click `START_BACKEND.bat`
   - Wait 5 seconds for it to start

2. **Go to browser:**
   - Refresh http://localhost:3000/login
   - Try login again

3. **If still fails:**
   - Check backend console for errors
   - Check MongoDB is running
   - Check .env URLs are correct

---

## 📞 IF STILL STUCK

Check:
1. Backend console - any error messages?
2. Browser console - any specific error?
3. MongoDB - is it running?
4. Firewall - is port 5000 blocked?
5. .env file - correct API URL?

---

**Status:** FIXABLE IN 2 MINUTES ✅

Just start the backend server and try again!

---

Generated: 2026-05-19
