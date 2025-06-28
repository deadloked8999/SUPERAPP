import TelegramBot from "node-telegram-bot-api";
import { db, addUser, initUsersTable, getUserByChatId, getUserByUsername } from "./db.js";

// Токен бота из переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;

// Debug: проверяем загрузку переменных окружения
console.log("🔍 DEBUG: process.env.TELEGRAM_BOT_TOKEN =", process.env.TELEGRAM_BOT_TOKEN);
console.log("🔍 DEBUG: Все переменные окружения:", Object.keys(process.env).filter(key => key.includes('TELEGRAM')));

let bot = null;

// Map для хранения кодов аутентификации (username -> { code, expires })
export const authCodes = new Map();

// Функция для инициализации бота
export const initBot = () => {
  console.log("🔑 Проверка токена перед инициализацией:", process.env.TELEGRAM_BOT_TOKEN);
  
  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN не найден в переменных окружения");
    process.exit(1);
  }

  if (!bot) {
    // Создаем экземпляр бота
    bot = new TelegramBot(token, { polling: true });
    
    // Инициализируем таблицу пользователей при запуске
    initUsersTable().then(() => {
      console.log("🤖 Telegram бот готов к работе");
    }).catch(err => {
      console.error("❌ Ошибка инициализации бота:", err);
    });

    // Функция для генерации 4-значного кода
    const generateAuthCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    // Функция для получения пользователя из БД
    const getUserFromDB = async (username) => {
      try {
        // Убираем @ из username если есть
        const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
        
        const user = await getUserByUsername(cleanUsername);
        
        return user;
      } catch (error) {
        console.error("❌ Ошибка получения пользователя из БД:", error);
        return null;
      }
    };

    // Функция для сохранения кода в БД
    const saveCodeToUser = async (username, code) => {
      try {
        // Сохраняем код в базу данных
        const expires = new Date(Date.now() + (10 * 60 * 1000)).toISOString(); // 10 минут
        
        return new Promise((resolve, reject) => {
          db.run(
            "UPDATE users SET code = ?, auth_expires = ? WHERE username = ? OR username = ?",
            [code, expires, username, `@${username}`],
            function(err) {
              if (err) {
                console.error("❌ Ошибка сохранения кода в БД:", err);
                reject(err);
              } else {
                console.log(`💾 Код ${code} сохранен для пользователя ${username}`);
                resolve(true);
              }
            }
          );
        });
      } catch (error) {
        console.error("❌ Ошибка сохранения кода в БД:", error);
        return false;
      }
    };

    // Функция для генерации кода
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

    // Обработка команды /start
    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;
      const firstName = msg.from.first_name || "пользователь";

      const user = await getUserFromDB(username);

      if (user && user.role && user.subrole_code) {
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

      const user = await getUserFromDB(username);

      if (user && user.role && user.subrole_code) {
        await bot.sendMessage(chatId,
          `👤 Ваш статус:\nРоль: ${user.role}\nПодроль: ${user.subrole_code}\nВы зарегистрированы в системе.`
        );
      } else {
        bot.sendMessage(chatId, "Вы не зарегистрированы.");
      }
    });

    // Обработка команды /auth для получения кода
    bot.onText(/\/auth/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;

      const user = await getUserFromDB(username);
      if (!user) return bot.sendMessage(chatId, "Вы не зарегистрированы.");

      const code = generateCode();
      await saveCodeToUser(username, code);

      bot.sendMessage(chatId, `🔑 Ваш код авторизации: ${code}`);
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

    console.log("✅ Бот запущен:", new Date().toISOString());
  }

  return bot;
};

// Экспортируем функцию для остановки бота
export const stopBot = () => {
  if (bot) {
    bot.stopPolling();
    console.log("🤖 Telegram бот остановлен");
  }
};

// Экспортируем функцию для проверки кода
export const verifyAuthCode = (username, code) => {
  const authData = authCodes.get(username);
  
  if (!authData) {
    return {
      valid: false,
      message: "Код не найден или истек"
    };
  }

  if (authData.expires < Date.now()) {
    authCodes.delete(username);
    return {
      valid: false,
      message: "Код истек"
    };
  }

  if (authData.code !== code) {
    return {
      valid: false,
      message: "Неверный код"
    };
  }

  // Удаляем использованный код
  authCodes.delete(username);

  return {
    valid: true,
    message: "Код верный"
  };
}; 