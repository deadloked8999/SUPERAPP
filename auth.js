import express from "express";
import { verifyAuthCode } from "./telegram.js";
import { getUserByUsername } from "./db.js";

const router = express.Router();

// POST /auth/verify-code - проверка кода аутентификации
router.post("/verify-code", async (req, res) => {
  try {
    const { username, code } = req.body;

    // Проверяем наличие обязательных полей
    if (!username || !code) {
      return res.status(400).json({
        success: false,
        message: "Username и код обязательны"
      });
    }

    // Убираем @ из username если есть
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

    // Проверяем код
    const verification = verifyAuthCode(cleanUsername, code);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: verification.message
      });
    }

    // Получаем информацию о пользователе из базы данных
    const user = await getUserByUsername(cleanUsername);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден в базе данных"
      });
    }

    // Создаем сессию пользователя
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      phone_number: user.phone_number,
      telegram_chat_id: user.telegram_chat_id
    };

    // Отправляем успешный ответ
    res.json({
      success: true,
      message: "Аутентификация успешна",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number
      }
    });

    console.log(`✅ Успешная аутентификация пользователя ${cleanUsername}`);

  } catch (error) {
    console.error("❌ Ошибка проверки кода:", error);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера"
    });
  }
});

// GET /auth/status - проверка статуса аутентификации
router.get("/status", (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      success: true,
      authenticated: false,
      user: null
    });
  }
});

// POST /auth/logout - выход из системы
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Ошибка при выходе:", err);
      return res.status(500).json({
        success: false,
        message: "Ошибка при выходе из системы"
      });
    }

    res.json({
      success: true,
      message: "Выход выполнен успешно"
    });
  });
});

// GET /auth/user - получение информации о текущем пользователе
router.get("/user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Пользователь не аутентифицирован"
    });
  }

  res.json({
    success: true,
    user: req.session.user
  });
});

export default router; 