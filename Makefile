.PHONY: help dev up down build restart logs ps check test lint backend-check backend-test backend-lint backend-analyze backend-tinker migrate seed fresh artisan composer-install frontend-check frontend-install frontend-dev frontend-build frontend-generate frontend-preview frontend-test frontend-test-watch frontend-lint frontend-format frontend-typecheck

COMPOSE ?= docker compose
APP_SERVICE ?= backend
FRONTEND_DIR ?= frontend

help:
	@echo "Доступные команды:"
	@echo "  make dev                 Запустить backend, frontend и БД в режиме разработки"
	@echo "  make down                Остановить контейнеры"
	@echo "  make build               Пересобрать образы"
	@echo "  make restart             Перезапустить окружение"
	@echo "  make logs                Показать логи контейнеров"
	@echo "  make ps                  Показать состояние контейнеров"
	@echo "  make check               Запустить все проверки backend и frontend"
	@echo "  make backend-check       Запустить все проверки backend"
	@echo "  make backend-test        Запустить backend-тесты"
	@echo "  make backend-lint        Проверить backend через Pint"
	@echo "  make backend-analyze     Проверить backend через PHPStan"
	@echo "  make backend-tinker      Открыть Laravel Tinker в backend"
	@echo "  make frontend-check      Запустить все проверки frontend"
	@echo "  make frontend-test       Запустить frontend-тесты"
	@echo "  make frontend-lint       Проверить frontend через ESLint"
	@echo "  make frontend-format     Отформатировать frontend через Prettier"
	@echo "  make frontend-typecheck  Проверить типы frontend через TypeScript typecheck"
	@echo "  make migrate             Выполнить миграции"
	@echo "  make seed                Запустить сидеры"
	@echo "  make fresh               Сбросить БД и выполнить сидеры"
	@echo "  make artisan CMD=...     Выполнить Artisan-команду"
	@echo "  make composer-install    Установить backend-зависимости"
	@echo "  make frontend-install    Установить frontend-зависимости"
	@echo "  make frontend-dev        Запустить Nuxt в режиме разработки"
	@echo "  make frontend-build      Собрать production-версию frontend"
	@echo "  make frontend-generate   Сгенерировать статический билд frontend"
	@echo "  make frontend-preview    Запустить preview production-сборки"
	@echo "  make frontend-test-watch Запустить frontend-тесты в watch-режиме"

dev:
	$(COMPOSE) up --remove-orphans

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

restart: down up

logs:
	$(COMPOSE) logs -f --tail=100

ps:
	$(COMPOSE) ps

check: backend-check frontend-check

backend-check: backend-test backend-lint backend-analyze

# TODO: Переписать, разобраться с ошибкой APP_ENV=testingы
backend-test:
	$(COMPOSE) exec -T postgres sh -lc "psql -U laravel -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname='laravel_test'\" | grep -q 1 || createdb -U laravel laravel_test"
	$(COMPOSE) exec -T $(APP_SERVICE) sh -lc "unset APP_ENV APP_DEBUG APP_URL DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD && APP_ENV=testing php artisan test --env=testing"

backend-lint:
	$(COMPOSE) exec -T $(APP_SERVICE) ./vendor/bin/pint --test

backend-analyze:
	$(COMPOSE) exec -T $(APP_SERVICE) ./vendor/bin/phpstan analyse --memory-limit=1G

backend-tinker:
	$(COMPOSE) exec $(APP_SERVICE) php artisan tinker

migrate:
	$(COMPOSE) exec -T $(APP_SERVICE) php artisan migrate

seed:
	$(COMPOSE) exec -T $(APP_SERVICE) php artisan db:seed

fresh:
	$(COMPOSE) exec -T $(APP_SERVICE) php artisan migrate:fresh --seed

artisan:
	$(COMPOSE) exec -T $(APP_SERVICE) php artisan $(CMD)

composer-install:
	$(COMPOSE) exec -T $(APP_SERVICE) composer install

frontend-install:
	$(COMPOSE) run --rm frontend npm install

frontend-dev:
	$(COMPOSE) up frontend

frontend-build:
	$(COMPOSE) run --rm frontend npm run build

frontend-generate:
	$(COMPOSE) run --rm frontend npm run generate

frontend-preview:
	$(COMPOSE) run --rm frontend npm run preview

frontend-check: frontend-test frontend-lint frontend-typecheck

frontend-test:
	$(COMPOSE) exec -T frontend npm run test

frontend-test-watch:
	$(COMPOSE) exec -T frontend npm run test:watch

frontend-lint:
	$(COMPOSE) exec -T frontend npm run lint

frontend-format:
	$(COMPOSE) exec -T frontend npm run format

frontend-typecheck:
	$(COMPOSE) exec -T frontend npm run typecheck
