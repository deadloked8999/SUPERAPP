# SUPERAPP Python Backend

Современный backend для системы управления ночным клубом, построенный на FastAPI и Python.

## 🚀 Особенности

- **FastAPI** - современный, быстрый веб-фреймворк для Python
- **SQLAlchemy** - ORM для работы с базой данных
- **SQLite** - легкая база данных (можно заменить на PostgreSQL)
- **Pydantic** - валидация данных и сериализация
- **Telegram Bot API** - интеграция с Telegram
- **Async/Await** - асинхронная обработка запросов

## 📁 Структура проекта

```
python-backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Конфигурация приложения
│   ├── database.py        # Модели базы данных
│   ├── routers/           # API роутеры
│   │   ├── auth.py        # Аутентификация
│   │   ├── shifts.py      # Управление сменами
│   │   ├── guests.py      # Управление гостями
│   │   ├── payments.py    # Управление платежами
│   │   └── telegram_bot.py # Telegram бот
│   ├── schemas/           # Pydantic схемы
│   ├── services/          # Бизнес-логика
│   └── utils/             # Утилиты
├── main.py               # Точка входа приложения
├── requirements.txt      # Зависимости Python
└── README.md            # Документация
```

## 🛠️ Установка и запуск

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл с вашими настройками.

### 3. Запуск приложения

```bash
# Режим разработки
python main.py

# Или через uvicorn
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/generate-code` - Генерация кода аутентификации
- `GET /api/auth/verify-code` - Проверка кода аутентификации
- `GET /api/auth/status` - Статус системы аутентификации

### Смены
- `POST /api/shifts/` - Создание новой смены
- `GET /api/shifts/active/{user_id}` - Получение активной смены
- `PUT /api/shifts/{shift_id}/end` - Завершение смены
- `GET /api/shifts/{shift_id}/stats` - Статистика смены

### Гости
- `POST /api/guests/` - Добавление нового гостя
- `PUT /api/guests/{guest_id}` - Обновление информации о госте
- `GET /api/guests/search` - Поиск гостей по имени

### Платежи
- `POST /api/payments/` - Создание нового платежа
- `PUT /api/payments/{payment_id}` - Обновление платежа

### Telegram Bot
- `GET /api/telegram/status` - Статус Telegram бота
- `GET /api/telegram/users` - Список пользователей бота

## 🔧 Конфигурация

Основные настройки в файле `app/config.py`:

- `DATABASE_URL` - URL базы данных
- `HOST` - Хост сервера (по умолчанию 0.0.0.0)
- `PORT` - Порт сервера (по умолчанию 5000)
- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота
- `SECRET_KEY` - Секретный ключ для JWT

## 🗄️ База данных

Приложение использует SQLite по умолчанию. Таблицы создаются автоматически при первом запуске:

- `users` - Пользователи системы
- `shifts` - Смены сотрудников
- `guests` - Гости клуба
- `payments` - Платежи

## 🔐 Безопасность

- Валидация данных через Pydantic
- CORS middleware для веб-приложений
- Аутентификация через временные коды
- Защита от SQL-инъекций через SQLAlchemy

## 📝 Логирование

Все операции логируются в консоль с эмодзи для удобства:

- ✅ Успешные операции
- ❌ Ошибки
- 🔑 Операции аутентификации
- 🤖 Telegram бот операции

## 🚀 Развертывание

### Локально
```bash
python main.py
```

### В продакшене
```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --workers 4
```

### Docker (будущее)
```bash
docker build -t superapp-backend .
docker run -p 5000:5000 superapp-backend
```

## 🤝 Интеграция с Frontend

Backend готов к интеграции с React frontend. Все API endpoints совместимы с существующим frontend кодом.

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи в консоли
2. Убедитесь, что все зависимости установлены
3. Проверьте конфигурацию в `.env` файле
4. Убедитесь, что порт 5000 свободен 