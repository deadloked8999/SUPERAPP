const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к базе данных
const dbPath = path.join(__dirname, 'auth.db');

// Создаем подключение к базе данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err.message);
    return;
  }
  console.log('✅ Подключение к базе данных auth.db успешно');
});

// Функция для получения данных
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Функция для получения пользователя по username (копия из db.js)
const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    // Ищем пользователя как с @, так и без него
    db.get(
      "SELECT id, username, role, subrole_code, telegram_chat_id, phone_number FROM users WHERE username = ? OR username = ?",
      [username, `@${username}`],
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

async function main() {
  try {
    console.log('🔍 Тестируем функцию getUserByUsername...');
    
    const testUsernames = ['needls1', '@needls1', 'Ninth_God', '@Ninth_God', 'testbesttest1', '@testbesttest1'];
    
    for (const username of testUsernames) {
      console.log(`\n🔍 Поиск пользователя: "${username}"`);
      const user = await getUserByUsername(username);
      if (user) {
        console.log(`  ✅ НАЙДЕН: ID=${user.id}, Role=${user.role}, Subrole=${user.subrole_code || 'NULL'}`);
      } else {
        console.log(`  ❌ НЕ НАЙДЕН`);
      }
    }

    // Тестируем прямой SQL запрос
    console.log('\n🔍 Тестируем прямой SQL запрос для "needls1":');
    const directResult = await getQuery(
      "SELECT * FROM users WHERE username = ? OR username = ?",
      ['needls1', '@needls1']
    );
    console.log('Результат:', directResult);

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    // Закрываем соединение с базой данных
    db.close((err) => {
      if (err) {
        console.error('❌ Ошибка закрытия базы данных:', err.message);
      } else {
        console.log('\n✅ Соединение с базой данных закрыто');
      }
    });
  }
}

// Запускаем основную функцию
main(); 