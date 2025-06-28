process.env.TELEGRAM_BOT_TOKEN = "7487482387:AAGCZh9dDwkv7ZeHcFyuWNwdAGyhs9JqI6U";

import { spawn } from "child_process";
import dotenv from "dotenv";
import path from "path";
import { startBot } from "./telegram.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if (!process.env.TELEGRAM_BOT_TOKEN) {
  process.env.TELEGRAM_BOT_TOKEN = "7487482387:AAGCZh9dDwkv7ZeHcFyuWNwdAGyhs9JqI6U";
  console.log("⛑ Переменная TELEGRAM_BOT_TOKEN подставлена вручную.");
} else {
  console.log("✅ Переменная TELEGRAM_BOT_TOKEN найдена в .env");
}

console.log("🚀 Запускаем Telegram бота...");
startBot().then(() => {
  console.log("🤖 Telegram бот запущен успешно");
}).catch(error => {
  console.error("❌ Ошибка запуска Telegram бота:", error);
});

console.log("🚀 Запускаем npm run dev через PowerShell...\n");

const devProcess = spawn("powershell.exe", [
  "-Command",
  "$env:TELEGRAM_BOT_TOKEN='7487482387:AAGCZh9dDwkv7ZeHcFyuWNwdAGyhs9JqI6U'; npm run dev"
], {
  stdio: "inherit",
  env: { ...process.env }
});

devProcess.on("exit", (code) => {
  console.log(`\n✅ Процесс завершён с кодом: ${code}`);
});

devProcess.on("error", (error) => {
  console.error("❌ Ошибка запуска процесса:", error);
}); 