const http = require('http');

// Функция для тестирования API
async function testAPI(username, code, description) {
  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:5000/api/verify-code?username=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`;
    
    console.log(`\n🔍 Тест: ${description}`);
    console.log(`URL: ${url}`);
    
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
          
          if (result.ok) {
            console.log('✅ УСПЕХ: Код принят');
          } else {
            console.log('❌ ОТКЛОНЕНО: Код неверный');
          }
          
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
  
  try {
    // Тест 1: Правильный код для needls1
    await testAPI('needls1', '1234', 'Правильный код для @needls1');
    
    // Тест 2: Неправильный код для needls1
    await testAPI('needls1', '9999', 'Неправильный код для @needls1');
    
    // Тест 3: Правильный код для Ninth_God
    await testAPI('Ninth_God', '5678', 'Правильный код для @Ninth_God');
    
    // Тест 4: Несуществующий пользователь
    await testAPI('nonexistent', '1234', 'Несуществующий пользователь');
    
    // Тест 5: Без параметров
    await testAPI('', '', 'Без параметров');
    
    // Тест 6: С символом @ в username
    await testAPI('@needls1', '1234', 'Username с символом @');
    
    console.log('\n✅ Тестирование завершено');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

main(); 