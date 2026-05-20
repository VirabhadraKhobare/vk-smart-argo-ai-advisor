# Deployment Configuration Guide

This guide explains what environment variables and configuration are required for the Smart Agro AI Advisor to work properly when deployed across Vercel (client) and Render (server).

## Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Vercel Client   │ ──────> │  Render Server   │ ──────> │   MongoDB Atlas  │
│  (React App)     │  HTTPS  │  (Express API)   │  Mongoose │  (Database)      │
└──────────────────┘         └──────────────────┘         └──────────────────┘
  https://your-app.             https://your-api.           mongodb+srv://...
  vercel.app                    onrender.com
```

## 1. Vercel Client Configuration

### Environment Variables to Set

On Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `REACT_APP_API_URL` | **REQUIRED** - Render server URL with `/api` suffix | `https://vk-smart-argo-ai-advisor.onrender.com/api` |

**Important**: Include `/api` in the URL. The client calls `REACT_APP_API_URL + '/auth/login'` which becomes `/api/auth/login`.

### How it Works
- Client code reads `REACT_APP_API_URL` from `client/src/services/api.js`
- All API calls use this as the base URL
- During Vercel build, this is baked into the React bundle

### Deployment Steps
1. Go to Vercel → Project → Settings → Environment Variables
2. Add `REACT_APP_API_URL` = `https://<your-render-url>/api`
3. Redeploy or wait for the next automatic deployment
4. Verify in Network tab that login POST goes to the correct URL

---

## 2. Render Server Configuration

### Environment Variables to Set

On Render Dashboard → Your Service → Environment:

| Variable | Value | Example |
|----------|-------|---------|
| `CLIENT_URL` | **REQUIRED** - Vercel client URL (no `/api` suffix) | `https://vk-smart-argo-ai-advisor.vercel.app` |
| `MONGODB_URI` | **REQUIRED** - MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |
| `JWT_SECRET` | **REQUIRED** - Secret for JWT token signing | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `OPENAI_API_KEY` | Optional - For AI features | Your OpenAI API key |
| `WEATHER_API_KEY` | Optional - For weather data | Your weather API key |
| `NODE_ENV` | Optional - Set to `production` | `production` |
| `PORT` | Auto-set by Render (default 5000) | Leave empty or `5000` |

**Important**: `CLIENT_URL` must match **exactly** what users see in their browser address bar (https, no trailing slash).

### How it Works
- Server uses `CLIENT_URL` in CORS configuration (`server/server.js`)
- CORS middleware checks if incoming request Origin matches `CLIENT_URL`
- If match: request allowed with credentials
- If no match: browser shows "CORS error"

### Deployment Steps
1. Go to Render → Your Web Service → Environment
2. Add all required variables
3. Save and let Render auto-redeploy
4. Check Render logs: `✅ MongoDB Connected` and `CORS whitelist: [...]`

---

## 3. Common Issues & Fixes

### Issue: "CORS error" on login
**Cause**: `CLIENT_URL` on Render doesn't match Vercel URL

**Fix**: 
1. Verify your Vercel URL (check browser address bar)
2. Update Render `CLIENT_URL` env var to match exactly
3. Redeploy Render
4. Clear browser cache and retry login

### Issue: "404 Route /auth/login not found"
**Cause**: Client calling `/auth/login` instead of `/api/auth/login`

**Fix**:
1. Verify `REACT_APP_API_URL` includes `/api` suffix
2. Redeploy Vercel
3. Check Network tab → login request URL should be `https://<render>/api/auth/login`

### Issue: "MongoDB connection failed"
**Cause**: `MONGODB_URI` not set or invalid

**Fix**:
1. Copy connection string from MongoDB Atlas
2. Click "Connect" → "Connect your application"
3. Select Node.js driver
4. Copy the full connection string (include password)
5. Paste into Render `MONGODB_URI` env var
6. Redeploy Render

### Issue: Local works but deployed doesn't
**Cause**: Environment variables not deployed or incorrect

**Fix**:
1. Verify all env vars are set on both Render and Vercel
2. Check Render logs for connection status
3. Check Vercel build logs for any warnings
4. Use browser DevTools Network tab to see exact request URL and error response

---

## 4. Environment Variables Summary

### For Local Development (.env files)

**`server/.env`** (create this file locally, DO NOT commit):
```
MONGODB_URI=mongodb://127.0.0.1:27017/smart-agro-data
JWT_SECRET=dev-secret-key-12345
NODE_ENV=development
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
```

**`client/.env.local`** (create this file locally, DO NOT commit):
```
REACT_APP_API_URL=http://localhost:5000/api
```

### For Production Deployment

**Vercel**: Set via Dashboard
- `REACT_APP_API_URL` = `https://<render-service>.onrender.com/api`

**Render**: Set via Dashboard
- `CLIENT_URL` = `https://<vercel-app>.vercel.app`
- `MONGODB_URI` = (MongoDB Atlas connection string)
- `JWT_SECRET` = (generated secret)
- Other API keys as needed

---

## 5. Verification Checklist

- [ ] Vercel `REACT_APP_API_URL` includes `/api` and points to Render
- [ ] Render `CLIENT_URL` matches your Vercel app URL exactly (https, no trailing slash)
- [ ] Render `MONGODB_URI` is valid MongoDB Atlas connection string
- [ ] Render `JWT_SECRET` is set to a secure random value
- [ ] Both services are redeployed after setting env vars
- [ ] Browser DevTools Network tab shows POST to `https://<render>/api/auth/login`
- [ ] Server logs show "✅ MongoDB Connected"
- [ ] Server logs show "CORS whitelist: [https://<vercel-app>]"
- [ ] Login POST response is 200 or proper error (not CORS/404)

---

## 6. Debugging Commands

**Check server is running and healthy**:
```bash
curl https://<your-render-url>/health
```

**Check server logs on Render**:
- Render Dashboard → Your Service → Logs (check for MongoDB connection, CORS, errors)

**Check client API calls in browser**:
1. Open DevTools → Network tab
2. Try login
3. Click on `login` XHR request
4. Check:
   - Request URL (should include `/api/auth/login`)
   - Response Status (should be 200, 401, or other non-CORS error)
   - Response Headers → `access-control-allow-credentials: true`
   - Response Headers → `access-control-allow-origin: <vercel-url>`

---

## Need Help?

1. Share the exact Vercel URL and Render URL
2. Check Render logs for MongoDB connection status
3. Check browser Network tab for request URL and error response
4. Verify all env vars are set before redeploying
