# 🚀 LogiPlay - Deployment Guide

## Vercel Deployment

This project is configured for deployment on Vercel with the following specifications:

### Build Configuration
- **Framework**: Vite + React + TypeScript
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

### Environment Variables (if needed)
```
# Add any environment variables here
# VITE_API_URL=your_api_url
# VITE_CONTRACT_ADDRESS=your_contract_address
```

### Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite configuration

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a live URL

### Local Testing
```bash
npm run build
npm run preview
```

### Features Included
- ✅ Web3 Wallet Integration (MetaMask)
- ✅ Progressive Maze Game
- ✅ Token Reward System ($LOGIQ)
- ✅ User Level Progression
- ✅ Milestone Ranking System
- ✅ Responsive Design
- ✅ Modern UI with Tailwind CSS

### Performance Optimizations
- Bundle splitting
- Tree shaking
- Lazy loading
- Optimized assets

---
Built with ❤️ by Zarekvos
