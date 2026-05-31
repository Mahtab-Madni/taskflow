# Deployment Guide - Vercel

This guide helps you deploy both the React frontend and Express backend to Vercel.

## Option 1: Deploy Separately (Recommended for Production)

### Deploy Frontend to Vercel

1. **Push code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Deploy Frontend**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Select the `client` folder as root directory
   - Add environment variables:
     - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.vercel.app/api`)
   - Click "Deploy"

4. **Update `.env.production`**
   - After backend deployment, update the frontend `.env.production` with actual backend URL

---

### Deploy Backend to Vercel

1. **From Project Root**
   - Go to Vercel Dashboard
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Select the `server` folder as root directory

2. **Set Environment Variables** in Vercel Dashboard:
   - `MONGODB_URI`: Your MongoDB connection string (from MongoDB Atlas)
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)

3. **Deploy**
   - Click "Deploy"
   - Vercel will use `server/vercel.json` configuration

---

## Option 2: Deploy as Monorepo (Single Vercel Project)

1. **Push to GitHub** (as described above)

2. **Set Root Directory**
   - In Vercel Project Settings, set "Root Directory" to `.` (project root)

3. **Build Command**
   - `cd client && npm run build`

4. **Output Directory**
   - `client/dist`

5. **Environment Variables**
   - Set variables for both frontend and backend as shown above

---

## Environment Variables Setup

### For Frontend (.env.production)

```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### For Backend (Vercel Dashboard)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-key-here
CLIENT_URL=https://your-frontend-url.vercel.app
```

---

## Prerequisites

### MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string (MONGODB_URI)
5. Whitelist Vercel IPs (set to allow all: 0.0.0.0/0)

### GitHub Repository

- Push code with proper folder structure
- Ensure `.gitignore` excludes `.env` files

---

## Verification

After deployment:

1. **Test Frontend**
   - Open deployed frontend URL
   - Check browser console for any errors
   - Try logging in/registering

2. **Test Backend Health**
   - Visit `https://your-backend.vercel.app/api/health`
   - Should return: `{"status": "Server is running", ...}`

3. **Test Database Connection**
   - Try creating a task
   - Should save to MongoDB Atlas

4. **Test API Calls**
   - Open DevTools Network tab
   - Perform actions and verify API requests go to correct URL

---

## Troubleshooting

### "CORS Error"

- Update `CLIENT_URL` in backend environment variables
- Restart backend deployment

### "Cannot connect to MongoDB"

- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas IP whitelist includes Vercel IPs
- Use `0.0.0.0/0` for development

### "API Calls Return 404"

- Verify `VITE_API_URL` in frontend `.env.production`
- Check backend routes are prefixed with `/api`

### "Environment Variables Not Loading"

- Redeploy after adding variables
- Check variable names match code exactly

---

## Updating After Deployment

### Update Frontend

```bash
git add .
git commit -m "Update message"
git push origin main
# Vercel auto-deploys
```

### Update Backend

- Same process - push to GitHub, Vercel auto-deploys

---

## Security Checklist

✅ Change `JWT_SECRET` to a strong random value  
✅ Use HTTPS URLs only (Vercel provides this by default)  
✅ Keep sensitive keys in Vercel environment variables (not in code)  
✅ Set proper CORS origins  
✅ Enable database authentication  
✅ Restrict MongoDB access to necessary IPs

---

## Production Recommendations

1. **Add `.vercelignore`** to exclude unnecessary files
2. **Enable Deployment Protection** in Vercel settings
3. **Set up CI/CD** with GitHub Actions for testing
4. **Use analytics** to monitor performance
5. **Enable caching** for static assets
6. **Set up error tracking** with Sentry

---

For more help, visit:

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
