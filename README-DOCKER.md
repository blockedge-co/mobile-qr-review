# Docker Setup for Carbon Credit Landing

## Quick Start

### Option 1: Simple Scripts (Recommended)

```bash
# Start the app
./run-docker.sh

# Stop the app  
./stop-docker.sh
```

### Option 2: Manual Docker Commands

```bash
# Build the image
docker build -t carbon-credit-landing .

# Run the container
docker run -d \
  --name carbon-credit-landing \
  -p 3001:3000 \
  carbon-credit-landing

# Stop and remove
docker stop carbon-credit-landing
docker rm carbon-credit-landing
```

### Option 3: Docker Compose

```bash
# Start
docker-compose up -d

# Stop
docker-compose down
```

## Access the Application

- **Application**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Notes

- Uses **port 3001** to avoid conflicts with other services
- Uses **pnpm** package manager (not npm)
- Includes health check endpoint
- Simple single-stage build for reliability

## Troubleshooting

If you get build errors:

1. **Stop other Docker services first**:
   ```bash
   ./stop-docker.sh
   ```

2. **Clean Docker cache**:
   ```bash
   docker system prune -f
   ```

3. **Rebuild**:
   ```bash
   ./run-docker.sh
   ```

## Files

- `Dockerfile` - Simple container definition
- `docker-compose.yml` - Orchestration config
- `run-docker.sh` - Start script
- `stop-docker.sh` - Stop script
- `.dockerignore` - Build context exclusions