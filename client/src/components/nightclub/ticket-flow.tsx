import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Ticket, ArrowRight, Home } from "lucide-react";

interface TicketFlowProps {
  onRestart: () => void;
}

export default function TicketFlow({ onRestart }: TicketFlowProps) {
  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
        ticket-flow
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/25">
          <CheckCircle size={48} className="text-white" />
        </div>
        
        {/* Success Message */}
        <h2 className="text-3xl font-bold text-white mb-4">Успешно!</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          Гости успешно добавлены и оплата произведена
        </p>
        
        {/* Summary Card */}
        <Card className="bg-gray-800 rounded-2xl border border-gray-700 mb-8 w-full max-w-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Количество гостей:</span>
                <span className="text-white font-semibold">2 человека</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Способ оплаты:</span>
                <span className="text-white font-semibold">Депозит</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Сумма:</span>
                <span className="text-orange-400 font-bold text-lg">₽15,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <Button 
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="mr-2" size={20} />
            На главную
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-4 border border-gray-600 text-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-400 transition-all duration-300"
          >
            <Ticket className="mr-2" size={20} />
            Добавить еще гостей
          </Button>
        </div>
      </div>
    </div>
  );
} 