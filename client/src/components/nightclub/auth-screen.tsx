import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

interface AuthScreenProps {
  code: string;
  onChange: (code: string) => void;
  onVerify: () => void;
  onNavigate?: (screen: string) => void;
}

export default function AuthScreen({ code, onChange, onVerify, onNavigate }: AuthScreenProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Получаем username из Telegram WebApp при загрузке компонента
  useEffect(() => {
    const tgUsername = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;
    if (tgUsername) {
      setUsername(tgUsername);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length >= 4 && username) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/verify-code?username=${username}&code=${code}`);
        const data = await response.json();
        
        if (data.ok) {
          onVerify(); // используем onVerify вместо onNavigate
        } else {
          alert("❌ Неверный код.");
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
          }
        }
      } catch (error) {
        alert("❌ Ошибка сети. Попробуйте еще раз.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      onChange(value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Only allow digits and limit to 4 characters
    const numericValue = pastedText.replace(/\D/g, '').slice(0, 4);
    onChange(numericValue);
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
            
            {/* Отображаем username если он получен */}
            {username && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <p className="text-xs text-gray-400 mb-1">Пользователь:</p>
                <p className="text-sm font-medium text-white">@{username}</p>
              </div>
            )}
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
                onPaste={handlePaste}
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
            
            {/* Submit button for non-Telegram environments */}
            {!window.Telegram?.WebApp && (
              <Button 
                type="submit"
                disabled={code.length < 4 || isLoading || !username}
                className={`w-full h-14 font-semibold text-base rounded-2xl transition-all duration-300 transform ${
                  code.length >= 4 && !isLoading && username
                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-xl shadow-orange-500/25 active:scale-95 hover:shadow-2xl hover:shadow-orange-500/40'
                    : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Проверка...</span>
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      <span>Подтвердить</span>
                    </>
                  )}
                </div>
              </Button>
            )}

            {/* Helper text */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mt-[0px] mb-[0px] text-center">
                {!username ? "Ожидание данных пользователя..." : "Введите все 4 цифры для продолжения"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
