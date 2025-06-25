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
  const username = msg.from.username || null;
  const phone_number = null;
  const firstName = msg.from.first_name || "Пользователь";

  try {
    // Добавляем пользователя в базу данных
    const changes = await addUser(username, phone_number, chatId, "unknown");
    
    // Формируем приветственное сообщение
    let welcomeMessage = `👋 Привет, ${firstName}!`;
    
    if (changes > 0) {
      welcomeMessage += "\n\n✅ Вы успешно зарегистрированы в системе SUPERAPP!";
      welcomeMessage += "\n\n🎯 Ваша роль: <b>Неизвестная</b>";
      welcomeMessage += "\n📱 Для получения доступа обратитесь к администратору.";
    } else {
      welcomeMessage += "\n\nℹ️ Вы уже зарегистрированы в системе.";
      welcomeMessage += "\n\n🎯 Используйте команды:";
      welcomeMessage += "\n/help - Справка";
      welcomeMessage += "\n/status - Ваш статус";
      welcomeMessage += "\n/auth - Получить код для входа";
    }

    // Отправляем приветственное сообщение
    await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
    
    console.log(`📨 Приветственное сообщение отправлено пользователю ${username} (${chatId})`);

  } catch (error) {
    console.error("❌ Ошибка обработки команды /start:", error);
    
    // Отправляем сообщение об ошибке
    await bot.sendMessage(chatId, 
      "❌ Произошла ошибка при регистрации. Попробуйте позже или обратитесь к администратору."
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
    const user = await getUserByUsername(username);
    
    if (!user) {
      await bot.sendMessage(chatId, 
        "❌ Вы не найдены в базе данных. Используйте /start для регистрации."
      );
      return;
    }

    // Генерируем новый код
    const code = generateAuthCode();
    const expires = Date.now() + (10 * 60 * 1000); // Код действителен 10 минут
    
    // Сохраняем код в Map
    authCodes.set(username, { code, expires });
    
    // Отправляем код пользователю
    const authMessage = `
🔐 <b>Код аутентификации</b>

👤 <b>Пользователь:</b> @${username}
🎯 <b>Роль:</b> ${user.role || 'Неизвестна'}

🔢 <b>Ваш код:</b> <code>${code}</code>

⏰ <b>Действителен:</b> 10 минут
🌐 <b>Сайт:</b> http://localhost:5173

📝 <b>Инструкция:</b>
1. Перейдите на сайт
2. Введите username: @${username}
3. Введите код: ${code}
4. Нажмите "Войти"

⚠️ <b>Внимание:</b> Не передавайте код третьим лицам!
    `;

    await bot.sendMessage(chatId, authMessage, { parse_mode: 'HTML' });
    
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

// Обработка команды /status
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    // Получаем информацию о пользователе из базы данных
    const user = await getUserByChatId(chatId);
    
    if (user) {
      const statusMessage = `
👤 <b>Ваш профиль</b>

📛 <b>Username:</b> ${user.username || 'Не указан'}
📱 <b>Телефон:</b> ${user.phone_number || 'Не указан'}
🎯 <b>Роль:</b> ${user.role || 'Неизвестна'}
🆔 <b>Chat ID:</b> ${user.telegram_chat_id}

${user.role === 'admin' ? '🔑 <b>Доступ:</b> Полный административный доступ' : 
  user.role === 'hostess' ? '👩‍💼 <b>Доступ:</b> Функции хостес' :
  user.role === 'dancer' ? '💃 <b>Доступ:</b> Функции танцовщицы' :
  user.role === 'promoter' ? '📢 <b>Доступ:</b> Функции промоутера' :
  '❓ <b>Доступ:</b> Ограничен (обратитесь к администратору)'}

🔐 <b>Активные коды:</b> ${authCodes.has(user.username) ? 'Есть' : 'Нет'}
      `;
      
      await bot.sendMessage(chatId, statusMessage, { parse_mode: 'HTML' });
    } else {
      await bot.sendMessage(chatId, 
        "❌ Вы не найдены в базе данных. Используйте /start для регистрации."
      );
    }
  } catch (error) {
    console.error("❌ Ошибка получения статуса:", error);
    await bot.sendMessage(chatId, 
      "❌ Произошла ошибка при получении статуса. Попробуйте позже."
    );
  }
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