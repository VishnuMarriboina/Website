#!/usr/bin/env bash
set -e

echo "Installing shared module dependencies..."
cd shared && npm install && cd ..

echo "Installing grpc-web-proxy dependencies..."
cd grpc-web-proxy && npm install && cd ..

echo "Installing service-a dependencies..."
cd services/service-a && npm install && cd ../..

echo "Installing service-b dependencies..."
cd services/service-b && npm install && cd ../..

echo ""
echo "All dependencies installed successfully."
