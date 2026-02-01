#!/bin/bash

# Docker Helper Script
# Uso: ./docker-help.sh [comando]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Commands
start_dev() {
    print_header "Starting Development Environment"
    docker-compose up -d
    print_success "Development environment started"
    echo "Access URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:3001"
    echo "  pgAdmin:  http://localhost:5050"
    echo "  Redis:    localhost:6379"
}

stop_dev() {
    print_header "Stopping Development Environment"
    docker-compose stop
    print_success "Development environment stopped"
}

restart_dev() {
    print_header "Restarting Development Environment"
    docker-compose restart
    print_success "Development environment restarted"
}

logs_follow() {
    SERVICE=${1:-}
    if [ -z "$SERVICE" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$SERVICE"
    fi
}

build_images() {
    print_header "Building Docker Images"
    docker-compose build --no-cache
    print_success "Images built successfully"
}

remove_volumes() {
    print_header "Removing All Volumes and Containers"
    print_error "This will DELETE all data!"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY == "yes" ]]; then
        docker-compose down -v
        print_success "All containers and volumes removed"
    else
        print_info "Operation cancelled"
    fi
}

clean_docker() {
    print_header "Cleaning Docker System"
    echo "Removing unused containers..."
    docker container prune -f
    echo "Removing unused images..."
    docker image prune -f
    echo "Removing unused volumes..."
    docker volume prune -f
    print_success "Docker system cleaned"
}

migrate_db() {
    print_header "Running Database Migrations"
    docker-compose exec backend npm run migrate
    print_success "Migrations completed"
}

seed_db() {
    print_header "Seeding Database"
    docker-compose exec backend npm run seed
    print_success "Database seeded"
}

bash_backend() {
    print_header "Opening Bash in Backend Container"
    docker-compose exec backend bash
}

bash_frontend() {
    print_header "Opening Bash in Frontend Container"
    docker-compose exec frontend bash
}

bash_postgres() {
    print_header "Opening PostgreSQL Client"
    docker-compose exec postgres psql -U postgres
}

status() {
    print_header "Container Status"
    docker-compose ps
}

health_check() {
    print_header "Health Check"
    
    echo -n "Frontend: "
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Healthy"
    else
        print_error "Unhealthy"
    fi
    
    echo -n "Backend:  "
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "Healthy"
    else
        print_error "Unhealthy"
    fi
    
    echo -n "Redis:    "
    if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
        print_success "Healthy"
    else
        print_error "Unhealthy"
    fi
}

show_help() {
    cat << EOF
${BLUE}Docker Helper Script${NC}

Usage: ./docker-help.sh [COMMAND]

Commands:
    start               Start development environment
    stop                Stop development environment
    restart             Restart development environment
    logs [service]      Follow logs (optional: specify service)
    build               Build Docker images
    clean               Clean up Docker system
    status              Show container status
    health              Check service health
    
    migrate             Run database migrations
    seed                Seed database with test data
    
    bash-backend        Open bash in backend container
    bash-frontend       Open bash in frontend container
    bash-postgres       Open PostgreSQL client
    
    remove-volumes      Remove all containers and volumes (DESTRUCTIVE!)
    help                Show this help message

Examples:
    ./docker-help.sh start
    ./docker-help.sh logs backend
    ./docker-help.sh bash-backend
    ./docker-help.sh migrate

${YELLOW}Development Workflow:${NC}
    1. ./docker-help.sh start      # Start environment
    2. ./docker-help.sh logs       # Check logs
    3. ./docker-help.sh migrate    # Run migrations
    4. Access http://localhost:3000

${YELLOW}Cleanup:${NC}
    ./docker-help.sh stop          # Stop services
    ./docker-help.sh clean         # Clean Docker system

EOF
}

# Main
case "${1:-help}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    logs)
        logs_follow "$2"
        ;;
    build)
        build_images
        ;;
    clean)
        clean_docker
        ;;
    remove-volumes)
        remove_volumes
        ;;
    migrate)
        migrate_db
        ;;
    seed)
        seed_db
        ;;
    bash-backend)
        bash_backend
        ;;
    bash-frontend)
        bash_frontend
        ;;
    bash-postgres)
        bash_postgres
        ;;
    status)
        status
        ;;
    health)
        health_check
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
