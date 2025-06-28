const https = require('https');
const http = require('http');

// Функция для тестирования API
async function testAPI(username, code) {
  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:5000/api/verify-code?username=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`;
    
    console.log(`🔍 Тестируем: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`📊 Статус: ${res.statusCode}`);
          console.log(`📄 Ответ:`, result);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          console.error('❌ Ошибка парсинга JSON:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('❌ Ошибка запроса:', error.message);
      reject(error);
    });
  });
}

async function main() {
  console.log('🧪 Тестируем API endpoint /api/verify-code\n');
  
  // Тест 1: Правильный код для needls1
  console.log('1️⃣ Тест с правильным кодом для @needls1:');
  await testAPI('needls1', '1234');
  console.log('');
  
  // Тест 2: Неправильный код для needls1
  console.log('2️⃣ Тест с неправильным кодом для @needls1:');
  await testAPI('needls1', '9999');
  console.log('');
  
  // Тест 3: Правильный код для Ninth_God
  console.log('3️⃣ Тест с правильным кодом для @Ninth_God:');
  await testAPI('Ninth_God', '5678');
  console.log('');
  
  // Тест 4: Несуществующий пользователь
  console.log('4️⃣ Тест с несуществующим пользователем:');
  await testAPI('nonexistent', '1234');
  console.log('');
  
  // Тест 5: Без параметров
  console.log('5️⃣ Тест без параметров:');
  await testAPI('', '');
  console.log('');
  
  console.log('✅ Тестирование завершено');
}

main().catch(console.error); 