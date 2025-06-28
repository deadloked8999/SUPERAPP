import TelegramBot from "node-telegram-bot-api";
import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";

// Инициализация базы данных
const dbPath = path.resolve(process.cwd(), 'auth.db');
const db = new sqlite3.Database(dbPath);

// Промис-обертки для SQLite
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Инициализация таблицы пользователей
async function initUsersTable() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        role TEXT,
        subrole_code TEXT,
        phone_number TEXT,
        telegram_chat_id INTEGER,
        code TEXT,
        auth_expires TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Таблица users инициализирована");
  } catch (error) {
    console.error("❌ Ошибка инициализации таблицы users:", error);
  }
}

// Получение пользователя по username
async function getUserByUsername(username) {
  try {
    return await dbGet("SELECT * FROM users WHERE username = ? OR username = ?", [username, `@${username}`]);
  } catch (error) {
    console.error("❌ Ошибка получения пользователя:", error);
    return null;
  }
}

// Сохранение кода для пользователя
async function saveCodeToUser(username, code) {
  try {
    const expires = new Date(Date.now() + (10 * 60 * 1000)).toISOString(); // 10 минут
    await dbRun(
      "UPDATE users SET code = ?, auth_expires = ? WHERE username = ? OR username = ?",
      [code, expires, username, `@${username}`]
    );
    console.log(`💾 Код ${code} сохранен для пользователя ${username}`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка сохранения кода:", error);
    return false;
  }
}

// Генерация 4-значного кода
function generateAuthCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Инициализация бота
function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN не найден в переменных окружения");
    process.exit(1);
  }

  console.log("🔑 Токен бота:", token ? "✅ Найден" : "❌ Не найден");

  const bot = new TelegramBot(token, { polling: true });

  // Обработка команды /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const firstName = msg.from.first_name || "пользователь";

    console.log(`👋 Команда /start от ${username} (${firstName})`);

    const user = await getUserByUsername(username);

    if (user && user.role && user.subrole_code) {
      bot.sendMessage(chatId,
        `🔐 Авторизуйтесь!\n🧭 Доступные команды:\n/status – Показать ваш статус\n/code – Получить код для входа`
      );
    } else {
      bot.sendMessage(chatId,
        `👋 Привет, ${firstName}!\nВы ещё не зарегистрированы в системе.`
      );
    }
  });

  // Обработка команды /status
  bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    console.log(`📊 Команда /status от ${username}`);

    const user = await getUserByUsername(username);

    if (user && user.role && user.subrole_code) {
      await bot.sendMessage(chatId,
        `👤 Ваш статус:\nРоль: ${user.role}\nПодроль: ${user.subrole_code}\nВы зарегистрированы в системе.`
      );
    } else {
      bot.sendMessage(chatId, "Вы не зарегистрированы.");
    }
  });

  // Обработка команды /code для получения кода
  bot.onText(/\/code/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    console.log(`🔑 Команда /code от ${username}`);

    const user = await getUserByUsername(username);
    if (!user) {
      bot.sendMessage(chatId, "Вы не зарегистрированы.");
      return;
    }

    const code = generateAuthCode();
    const success = await saveCodeToUser(username, code);

    if (success) {
      bot.sendMessage(chatId, `🔑 Ваш код авторизации: ${code}\n⏰ Код действителен 10 минут`);
    } else {
      bot.sendMessage(chatId, "❌ Ошибка генерации кода. Попробуйте позже.");
    }
  });

  // Обработка команды /help
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `
🤖 <b>SUPERAPP - Справка</b>

📋 <b>Доступные команды:</b>
/start - Регистрация в системе
/code - Получить код для входа в веб-приложение
/help - Показать эту справку
/status - Показать ваш статус

🎯 <b>Роли в системе:</b>
• admin - Администратор
• hostess - Хостес
• dancer - Танцовщица
• promoter - Промоутер
• unknown - Неизвестная роль

🔐 <b>Аутентификация:</b>
1. Используйте /code для получения кода
2. Код действителен 10 минут
3. Введите код на сайте для входа

📞 <b>Поддержка:</b>
Для получения доступа или изменения роли обратитесь к администратору.

🌐 <b>Веб-приложение:</b>
http://localhost:5173
    `;

    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'HTML' });
  });

  // Обработка ошибок бота
  bot.on('error', (error) => {
    console.error("❌ Ошибка Telegram бота:", error);
  });

  bot.on('polling_error', (error) => {
    console.error("❌ Ошибка polling Telegram бота:", error);
  });

  console.log("✅ Telegram бот запущен:", new Date().toISOString());
  
  return bot;
}

// Инициализация
async function startBot() {
  try {
    await initUsersTable();
    const bot = initBot();
    console.log("🤖 Telegram бот готов к работе");
    return bot;
  } catch (error) {
    console.error("❌ Ошибка запуска бота:", error);
    process.exit(1);
  }
}

// Экспорты
export { startBot, getUserByUsername, saveCodeToUser, generateAuthCode };

// Запуск бота если файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  startBot();
} 