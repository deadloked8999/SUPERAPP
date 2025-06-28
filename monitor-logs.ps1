# Мониторинг логов SUPERAPP
Write-Host "🔍 Мониторинг логов SUPERAPP" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Проверка статуса сервера
Write-Host "📊 Статус сервера:" -ForegroundColor Yellow
$serverStatus = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -ErrorAction SilentlyContinue
if ($serverStatus) {
    Write-Host "✅ Сервер работает на порту 5000" -ForegroundColor Green
    Write-Host "   Статус: $($serverStatus.StatusCode)" -ForegroundColor White
} else {
    Write-Host "❌ Сервер не отвечает" -ForegroundColor Red
}

# Проверка API endpoints
Write-Host "`n🔌 Проверка API endpoints:" -ForegroundColor Yellow
$endpoints = @(
    "/api/verify-code?username=test&code=123",
    "/api/auth/status",
    "/api/shifts/active/1"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ $endpoint - $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $endpoint - Ошибка" -ForegroundColor Red
    }
}

# Проверка статических файлов
Write-Host "`n📁 Проверка статических файлов:" -ForegroundColor Yellow
$staticFiles = @(
    "/assets/index-B951MSX7.js",
    "/assets/index-DBY2rUF8.css",
    "/index.html"
)

foreach ($file in $staticFiles) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000$file" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ $file - $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $file - Ошибка" -ForegroundColor Red
    }
}

# Проверка процессов Node.js
Write-Host "`n🔄 Активные процессы Node.js:" -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        Write-Host "✅ PID: $($process.Id) - Запущен: $($process.StartTime)" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Процессы Node.js не найдены" -ForegroundColor Red
}

# Проверка портов
Write-Host "`n🌐 Проверка портов:" -ForegroundColor Yellow
$ports = @(5000, 5173)
foreach ($port in $ports) {
    $listening = netstat -an | Select-String ":$port.*LISTENING"
    if ($listening) {
        Write-Host "✅ Порт $port - Активен" -ForegroundColor Green
    } else {
        Write-Host "❌ Порт $port - Не активен" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Мониторинг завершен" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green 