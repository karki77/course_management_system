#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script header
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}        Course Management System Setup        ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Function to display status messages
display_status() {
  local message=$1
  local status=$2
  
  echo -e "${YELLOW}➤ ${message}${NC}"
}

# Function to display error messages
display_error() {
  local message=$1
  
  echo -e "${RED}✖ ERROR: ${message}${NC}"
}

# Function to display success messages
display_success() {
  local message=$1
  
  echo -e "${GREEN}✓ ${message}${NC}"
}

# Function to check for prerequisites
check_prerequisites() {
  display_status "Checking prerequisites..."

  # Check if Docker is installed
  if ! command -v docker &> /dev/null; then
    display_error "Docker is not installed. Please install Docker first."
    exit 1
  fi

  # Check if Docker Compose is installed
  if ! command -v docker-compose &> /dev/null; then
    display_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
  fi

  display_success "Prerequisites satisfied"
}

# Function to create environment files
setup_environment() {
  display_status "Setting up environment files..."

  # Ask which environment to use
  echo -e "${BLUE}Select environment to deploy:${NC}"
  echo "1) Development"
  echo "2) Production"
  read -p "Enter your choice (1-2): " env_choice

  if [ "$env_choice" = "1" ]; then
    ENV_FILE=".env.development"
    COMPOSE_FILE="docker-compose.dev.yml"
    ENV_NAME="development"
  else
    ENV_FILE=".env.production"
    COMPOSE_FILE="docker-compose.yml"
    ENV_NAME="production"
  fi

  # Create environment file for Docker if it doesn't exist
  if [ ! -f $ENV_FILE ]; then
    if [ -f .env.example ]; then
      cp -f .env.example $ENV_FILE
      display_success "Created $ENV_FILE file from example template"
      echo -e "${YELLOW}⚠️  Please review and update the values in $ENV_FILE as needed${NC}"
      sleep 2
    else
      display_error ".env.example file not found. Please create $ENV_FILE manually."
      exit 1
    fi
  else
    display_success "Using existing $ENV_FILE file"
  fi

  # Export environment variables for docker-compose
  export COMPOSE_FILE
  display_success "Environment setup complete for $ENV_NAME"
}

# Function to start containers
start_containers() {
  display_status "Preparing Docker environment..."
  
  # Clean up any previous containers
  docker-compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null
  
  # Build and start containers
  display_status "Building and starting Docker containers..."
  
  if docker-compose -f $COMPOSE_FILE build --no-cache && \
     docker-compose -f $COMPOSE_FILE up -d; then
    display_success "Containers are up and running!"
  else
    display_error "Failed to start Docker containers"
    echo -e "${YELLOW}Check the logs with: docker-compose -f $COMPOSE_FILE logs${NC}"
    exit 1
  fi
}

# Function to run database migrations
run_migrations() {
  display_status "Waiting for database to be ready..."
  
  # Wait for database to be ready (more sophisticated wait strategy)
  attempt=1
  max_attempts=30
  
  while [ $attempt -le $max_attempts ]; do
    if docker-compose -f $COMPOSE_FILE exec db pg_isready -U postgres >/dev/null 2>&1; then
      break
    fi
    
    echo -n "."
    sleep 2
    attempt=$((attempt + 1))
  done
  
  if [ $attempt -gt $max_attempts ]; then
    display_error "Database did not become ready in time"
    exit 1
  fi
  
  echo ""
  # Give the app container a moment to fully start
  sleep 5
  
  display_status "Running database migrations..."
  
  if docker-compose -f $COMPOSE_FILE exec app npx prisma migrate deploy; then
    display_success "Database migrations completed successfully!"
  else
    display_error "Failed to run database migrations"
    echo -e "${YELLOW}You can try running migrations manually with:${NC}"
    echo -e "docker-compose -f $COMPOSE_FILE exec app npx prisma migrate deploy"
    exit 1
  fi
}
# Function to display final information
display_completion() {
  local port=$(grep -o '"[0-9]\+:[0-9]\+"' $COMPOSE_FILE | head -1 | cut -d':' -f1 | tr -d '"')
  if [ -z "$port" ]; then
    port="9000" # Default port
  fi
  
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✓ Course Management System is now running!${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}Access the API at:${NC} http://localhost:$port"
  echo -e "${YELLOW}Environment:${NC} $ENV_NAME"
  echo ""
  echo -e "${YELLOW}Useful commands:${NC}"
  echo -e "  ${BLUE}•${NC} View logs: docker-compose -f $COMPOSE_FILE logs -f"
  echo -e "  ${BLUE}•${NC} Stop system: docker-compose -f $COMPOSE_FILE down"
  echo -e "  ${BLUE}•${NC} Restart system: docker-compose -f $COMPOSE_FILE restart"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Main execution flow
check_prerequisites
setup_environment
start_containers
run_migrations
display_completion