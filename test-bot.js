import { bot, stopBot } from "./telegram.js";

console.log("🤖 Запуск тестового режима Telegram бота...");
console.log("📝 Для остановки нажмите Ctrl+C");

// Обработка сигнала завершения
process.on('SIGINT', () => {
  console.log("\n🛑 Получен сигнал завершения...");
  stopBot();
  process.exit(0);
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error("❌ Необработанная ошибка:", error);
  stopBot();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("❌ Необработанное отклонение промиса:", reason);
  stopBot();
  process.exit(1);
}); 