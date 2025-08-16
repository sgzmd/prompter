#!/bin/bash

# Cloudflare Pages Deployment Script
echo "🚀 Deploying Prompter to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=prompter

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌍 Your app should be available at: https://prompter.pages.dev"
else
    echo "❌ Deployment failed!"
    exit 1
fi 