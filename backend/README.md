# Backend Laravel

Быстрая настройка и запуск backend-приложения Todo App.

## Требования

- Docker
- Docker Compose
- Make

## Быстрый старт

1. Перейдите в папку backend:
    ```bash
    cd backend
    ```
2. Запустите приложение:
    ```bash
    make up
    ```
3. Откройте приложение в браузере:
    ```text
    http://localhost:8000
    ```

## Полезные команды

```bash
# Запуск контейнеров
make up

# Остановка контейнеров
make down

# Пересборка образов
make build

# Запуск тестов
make test

# Проверка кода через Pint
make lint

# Выполнение миграций
make migrate

# Запуск сидеров
make seed

# Сброс БД и запуск сидеров
make fresh
```

## Работа с Artisan

```bash
make artisan CMD="migrate"
make artisan CMD="db:seed"
make artisan CMD="route:list"
```

## База данных

Проект использует PostgreSQL:

- Хост: `postgres`
- Порт: `5432`
- База: `laravel`
- Пользователь: `laravel`
- Пароль: `secret`
