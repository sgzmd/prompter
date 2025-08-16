# Deploying Prompter to Cloudflare Pages

This guide explains how to deploy your Vue.js SPA to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Your application built and ready for deployment

## Method 1: Manual Upload (Quick Deploy)

### Step 1: Build Your Application
```bash
npm run build
```

This creates a `dist/` folder with your production-ready files.

### Step 2: Upload to Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** in the sidebar

2. **Create a New Project**
   - Click **Create a project**
   - Choose **Upload assets**
   - Give your project a name (e.g., "prompter")

3. **Upload Your Files**
   - Drag and drop the entire `dist/` folder contents
   - Or click **Browse** and select all files from the `dist/` folder

4. **Deploy**
   - Click **Deploy site**
   - Your site will be available at `https://your-project-name.pages.dev`

## Method 2: Git Integration (Recommended for Updates)

### Step 1: Push to GitHub/GitLab

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create Repository**:
   - Create a new repository on GitHub or GitLab
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/prompter.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Cloudflare Pages

1. **In Cloudflare Dashboard**:
   - Go to **Pages** → **Create a project**
   - Choose **Connect to Git**
   - Select your repository

2. **Configure Build Settings**:
   - **Framework preset**: None (or Vite if available)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)

3. **Environment Variables** (if needed):
   - Add any environment variables your app needs

4. **Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy your site

## Method 3: Using Wrangler CLI

### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```

### Step 3: Deploy
```bash
# Build first
npm run build

# Deploy to Pages
wrangler pages deploy dist --project-name=prompter
```

## Configuration Files

### _redirects (for SPA Routing)
Create a `public/_redirects` file for proper SPA routing:

```
/*    /index.html   200
```

### _headers (Optional)
Create a `public/_headers` file for security headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## Custom Domain

1. **In Cloudflare Pages**:
   - Go to your project settings
   - Click **Custom domains**
   - Add your domain

2. **DNS Configuration**:
   - Add a CNAME record pointing to your Pages URL
   - Or use Cloudflare's automatic DNS management

## Environment Variables

If your app needs environment variables:

1. **In Cloudflare Pages**:
   - Go to project settings
   - Click **Environment variables**
   - Add your variables

2. **In your code**:
   ```javascript
   // Access with import.meta.env
   const apiUrl = import.meta.env.VITE_API_URL
   ```

## Automatic Deployments

With Git integration, Cloudflare will automatically:
- Deploy when you push to `main` branch
- Create preview deployments for pull requests
- Roll back to previous versions if needed

## Troubleshooting

### Build Failures
- Check build logs in Cloudflare dashboard
- Ensure all dependencies are in `package.json`
- Verify build command and output directory

### 404 Errors (SPA Routing)
- Ensure you have the `_redirects` file
- Check that `index.html` is in the root of your build output

### Performance Issues
- Enable Cloudflare's automatic optimizations
- Use the `_headers` file for caching rules
- Consider using Cloudflare's CDN features

## Monitoring

- **Analytics**: Available in Cloudflare dashboard
- **Performance**: Built-in performance monitoring
- **Errors**: Error tracking and logging available

## Cost

- **Free Tier**: 500 builds/month, 100 requests/second
- **Paid Plans**: Start at $20/month for more builds and features

Your Prompter application should now be live on Cloudflare Pages! 🚀 