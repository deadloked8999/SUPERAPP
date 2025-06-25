import TelegramBot from "node-telegram-bot-api";
import { db, addUser, initUsersTable, getUserByChatId } from "./db.js";

// Токен бота (замените на ваш реальный токен)
const token = process.env.TELEGRAM_BOT_TOKEN || "ТВОЙ_ТОКЕН_БОТА";

// Создаем экземпляр бота
export const bot = new TelegramBot(token, { polling: true });

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
  const lastName = msg.from.last_name || "";

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

// Обработка команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
🤖 <b>SUPERAPP - Справка</b>

📋 <b>Доступные команды:</b>
/start - Регистрация в системе
/help - Показать эту справку
/status - Показать ваш статус

🎯 <b>Роли в системе:</b>
• admin - Администратор
• hostess - Хостес
• dancer - Танцовщица
• promoter - Промоутер
• unknown - Неизвестная роль

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