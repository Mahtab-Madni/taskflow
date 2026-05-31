#!/bin/bash
echo "Building client..."
cd ../client
npm install
npm run build
cd ../server
echo "Client build complete"
