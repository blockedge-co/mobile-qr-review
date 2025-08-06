#!/bin/bash

# Simple script to stop Carbon Credit Landing Docker container

echo "🛑 Stopping Carbon Credit Landing container..."
docker stop carbon-credit-landing 2>/dev/null || echo "Container not running"

echo "🗑️ Removing Carbon Credit Landing container..."
docker rm carbon-credit-landing 2>/dev/null || echo "Container not found"

echo "✅ Carbon Credit Landing Docker container stopped and removed"