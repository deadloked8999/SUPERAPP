#!/usr/bin/env python3
"""
SUPERAPP Python Backend Runner
Запуск и настройка backend сервера
"""

import subprocess
import sys
import os
from pathlib import Path

def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3, 8):
        print("❌ Требуется Python 3.8 или выше")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}")

def install_dependencies():
    """Установка зависимостей"""
    print("📦 Установка зависимостей...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Зависимости установлены")
    except subprocess.CalledProcessError:
        print("❌ Ошибка установки зависимостей")
        sys.exit(1)

def create_env_file():
    """Создание .env файла если не существует"""
    env_file = Path(".env")
    if not env_file.exists():
        print("🔧 Создание .env файла...")
        env_content = """# Database Configuration
DATABASE_URL=sqlite:///./superapp.db

# Server Configuration
HOST=0.0.0.0
PORT=5000

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Security Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment Configuration
ENVIRONMENT=development
DEBUG=true
"""
        with open(env_file, "w", encoding="utf-8") as f:
            f.write(env_content)
        print("✅ .env файл создан")

def run_server():
    """Запуск сервера"""
    print("🚀 Запуск SUPERAPP Python Backend...")
    try:
        subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")

def main():
    """Основная функция"""
    print("🎯 SUPERAPP Python Backend Setup")
    print("=" * 40)
    
    # Проверки
    check_python_version()
    
    # Установка зависимостей
    if "--no-install" not in sys.argv:
        install_dependencies()
    
    # Создание .env файла
    create_env_file()
    
    # Запуск сервера
    run_server()

if __name__ == "__main__":
    main() 