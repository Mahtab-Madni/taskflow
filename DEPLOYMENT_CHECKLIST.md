# Quick Reference for Deployment

## 1. Frontend Deployment (Vercel)

- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**:
  - Key: `VITE_API_URL`
  - Value: (will update after backend deployment)

## 2. Backend Deployment (Vercel)

- **Root Directory**: `server`
- **Build Command**: Skip (it's Node.js)
- **Output Directory**: N/A
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB Atlas connection string
  - `JWT_SECRET`: A strong secret key
  - `CLIENT_URL`: Your frontend Vercel URL (after frontend deployment)

## 3. Environment Setup Files Already Created

✅ `client/.env.example` - Frontend environment template
✅ `client/.env.production` - Production frontend config (update API URL)
✅ `server/.env.example` - Backend environment template
✅ `server/vercel.json` - Backend Vercel configuration
✅ `vercel.json` - Root monorepo configuration
✅ `.vercelignore` - Files to exclude from deployment

## 4. Deployment Steps

1. Create GitHub repository and push code
2. Connect Vercel to GitHub
3. Deploy backend first (get the URL)
4. Update frontend `.env.production` with backend URL
5. Deploy frontend

## 5. MongoDB Atlas Setup

- Sign up at https://www.mongodb.com/cloud/atlas
- Create free tier cluster
- Get connection string
- Add to backend environment variables
- Whitelist Vercel IPs (allow 0.0.0.0/0 for dev)

## 6. Testing After Deployment

- Frontend should load without CORS errors
- Backend health check: `{backendUrl}/api/health`
- Try creating a task to verify database connection
- Check browser console and network tab for errors

See DEPLOYMENT.md for detailed instructions.
