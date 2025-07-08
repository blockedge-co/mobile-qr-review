#!/bin/bash

# Simple script to run Carbon Credit Landing in Docker

echo "🐳 Building Carbon Credit Landing Docker image..."
docker build -t carbon-credit-landing .

echo "🚀 Running Carbon Credit Landing on port 3001..."
docker run -d \
  --name carbon-credit-landing \
  -p 3001:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3001 \
  carbon-credit-landing

echo "✅ Carbon Credit Landing is running at http://localhost:3001"
echo "📊 Check health at http://localhost:3001/api/health"

# Show container status
docker ps | grep carbon-credit-landing