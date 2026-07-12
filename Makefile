.PHONY: help dev up down build restart logs ps test lint migrate seed fresh artisan composer-install frontend-install frontend-dev frontend-build frontend-generate frontend-preview frontend-test frontend-test-watch

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
	@echo "  make test                Запустить backend-тесты"
	@echo "  make lint                Проверить backend через Pint"
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
	@echo "  make frontend-test       Запустить frontend-тесты"
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

test:
	$(COMPOSE) exec -T $(APP_SERVICE) php artisan test

lint:
	$(COMPOSE) exec -T $(APP_SERVICE) ./vendor/bin/pint --test

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

frontend-test:
	$(COMPOSE) exec -T frontend npm run test

frontend-test-watch:
	$(COMPOSE) exec -T frontend npm run test:watch
