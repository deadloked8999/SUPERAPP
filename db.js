import sqlite3 from "sqlite3";

// Создаем подключение к базе данных
export const db = new sqlite3.Database("auth.db", (err) => {
  if (err) {
    console.error("❌ Ошибка подключения к базе данных:", err);
  } else {
    console.log("✅ Подключение к базе данных auth.db установлено");
  }
});

// Функция для инициализации таблицы пользователей
export const initUsersTable = () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        phone_number TEXT,
        role TEXT,
        telegram_chat_id TEXT,
        auth_code TEXT,
        auth_expires TEXT
      )
    `, (err) => {
      if (err) {
        console.error("❌ Ошибка создания таблицы users:", err);
        reject(err);
      } else {
        console.log("✅ Таблица users готова к работе");
        resolve();
      }
    });
  });
};

// Функция для добавления пользователя
export const addUser = (username, phone_number, telegram_chat_id, role = "unknown") => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT OR IGNORE INTO users (username, phone_number, telegram_chat_id, role) VALUES (?, ?, ?, ?)",
      [username, phone_number, telegram_chat_id, role],
      function(err) {
        if (err) {
          console.error("❌ Ошибка добавления пользователя:", err);
          reject(err);
        } else {
          if (this.changes > 0) {
            console.log(`✅ Пользователь ${username} добавлен в базу данных`);
          } else {
            console.log(`ℹ️ Пользователь ${username} уже существует в базе данных`);
          }
          resolve(this.changes);
        }
      }
    );
  });
};

// Функция для получения пользователя по username
export const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) {
          console.error("❌ Ошибка получения пользователя:", err);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

// Функция для получения пользователя по telegram_chat_id
export const getUserByChatId = (chatId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE telegram_chat_id = ?",
      [chatId],
      (err, row) => {
        if (err) {
          console.error("❌ Ошибка получения пользователя по chat_id:", err);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}; 