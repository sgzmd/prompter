#!/bin/bash

# Linter script
echo "Running Prompter linter..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run linter
echo "Running ESLint..."
npm run lint 