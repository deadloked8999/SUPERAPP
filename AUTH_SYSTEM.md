# 🔐 Система аутентификации SUPERAPP

## 📋 Описание

Система аутентификации через Telegram бота с генерацией и проверкой 4-значных кодов. Пользователи получают код в Telegram и используют его для входа в веб-приложение.

## 🏗️ Архитектура

### Компоненты системы:

1. **Telegram Bot** (`telegram.js`) - генерирует коды и отправляет их пользователям
2. **Auth API** (`auth.js`) - проверяет коды и управляет сессиями
3. **Database** (`db.js`) - хранит информацию о пользователях
4. **Express Routes** (`server/routes.ts`) - интегрирует систему в веб-сервер

## 🔄 Процесс аутентификации

### 1. Получение кода
```
Пользователь → /auth в Telegram → Бот генерирует код → Отправляет код
```

### 2. Вход в систему
```
Пользователь → Вводит username + код → API проверяет → Создает сессию
```

## 🎯 API Endpoints

### POST /api/auth/verify-code
Проверяет код аутентификации и создает сессию пользователя.

**Request:**
```json
{
  "username": "username",
  "code": "1234"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Аутентификация успешна",
  "user": {
    "id": 1,
    "username": "username",
    "role": "admin",
    "phone_number": "+79267166906"
  }
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "Неверный код"
}
```

### GET /api/auth/status
Проверяет статус аутентификации текущего пользователя.

**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "username",
    "role": "admin"
  }
}
```

### POST /api/auth/logout
Выход из системы (уничтожает сессию).

**Response:**
```json
{
  "success": true,
  "message": "Выход выполнен успешно"
}
```

### GET /api/auth/user
Получение информации о текущем пользователе.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "username",
    "role": "admin"
  }
}
```

## 🤖 Telegram Bot Commands

### /auth
Генерирует 4-значный код для входа в систему.

**Требования:**
- Пользователь должен иметь username в Telegram
- Пользователь должен быть зарегистрирован в системе

**Ответ бота:**
```
🔐 Код аутентификации

👤 Пользователь: @username
🎯 Роль: admin

🔢 Ваш код: 1234

⏰ Действителен: 10 минут
🌐 Сайт: http://localhost:5173

📝 Инструкция:
1. Перейдите на сайт
2. Введите username: @username
3. Введите код: 1234
4. Нажмите "Войти"

⚠️ Внимание: Не передавайте код третьим лицам!
```

## 🔧 Настройка

### 1. Переменные окружения
Создайте файл `.env` на основе `env.example`:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
SESSION_SECRET=your_session_secret_here
DATABASE_URL=sqlite:./auth.db
NODE_ENV=development
PORT=5000
VITE_API_URL=http://127.0.0.1:5000
```

### 2. Запуск системы
```bash
# Запуск всех компонентов
npm run dev

# Или по отдельности:
npm run bot      # Telegram бот
npm run server   # Express сервер
npm run client   # Vite клиент
```

## 🔒 Безопасность

### Коды аутентификации:
- **Длина:** 4 цифры (1000-9999)
- **Время жизни:** 10 минут
- **Одноразовые:** удаляются после использования
- **Автоочистка:** устаревшие коды удаляются каждые 5 минут

### Сессии:
- **Время жизни:** 24 часа
- **Безопасность:** httpOnly cookies
- **Секрет:** настраивается через SESSION_SECRET

### Защита от атак:
- SQL-инъекции: prepared statements
- XSS: httpOnly cookies
- CSRF: проверка сессий
- Брутфорс: ограничение попыток (можно добавить)

## 📊 База данных

### Таблица users:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  phone_number TEXT,
  role TEXT,
  telegram_chat_id TEXT,
  auth_code TEXT,
  auth_expires TEXT
);
```

### Роли пользователей:
- **admin** - Администратор (полный доступ)
- **hostess** - Хостес
- **dancer** - Танцовщица
- **promoter** - Промоутер
- **unknown** - Неизвестная роль

## 🚀 Интеграция с фронтендом

### Пример использования в React:
```javascript
// Получение кода
const getAuthCode = async (username) => {
  // Пользователь должен получить код через Telegram бота
  console.log(`Используйте команду /auth в Telegram боте для получения кода`);
};

// Проверка кода
const verifyCode = async (username, code) => {
  const response = await fetch('/api/auth/verify-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, code })
  });
  
  const result = await response.json();
  return result;
};

// Проверка статуса
const checkAuthStatus = async () => {
  const response = await fetch('/api/auth/status');
  const result = await response.json();
  return result;
};

// Выход
const logout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
};
```

## 🐛 Отладка

### Логи бота:
```
🔐 Код 1234 отправлен пользователю username (123456789)
✅ Успешная аутентификация пользователя username
🧹 Удален устаревший код для username
```

### Логи сервера:
```
POST /api/auth/verify-code 200 in 45ms :: {"success":true,"message":"Аутентификация успешна"}
GET /api/auth/status 200 in 12ms :: {"success":true,"authenticated":true}
```

## 🔄 Расширение системы

### Добавление новых ролей:
1. Обновите enum ролей в коде
2. Добавьте логику доступа
3. Обновите документацию

### Добавление двухфакторной аутентификации:
1. Добавьте поле `two_factor_enabled` в БД
2. Реализуйте генерацию TOTP кодов
3. Обновите процесс аутентификации

### Добавление ограничений попыток:
1. Добавьте счетчик попыток в Map
2. Реализуйте блокировку после N неудачных попыток
3. Добавьте временную блокировку

---

**Версия:** 1.0.0  
**Дата:** 2025-01-25  
**Автор:** SUPERAPP Team 