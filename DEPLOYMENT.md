# 🚀 Deployment Guide

## Free Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros:**
- Free tier with generous limits
- Automatic deployments from GitHub
- Perfect for full-stack apps
- Great performance

**Steps:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Vercel will automatically detect it's a Node.js app
7. Deploy!

**Configuration:**
- Frontend: Automatically served from `/client`
- Backend: Automatically served from root
- Environment: Production build created automatically

### Option 2: Netlify + Render

**Netlify (Frontend):**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Create new site from Git
4. Select your repository
5. Build command: `cd client && npm install && npm run build`
6. Publish directory: `client/build`

**Render (Backend):**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service
4. Connect your repository
5. Build command: `npm install`
6. Start command: `npm start`
7. Update frontend API URL to your Render URL

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Deploy from GitHub repo
5. Railway handles everything automatically

## Data Persistence

### Current Setup: JSON File Storage
- Data is saved to `data.json` file
- Works for small to medium groups
- Data persists between server restarts
- No database needed

### For Larger Scale: Database Options

**Free Database Options:**
- **MongoDB Atlas**: Free tier with 512MB
- **Supabase**: Free tier with PostgreSQL
- **PlanetScale**: Free tier with MySQL

**To upgrade to database:**
1. Replace JSON file storage with database queries
2. Update API endpoints to use database
3. Add environment variables for database connection

## Environment Variables

Create a `.env` file for production:

```env
NODE_ENV=production
PORT=5001
```

## Production Build

Before deploying:

```bash
# Build the React app
cd client
npm run build
cd ..

# Start production server
npm start
```

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Production build created
- [ ] Data persistence configured
- [ ] API endpoints working
- [ ] Frontend connecting to backend

## Troubleshooting

**Common Issues:**
1. **CORS errors**: Make sure frontend and backend URLs match
2. **Port conflicts**: Use environment variables for ports
3. **Build failures**: Check all dependencies are in package.json
4. **Data not saving**: Verify file permissions on server

**Debug Commands:**
```bash
# Check if server is running
curl http://localhost:5001/api/groups

# Check build files
ls -la client/build/

# Check data file
cat data.json
```
