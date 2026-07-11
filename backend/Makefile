.PHONY: help up down build test lint migrate seed fresh artisan

APP_SERVICE ?= app

help:
	@echo "Доступные команды:"
	@echo "  make up              Запустить контейнеры"
	@echo "  make down            Остановить контейнеры"
	@echo "  make build           Пересобрать образы"
	@echo "  make test            Запустить тесты"
	@echo "  make lint            Проверить код через Pint"
	@echo "  make migrate         Выполнить миграции"
	@echo "  make seed            Запустить сидеры"
	@echo "  make fresh           Сбросить БД и выполнить сидеры"
	@echo "  make artisan CMD=... Выполнить Artisan-команду"

up:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build

test:
	docker compose exec -T $(APP_SERVICE) php artisan test

lint:
	docker compose exec -T $(APP_SERVICE) ./vendor/bin/pint --test

migrate:
	docker compose exec -T $(APP_SERVICE) php artisan migrate

seed:
	docker compose exec -T $(APP_SERVICE) php artisan db:seed

fresh:
	docker compose exec -T $(APP_SERVICE) php artisan migrate:fresh --seed

artisan:
	docker compose exec -T $(APP_SERVICE) php artisan $(CMD)
