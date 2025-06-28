import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  Ticket, 
  Gift, 
  DollarSign, 
  Smartphone, 
  Coins, 
  Bitcoin,
  ArrowRight,
  Check,
  Plus,
  Minus,
  PlusCircle
} from "lucide-react";

interface PaymentScreenProps {
  onFinish: () => void;
}

export default function PaymentScreen({ onFinish }: PaymentScreenProps) {
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const togglePaymentMethod = (method: string) => {
    if (selectedPaymentMethods.includes(method)) {
      setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== method));
    } else {
      setSelectedPaymentMethods([...selectedPaymentMethods, method]);
    }
  };

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
        payment-screen
      </div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Способ оплаты</h2>
        <p className="text-gray-400">Выберите один или несколько вариантов</p>
      </div>
      
      <div className="space-y-4 mb-8">
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPaymentMethods.includes("ДЕПОЗИТ") 
              ? "border-orange-500 bg-gray-800" 
              : "border-gray-700 bg-gray-800 hover:border-orange-500"
          }`}
          onClick={() => togglePaymentMethod("ДЕПОЗИТ")}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="text-orange-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Депозит</h3>
                <p className="text-sm text-gray-400">Предоплата за стол</p>
              </div>
              <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                {selectedPaymentMethods.includes("ДЕПОЗИТ") && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPaymentMethods.includes("БИЛЕТЫ") 
              ? "border-pink-500 bg-gray-800" 
              : "border-gray-700 bg-gray-800 hover:border-orange-500"
          }`}
          onClick={() => togglePaymentMethod("БИЛЕТЫ")}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mr-4">
                <Ticket className="text-pink-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Билеты</h3>
                <p className="text-sm text-gray-400">Входные билеты</p>
              </div>
              <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                {selectedPaymentMethods.includes("БИЛЕТЫ") && (
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPaymentMethods.includes("БЕСПЛАТНО") 
              ? "border-green-500 bg-gray-800" 
              : "border-gray-700 bg-gray-800 hover:border-orange-500"
          }`}
          onClick={() => togglePaymentMethod("БЕСПЛАТНО")}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                <Gift className="text-green-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Бесплатный проход</h3>
                <p className="text-sm text-gray-400">Без оплаты</p>
              </div>
              <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                {selectedPaymentMethods.includes("БЕСПЛАТНО") && (
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button 
        onClick={onFinish}
        disabled={selectedPaymentMethods.length === 0}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
      >
        <ArrowRight className="mr-2" size={20} />
        Завершить
      </Button>
    </div>
  );
} 