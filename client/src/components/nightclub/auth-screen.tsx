import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useState } from "react";

interface AuthScreenProps {
  onNext: () => void;
}

export default function AuthScreen({ onNext }: AuthScreenProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Получаем username из Telegram WebApp
  const username = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;
  
  // Проверяем наличие username
  if (!username) {
    alert("Нет данных Telegram. Закрываю.");
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      alert("Введите 4-значный код");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Внешний Replit URL
      const url = `https://a20cacca-51d5-46aa-a228-e90a8ce7fabc-00-jv4a5i83pgws.worf.replit.dev/api/verify-code?username=${username}&code=${code}`;
      console.log("Введённый код:", code);
      console.log("URL запроса:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log("Ответ от сервера:", data);
      
      if (data.ok === true) {
        onNext();
      } else {
        alert("Неверный код! Приложение закроется.");
        setTimeout(() => {
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
          }
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Ошибка запроса:", err);
      alert("Ошибка сервера");
      setTimeout(() => {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.close();
        }
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Только цифры, максимум 4 символа
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(value);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
        <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
          auth-screen
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 left-6 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-8 w-24 h-24 bg-gradient-to-tl from-pink-500/10 to-orange-500/10 rounded-full blur-2xl"></div>

        <div className="w-full max-w-sm relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-white mb-3 text-[29px]">Введите код</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Введите 4-значный код,<br />
              полученный у администратора
            </p>
            
            {/* Отображаем username */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">Пользователь:</p>
              <p className="text-sm font-medium text-white">@{username}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Code Input */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <Input 
                type="password" 
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="****"
                value={code}
                onChange={handleInputChange}
                disabled={isLoading}
                className="relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] text-white placeholder:text-gray-500 focus:border-orange-500/60 focus:bg-gray-900/90 transition-all duration-300 outline-none disabled:opacity-50"
                maxLength={4}
              />
              
              {/* Input dots indicator */}
              <div className="flex justify-center space-x-3 mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index < code.length
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 scale-110 shadow-lg shadow-orange-500/50'
                        : 'bg-gray-600/50 border border-gray-500/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden mt-[-128px] mb-[-128px]">
              <div 
                className={`h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500 ease-out ${
                  code.length === 0 ? 'w-0' :
                  code.length === 1 ? 'w-1/4' :
                  code.length === 2 ? 'w-2/4' :
                  code.length === 3 ? 'w-3/4' : 'w-full'
                }`}
              />
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={code.length < 4 || isLoading}
              className={`w-full h-14 font-semibold text-base rounded-2xl transition-all duration-300 transform ${
                code.length >= 4 && !isLoading
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-xl shadow-orange-500/25 active:scale-95 hover:shadow-2xl hover:shadow-orange-500/40'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Проверка...
                </div>
              ) : (
                "Подтвердить"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
