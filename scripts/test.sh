#!/bin/bash

# Test runner script
echo "Running Prompter tests..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run tests
echo "Running Vitest..."
npm run test 