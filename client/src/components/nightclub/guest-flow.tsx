import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Minus, ArrowRight, UserPlus, BarChart3 } from "lucide-react";
import type { Screen } from "@/pages/nightclub-app";

interface GuestFlowProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  reservation: boolean;
  setReservation: (reservation: boolean) => void;
  visitedBefore: boolean;
  setVisitedBefore: (visited: boolean) => void;
  guestName: string;
  setGuestName: (name: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  declineReason: string;
  setDeclineReason: (reason: string) => void;
  resetGuestFlow: () => void;
  shiftStartTime: Date | null;
}

export default function GuestFlow({
  screen,
  setScreen,
  guestCount,
  setGuestCount,
  reservation,
  setReservation,
  visitedBefore,
  setVisitedBefore,
  guestName,
  setGuestName,
  searchResults,
  setSearchResults,
  declineReason,
  setDeclineReason,
  resetGuestFlow,
  shiftStartTime,
}: GuestFlowProps) {

  if (screen === "guest-flow-start") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
        <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
          guest-flow
        </div>
        <div className="text-6xl mb-6">
          <Users className="mx-auto text-orange-500" size={96} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Работа с гостями</h2>
        <p className="text-gray-400 mb-8">Добавление нового гостя или группы</p>
        
        <Button 
          onClick={() => setScreen("guest-count")}
          className="w-full max-w-xs py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="mr-2" size={20} />
          Добавить гостей
        </Button>
        
        <Button 
          onClick={() => setScreen("shift-dashboard")}
          className="bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl py-3 w-full max-w-sm mx-auto mt-4"
        >
          На главную
        </Button>
      </div>
    );
  }

  if (screen === "guest-count") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Количество гостей</h2>
          <p className="text-gray-400">Выберите количество человек</p>
        </div>
        
        {/* Guest Counter */}
        <Card className="bg-gray-800 rounded-xl mb-6 border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-8">
              <Button 
                onClick={() => guestCount > 1 && setGuestCount(guestCount - 1)}
                disabled={guestCount <= 1}
                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <Minus size={20} />
              </Button>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">{guestCount}</div>
                <div className="text-sm text-gray-400">человек</div>
              </div>
              
              <Button 
                onClick={() => setGuestCount(guestCount + 1)}
                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <Plus size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[2, 4, 6, 8].map((count) => (
            <Button
              key={count}
              onClick={() => setGuestCount(count)}
              variant="outline"
              className="py-3 bg-gray-800 border border-gray-700 rounded-lg font-medium hover:border-orange-500 transition-all"
            >
              {count}
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={() => setScreen("reservation")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Продолжить
        </Button>
      </div>
    );
  }

  if (screen === "reservation") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Бронирование</h2>
          <p className="text-gray-400">Есть ли у гостей бронь?</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => setReservation(true)}
            variant={reservation ? "default" : "outline"}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              reservation 
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" 
                : "bg-gray-800 border border-gray-700 hover:border-orange-500"
            }`}
          >
            Да, есть бронь
          </Button>
          
          <Button
            onClick={() => setReservation(false)}
            variant={!reservation ? "default" : "outline"}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              !reservation 
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" 
                : "bg-gray-800 border border-gray-700 hover:border-orange-500"
            }`}
          >
            Нет брони
          </Button>
        </div>
        
        <Button 
          onClick={() => {
            if (reservation) {
              setScreen("visited-before");
            } else {
              alert(`✅ Гости записаны: ${guestCount}, Бронь: Нет`);
              resetGuestFlow();
              setScreen("guest-flow-start");
            }
          }}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Продолжить
        </Button>
      </div>
    );
  }

  if (screen === "visited-before") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Посещение</h2>
          <p className="text-gray-400">Был ли гость раньше?</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => setVisitedBefore(true)}
            variant={visitedBefore ? "default" : "outline"}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              visitedBefore 
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" 
                : "bg-gray-800 border border-gray-700 hover:border-orange-500"
            }`}
          >
            Да, был раньше
          </Button>
          
          <Button
            onClick={() => setVisitedBefore(false)}
            variant={!visitedBefore ? "default" : "outline"}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              !visitedBefore 
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" 
                : "bg-gray-800 border border-gray-700 hover:border-orange-500"
            }`}
          >
            Нет, первый раз
          </Button>
        </div>
        
        <Button 
          onClick={() => setScreen("guest-name")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Продолжить
        </Button>
      </div>
    );
  }

  if (screen === "guest-name") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Имя гостя</h2>
          <p className="text-gray-400">Введите имя для поиска или создания брони</p>
        </div>
        
        <div className="mb-6">
          <Input 
            type="text" 
            placeholder="Введите имя"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
          />
        </div>
        
        <Button 
          onClick={() => {
            // Mock search results
            setSearchResults([
              {
                id: 1,
                guest_name: guestName,
                phone: "+7 (999) 123-45-67",
                guest_count: 4,
                table_number: "VIP-1",
                deposit_amount: 100.00
              }
            ]);
            setScreen("reservation-card");
          }}
          disabled={!guestName.trim()}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          <ArrowRight className="mr-2" size={20} />
          Найти бронь
        </Button>
      </div>
    );
  }

  if (screen === "reservation-card") {
    const reservation = searchResults[0];
    
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Найденная бронь</h2>
          <p className="text-gray-400">Проверьте данные</p>
        </div>
        
        <Card className="bg-gray-800 rounded-xl mb-6 border border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Имя:</span>
                <span className="font-semibold">{reservation.guest_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Телефон:</span>
                <span className="font-semibold">{reservation.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Гостей:</span>
                <span className="font-semibold">{reservation.guest_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Стол:</span>
                <span className="font-semibold">{reservation.table_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Депозит:</span>
                <span className="font-semibold text-orange-500">₽{reservation.deposit_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => setScreen("came-or-not")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Подтвердить
        </Button>
      </div>
    );
  }

  if (screen === "came-or-not") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Гости Зашли?</h2>
          <p className="text-gray-400">Подтвердите посещение</p>
        </div>
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => setScreen("payment-methods")}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-semibold text-[24px]"
          >Да</Button>
          
          <Button
            onClick={() => setScreen("decline-reason")}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-[24px]"
          >Нет</Button>
        </div>
      </div>
    );
  }

  if (screen === "decline-reason") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Причина отказа</h2>
          <p className="text-gray-400">Укажите причину, почему гость не зашёл</p>
        </div>
        <div className="mb-6">
          <Textarea 
            placeholder="Опишите причину..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all min-h-32"
          />
        </div>
        <Button 
          onClick={() => {
            alert(`❌ Гость не зашёл. Причина: ${declineReason}`);
            resetGuestFlow();
            setScreen("guest-flow-start");
          }}
          disabled={!declineReason.trim()}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          Отправить
        </Button>
      </div>
    );
  }

  if (screen === "shift-dashboard") {
    const formatTime = (date: Date | null) => {
      if (!date) return "Не открыта";
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Панель смены</h2>
          <p className="text-gray-400">Статистика и управление</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Смена открыта в:</span>
                <span className="font-semibold">{formatTime(shiftStartTime)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-500">0</div>
                  <div className="text-xs text-gray-400">Гостей</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-500">₽0</div>
                  <div className="text-xs text-gray-400">Выручка</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-xs text-gray-400">Столов</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          onClick={() => setScreen("guest-flow-start")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <UserPlus className="mr-2" size={20} />
          Добавить гостей
        </Button>
      </div>
    );
  }

  return null;
}
