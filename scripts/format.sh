#!/bin/bash

# Code formatter script
echo "Running Prompter code formatter..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run formatter
echo "Running Prettier..."
npm run format 