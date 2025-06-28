import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Minus, ArrowRight, UserPlus, BarChart3 } from "lucide-react";

interface GuestsScreenProps {
  onBookingClick: () => void;
}

export default function GuestsScreen({ onBookingClick }: GuestsScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
      <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
        guests-screen
      </div>
      <div className="text-6xl mb-6">
        <Users className="mx-auto text-orange-500" size={96} />
      </div>
      <h2 className="text-2xl font-bold mb-4">Работа с гостями</h2>
      <p className="text-gray-400 mb-8">Добавление нового гостя или группы</p>
      
      <Button 
        onClick={onBookingClick}
        className="w-full max-w-xs py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="mr-2" size={20} />
        Добавить гостей
      </Button>
      
      <Button 
        onClick={() => console.log("Back to dashboard")}
        className="bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl py-3 w-full max-w-sm mx-auto mt-4"
      >
        На главную
      </Button>
    </div>
  );
} 