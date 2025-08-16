#!/bin/bash

# Development server script
echo "Starting Prompter development server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting Vite dev server..."
npm run dev 