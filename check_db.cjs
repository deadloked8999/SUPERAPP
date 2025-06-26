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

// Функция для выполнения SQL запросов
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

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

async function main() {
  try {
    console.log('🔍 Проверяем структуру базы данных...');
    
    // Проверяем структуру таблицы users
    const tableInfo = await getQuery("PRAGMA table_info(users)");
    console.log('📋 Структура таблицы users:');
    tableInfo.forEach(column => {
      console.log(`  - ${column.name} (${column.type})`);
    });
    
    // Проверяем, есть ли поле code
    const hasCodeField = tableInfo.some(column => column.name === 'code');
    
    if (!hasCodeField) {
      console.log('➕ Добавляем поле code в таблицу users...');
      await runQuery("ALTER TABLE users ADD COLUMN code TEXT");
      console.log('✅ Поле code добавлено');
    } else {
      console.log('✅ Поле code уже существует');
    }
    
    // Показываем всех пользователей
    const allUsers = await getQuery(`
      SELECT id, username, role, subrole_code, code, auth_expires 
      FROM users 
      ORDER BY id
    `);
    
    console.log('\n👥 Пользователи в базе данных:');
    allUsers.forEach(user => {
      console.log(`  ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Subrole: ${user.subrole_code}, Code: ${user.code || 'NULL'}`);
    });
    
    // Тестируем поиск пользователей
    console.log('\n🔍 Тестируем поиск пользователей:');
    
    const testUsernames = ['needls1', '@needls1', 'Ninth_God', '@Ninth_God'];
    
    for (const testUsername of testUsernames) {
      const cleanUsername = testUsername.startsWith('@') ? testUsername.slice(1) : testUsername;
      const user = await getQuery(
        "SELECT id, username, role, subrole_code, code FROM users WHERE username = ? OR username = ?",
        [cleanUsername, `@${cleanUsername}`]
      );
      
      if (user.length > 0) {
        console.log(`✅ Найден пользователь для '${testUsername}':`, user[0]);
      } else {
        console.log(`❌ Пользователь '${testUsername}' не найден`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ Ошибка закрытия базы данных:', err.message);
      } else {
        console.log('✅ База данных закрыта');
      }
    });
  }
}

main(); 