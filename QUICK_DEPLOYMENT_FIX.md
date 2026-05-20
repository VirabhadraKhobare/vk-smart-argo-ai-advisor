# Quick Fix: Make Deployed Project Work

Your deployed project is failing to connect because of missing/incorrect environment variables. Follow these exact steps:

## STEP 1: Get Your URLs

1. **Vercel URL** (where client is deployed)
   - Go to https://vercel.com/dashboard
   - Find your project
   - Copy the URL (should look like: `https://vk-smart-argo-ai-advisor.vercel.app`)

2. **Render URL** (where server is deployed)  
   - Go to https://dashboard.render.com
   - Find your Web Service
   - Copy the URL (should look like: `https://vk-smart-argo-ai-advisor.onrender.com`)

## STEP 2: Set Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add this variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://<your-render-url>/api` (include `/api` at the end!)
   - **Environments**: Select all (Production, Preview, Development)
3. Click "Save"
4. Go to **Deployments** → Click "Redeploy" on the latest deployment

**Wait 2-3 minutes for deployment to complete.**

## STEP 3: Set Render Environment Variables

1. Go to **Render Dashboard** → Your Web Service → **Environment**
2. Add/Update these variables:
   - `CLIENT_URL` = `https://<your-vercel-url>` (NO `/api` here!)
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Click "Save"
4. Render will auto-redeploy

**Wait 2-3 minutes for deployment to complete.**

## STEP 4: Test the Connection

1. Open your Vercel app: `https://<your-vercel-url>/login`
2. Try to login with test credentials
3. Open DevTools (**F12**) → **Network** tab
4. Try login again
5. Look for the **`login`** request:
   - **✅ GOOD**: Request URL shows `https://<your-render-url>/api/auth/login` and Status is 200 or 401
   - **❌ BAD**: Status shows "CORS error" or 404

## If Still Getting CORS Error:

1. Check Render Logs (Render Dashboard → Logs):
   - Should show: `🔐 CORS whitelist: ["https://<your-vercel-url>"]`
   - Should show: `✅ MongoDB Connected`

2. Verify URLs match exactly:
   - Vercel env: `REACT_APP_API_URL=https://<render>/api`
   - Render env: `CLIENT_URL=https://<vercel>` (no `/api`, no trailing slash)

3. If URLs are wrong, update them and redeploy

---

## Required Environment Variables Summary

**On Vercel** (Client):
```
REACT_APP_API_URL=https://your-render-service.onrender.com/api
```

**On Render** (Server):
```
CLIENT_URL=https://your-vercel-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=<generate-with-node-command>
OPENAI_API_KEY=<optional>
WEATHER_API_KEY=<optional>
```

---

## Need Your MongoDB Atlas Connection String?

1. Go to https://www.mongodb.com/cloud/atlas
2. Log in → Click your Cluster
3. Click **"Connect"**
4. Choose **"Connect your application"**
5. Select **"Node.js"** (v4.0 or later)
6. Copy the connection string
7. Replace `<password>` with your DB password
8. Paste into Render `MONGODB_URI` env var

**That's it!** Once both services are redeployed, your app should work.

Share your exact Vercel and Render URLs if you need help debugging further.
