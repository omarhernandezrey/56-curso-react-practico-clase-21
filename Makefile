.PHONY: help start stop restart logs build clean migrate seed status health bash-backend bash-postgres

# Color output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)Docker Development Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Setup & Running:$(NC)"
	@echo "  make start              Start development environment"
	@echo "  make stop               Stop development environment"
	@echo "  make restart            Restart all services"
	@echo "  make build              Build all Docker images"
	@echo ""
	@echo "$(GREEN)Monitoring:$(NC)"
	@echo "  make logs               Follow all logs"
	@echo "  make logs-backend       Follow backend logs"
	@echo "  make logs-frontend      Follow frontend logs"
	@echo "  make status             Show container status"
	@echo "  make health             Check service health"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  make migrate            Run database migrations"
	@echo "  make seed               Seed database with test data"
	@echo "  make bash-postgres      Open PostgreSQL client"
	@echo ""
	@echo "$(GREEN)Shell Access:$(NC)"
	@echo "  make bash-backend       Open bash in backend container"
	@echo "  make bash-frontend      Open bash in frontend container"
	@echo ""
	@echo "$(GREEN)Cleanup:$(NC)"
	@echo "  make clean              Clean Docker system"
	@echo "  make remove-volumes     Remove all volumes (DESTRUCTIVE!)"
	@echo ""

start:
	@echo "$(BLUE)Starting development environment...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Environment started$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"
	@echo "pgAdmin:  http://localhost:5050"

stop:
	@echo "$(BLUE)Stopping development environment...$(NC)"
	docker-compose stop
	@echo "$(GREEN)✓ Environment stopped$(NC)"

restart:
	@echo "$(BLUE)Restarting development environment...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Environment restarted$(NC)"

build:
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)✓ Images built successfully$(NC)"

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

status:
	@echo "$(BLUE)Container Status:$(NC)"
	docker-compose ps

health:
	@echo "$(BLUE)Health Check:$(NC)"
	@echo -n "Frontend: "
	@curl -s http://localhost:3000 > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Backend:  "
	@curl -s http://localhost:3001/health > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"

migrate:
	@echo "$(BLUE)Running database migrations...$(NC)"
	docker-compose exec backend npm run migrate
	@echo "$(GREEN)✓ Migrations completed$(NC)"

seed:
	@echo "$(BLUE)Seeding database...$(NC)"
	docker-compose exec backend npm run seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

bash-backend:
	docker-compose exec backend bash

bash-frontend:
	docker-compose exec frontend bash

bash-postgres:
	docker-compose exec postgres psql -U postgres

clean:
	@echo "$(BLUE)Cleaning Docker system...$(NC)"
	docker container prune -f
	docker image prune -f
	docker volume prune -f
	@echo "$(GREEN)✓ Docker system cleaned$(NC)"

remove-volumes:
	@echo "$(RED)WARNING: This will DELETE all data!$(NC)"
	@read -p "Type 'yes' to confirm: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker-compose down -v; \
		echo "$(GREEN)✓ Volumes removed$(NC)"; \
	else \
		echo "$(BLUE)Cancelled$(NC)"; \
	fi

# Development workflow
dev: start migrate
	@echo "$(GREEN)✓ Development environment ready!$(NC)"

# Production setup
prod-build:
	@echo "$(BLUE)Building production images...$(NC)"
	docker-compose -f docker-compose.prod.yml build --no-cache
	@echo "$(GREEN)✓ Production images built$(NC)"

prod-start:
	@echo "$(BLUE)Starting production environment...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Production environment started$(NC)"

prod-stop:
	docker-compose -f docker-compose.prod.yml stop

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f
