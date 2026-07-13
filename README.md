# Todo App

Простое fullstack приложение для управления задачами.

- **Backend:** Laravel
- **Frontend:** Nuxt 4
- **База данных:** PostgreSQL
- **Запуск через Docker Compose**

## Документация

- [Пользовательская документация](documentation/user-guide.md)

## Быстрый старт

### 1. Скачать проект

Сначала клонируйте репозиторий:

```bash
git clone https://github.com/paparrot/todo-app.git
```

Затем перейдите в папку проекта:

```bash
cd todo-app
```

### 2. Требования

- Docker
- Docker Compose
- Make

### 3. Запуск проекта

Из корня проекта выполните:

```bash
make up
```

Или эквивалентно:

```bash
docker compose up -d --build
```

После старта будут доступны:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/api/documentation`

## Если запускаете проект впервые

Обычно достаточно команды `make up`. Контейнер backend сам:

- создаёт `.env` из `.env.example`, если его нет
- генерирует `APP_KEY`, если он не задан
- выполняет миграции
- выполняет сидеры
- запускает Laravel server

Если хотите вручную пересобрать и заново заполнить БД, используйте:

```bash
make fresh
```

Это выполнит:

```bash
php artisan migrate:fresh --seed
```

## Полезные команды

### Общие

```bash
make dev       # запустить backend, frontend и БД в режиме разработки
make up        # поднять контейнеры в фоне
make down      # остановить контейнеры
make build     # пересобрать образы
make restart   # перезапустить окружение
make logs      # смотреть логи
make ps        # статус контейнеров
make check     # запустить все проверки backend и frontend
```

### Backend

Тесты используют отдельную базу `laravel_test` и `.env.testing`, поэтому не трогают рабочие данные.

```bash
make backend-check     # запустить все проверки backend
make backend-test      # запустить backend-тесты
make backend-lint      # проверить код через Pint
make backend-analyze   # проверить код через PHPStan
make backend-tinker    # открыть Laravel Tinker
make migrate           # выполнить миграции
make seed              # запустить сидеры
make fresh             # сбросить БД и заново выполнить сидеры
```

### Frontend

```bash
make frontend-check      # запустить все проверки frontend
make frontend-install     # установить frontend-зависимости
make frontend-dev         # запустить Nuxt в режиме разработки
make frontend-build       # собрать production-версию frontend
make frontend-generate    # сгенерировать статический билд frontend
make frontend-preview     # запустить preview production-сборки
make frontend-test        # запустить frontend-тесты
make frontend-test-watch  # запустить frontend-тесты в watch-режиме
make frontend-lint        # проверить frontend через ESLint
make frontend-format      # отформатировать frontend через Prettier
make frontend-typecheck   # проверить типы frontend через TypeScript typecheck
```

## Сидеры и тестовые пользователи

После запуска в системе уже будут созданы пользователи:

### 1. Owner

- Email: `owner@example.com`
- Password: `owner123`
- Role: `owner`

### 2. Admin

- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

### 3. Дополнительный пользователь

- Создаётся через factory
- Email случайный
- Role: `owner`

## Что уже есть после сидирования

- 2 фиксированных пользователя: owner и admin
- 1 дополнительный пользователь со случайным email
- 3 задачи по умолчанию для owner

## Настройка через `.env`

Роли и учётные данные тестовых пользователей можно изменить через переменные окружения:

```env
SEED_OWNER_NAME=Owner
SEED_OWNER_EMAIL=owner@example.com
SEED_OWNER_PASSWORD=owner123
SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=admin123
SEED_OWNER_TASK_COUNT=3
```

## Вход в приложение

1. Откройте `http://localhost:3000`
2. Войдите под одним из seeded-пользователей
3. После входа доступны:
   - список задач
   - создание/редактирование/удаление задач
   - бесконечная подгрузка списка задач

## Если нужно перезаполнить базу

```bash
make fresh
```

Это удобно, если хотите быстро вернуть проект к начальному состоянию.
