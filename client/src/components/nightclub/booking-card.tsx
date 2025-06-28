import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Minus, ArrowRight, UserPlus, BarChart3, Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface BookingCardProps {
  onPayClick: () => void;
}

export default function BookingCard({ onPayClick }: BookingCardProps) {
  const [guestCount, setGuestCount] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [reservation, setReservation] = useState(false);

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
        booking-card
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Бронирование</h2>
        <p className="text-gray-400">Заполните данные гостей</p>
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

      {/* Guest Name Input */}
      <Card className="bg-gray-800 rounded-xl mb-6 border border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Имя гостя</label>
              <Input 
                type="text"
                placeholder="Введите имя"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Есть ли бронь?</label>
              <div className="space-y-2">
                <Button
                  onClick={() => setReservation(true)}
                  variant={reservation ? "default" : "outline"}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    reservation 
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" 
                      : "bg-gray-700 border border-gray-600 hover:border-orange-500"
                  }`}
                >
                  Да, есть бронь
                </Button>
                
                <Button
                  onClick={() => setReservation(false)}
                  variant={!reservation ? "default" : "outline"}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    !reservation 
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" 
                      : "bg-gray-700 border border-gray-600 hover:border-orange-500"
                  }`}
                >
                  Нет брони
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button 
        onClick={onPayClick}
        disabled={!guestName.trim()}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
      >
        <ArrowRight className="mr-2" size={20} />
        Перейти к оплате
      </Button>
    </div>
  );
} 