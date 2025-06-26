import TelegramBot from "node-telegram-bot-api";
import { db, addUser, initUsersTable, getUserByChatId, getUserByUsername } from "./db.js";
import dotenv from "dotenv";

// Загружаем переменные окружения
dotenv.config();

// Токен бота из переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN не найден в переменных окружения");
  process.exit(1);
}

// Создаем экземпляр бота
export const bot = new TelegramBot(token, { polling: true });

// Map для хранения кодов аутентификации (username -> { code, expires })
export const authCodes = new Map();

// Функция для генерации 4-значного кода
const generateAuthCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// TODO: Функция для получения пользователя из БД
const getUserFromDB = async (username) => {
  try {
    return await getUserByUsername(username);
  } catch (error) {
    console.error("❌ Ошибка получения пользователя из БД:", error);
    return null;
  }
};

// TODO: Функция для сохранения кода в БД
const saveCodeToUser = async (username, code) => {
  try {
    // Сохраняем код в Map (временное решение)
    const expires = Date.now() + (10 * 60 * 1000); // 10 минут
    authCodes.set(username, { code, expires });
    console.log(`💾 Код ${code} сохранен для пользователя ${username}`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка сохранения кода в БД:", error);
    return false;
  }
};

// TODO: Функция для генерации кода
const generateCode = () => {
  return generateAuthCode();
};

// Функция для очистки устаревших кодов
const cleanupExpiredCodes = () => {
  const now = Date.now();
  for (const [username, data] of authCodes.entries()) {
    if (data.expires < now) {
      authCodes.delete(username);
      console.log(`🧹 Удален устаревший код для ${username}`);
    }
  }
};

// Очистка кодов каждые 5 минут
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);

// Инициализируем таблицу пользователей при запуске
initUsersTable().then(() => {
  console.log("🤖 Telegram бот готов к работе");
}).catch(err => {
  console.error("❌ Ошибка инициализации бота:", err);
});

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const firstName = msg.from.first_name || "пользователь";

  const user = await getUserFromDB(username);

  if (user && user.role && user.id) {
    bot.sendMessage(chatId,
      `🔐 Авторизуйтесь!\n🧭 Доступные команды:\n/status – Показать ваш статус\n/auth – Получить код для входа`
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

  try {
    // Получаем информацию о пользователе из базы данных
    const user = await getUserFromDB(username);
    
    if (user && user.role && user.id) {
      // Первое сообщение со статусом
      const statusMessage = `👤 Ваш статус:  
Роль: ${user.role}  
ID: ${user.id}  
Вы зарегистрированы в системе.`;
      
      await bot.sendMessage(chatId, statusMessage);
      
      // Второе сообщение с командами
      const commandsMessage = `🔐 Авторизуйтесь!  
🧭 Доступные команды:  
/status – Показать ваш статус  
/auth – Получить код для входа`;
      
      await bot.sendMessage(chatId, commandsMessage);
    } else {
      await bot.sendMessage(chatId, 
        "❌ Вы не найдены в базе данных или у вас нет роли. Используйте /start для регистрации."
      );
    }
  } catch (error) {
    console.error("❌ Ошибка получения статуса:", error);
    await bot.sendMessage(chatId, 
      "❌ Произошла ошибка при получении статуса. Попробуйте позже."
    );
  }
});

// Обработка команды /auth для получения кода
bot.onText(/\/auth/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  if (!username) {
    await bot.sendMessage(chatId, 
      "❌ У вас должен быть username в Telegram для получения кода аутентификации."
    );
    return;
  }

  try {
    // Проверяем, есть ли пользователь в базе данных
    const user = await getUserFromDB(username);
    
    if (!user) {
      await bot.sendMessage(chatId, 
        "❌ Вы не найдены в базе данных. Используйте /start для регистрации."
      );
      return;
    }

    // Генерируем новый код
    const code = generateCode();
    
    // Сохраняем код в БД
    const saved = await saveCodeToUser(username, code);
    
    if (!saved) {
      await bot.sendMessage(chatId, 
        "❌ Ошибка сохранения кода. Попробуйте позже."
      );
      return;
    }
    
    // Отправляем код пользователю
    const authMessage = `🔑 Ваш код авторизации: ${code}`;

    await bot.sendMessage(chatId, authMessage);
    
    console.log(`🔐 Код ${code} отправлен пользователю ${username} (${chatId})`);

  } catch (error) {
    console.error("❌ Ошибка генерации кода:", error);
    
    await bot.sendMessage(chatId, 
      "❌ Произошла ошибка при генерации кода. Попробуйте позже."
    );
  }
});

// Обработка команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
🤖 <b>SUPERAPP - Справка</b>

📋 <b>Доступные команды:</b>
/start - Регистрация в системе
/auth - Получить код для входа в веб-приложение
/help - Показать эту справку
/status - Показать ваш статус

🎯 <b>Роли в системе:</b>
• admin - Администратор
• hostess - Хостес
• dancer - Танцовщица
• promoter - Промоутер
• unknown - Неизвестная роль

🔐 <b>Аутентификация:</b>
1. Используйте /auth для получения кода
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

// Экспортируем функцию для остановки бота
export const stopBot = () => {
  bot.stopPolling();
  console.log("🤖 Telegram бот остановлен");
};

// Экспортируем функцию для проверки кода
export const verifyAuthCode = (username, code) => {
  const authData = authCodes.get(username);
  
  if (!authData) {
    return { valid: false, message: "Код не найден" };
  }
  
  if (authData.expires < Date.now()) {
    authCodes.delete(username);
    return { valid: false, message: "Код истек" };
  }
  
  if (authData.code !== code) {
    return { valid: false, message: "Неверный код" };
  }
  
  // Удаляем использованный код
  authCodes.delete(username);
  
  return { valid: true, message: "Код подтвержден" };
}; 