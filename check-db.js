import sqlite3 from "sqlite3";

const db = new sqlite3.Database("auth.db");

console.log("🔍 Проверка базы данных auth.db...\n");

db.all("SELECT * FROM users", (err, rows) => {
  if (err) {
    console.error("❌ Ошибка при чтении базы данных:", err);
  } else {
    console.log("✅ Пользователи в базе данных:");
    console.log("┌─────┬─────────────────┬─────────────────┬─────────┬─────────────────┬─────────────┬──────────────┐");
    console.log("│ ID  │ Username        │ Phone Number    │ Role    │ Telegram Chat ID│ Auth Code   │ Auth Expires  │");
    console.log("├─────┼─────────────────┼─────────────────┼─────────┼─────────────────┼─────────────┼──────────────┤");
    
    rows.forEach(row => {
      const id = row.id.toString().padEnd(4);
      const username = (row.username || '').padEnd(16);
      const phone = (row.phone_number || 'N/A').padEnd(16);
      const role = (row.role || '').padEnd(8);
      const chatId = (row.telegram_chat_id || 'N/A').padEnd(16);
      const authCode = (row.auth_code || 'N/A').padEnd(12);
      const authExpires = (row.auth_expires || 'N/A').padEnd(14);
      
      console.log(`│ ${id} │ ${username} │ ${phone} │ ${role} │ ${chatId} │ ${authCode} │ ${authExpires} │`);
    });
    
    console.log("└─────┴─────────────────┴─────────────────┴─────────┴─────────────────┴─────────────┴──────────────┘");
    console.log(`\n📊 Всего пользователей: ${rows.length}`);
  }
  
  db.close();
}); 