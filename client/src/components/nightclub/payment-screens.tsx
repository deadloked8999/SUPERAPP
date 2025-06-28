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
import type { Screen } from "@/pages/nightclub-app";

interface PaymentScreensProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  selectedPaymentMethods: string[];
  setSelectedPaymentMethods: (methods: string[]) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  paymentType: string;
  setPaymentType: (type: string) => void;
  amountCash: string;
  setAmountCash: (amount: string) => void;
  amountCard: string;
  setAmountCard: (amount: string) => void;
  ticketAmounts: Record<string, number | string>;
  setTicketAmounts: (amounts: Record<string, number | string>) => void;
  resetGuestFlow: () => void;
}

export default function PaymentScreens({
  screen,
  setScreen,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  depositAmount,
  setDepositAmount,
  paymentType,
  setPaymentType,
  amountCash,
  setAmountCash,
  amountCard,
  setAmountCard,
  ticketAmounts,
  setTicketAmounts,
  resetGuestFlow,
}: PaymentScreensProps) {

  if (screen === "payment-methods") {
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
          payment-screens
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
          onClick={() => {
            if (selectedPaymentMethods.includes("ДЕПОЗИТ")) {
              setScreen("deposit-input");
            } else if (selectedPaymentMethods.includes("БИЛЕТЫ")) {
              setScreen("ticket-select");
            } else {
              resetGuestFlow();
              setScreen("guest-flow-start");
            }
          }}
          disabled={selectedPaymentMethods.length === 0}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          <ArrowRight className="mr-2" size={20} />
          Продолжить
        </Button>
      </div>
    );
  }

  if (screen === "deposit-input") {
    const quickAmounts = [5000, 10000, 15000, 20000, 30000, 50000];

    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Сумма депозита</h2>
          <p className="text-gray-400">Введите сумму предоплаты</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input 
              type="number" 
              placeholder="0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-center text-3xl font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">₽</div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => setDepositAmount(amount.toString())}
              variant="outline"
              className="py-3 bg-gray-800 border border-gray-700 rounded-lg font-medium hover:border-orange-500 transition-all"
            >
              {amount.toLocaleString()}₽
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={() => {
            if (depositAmount && !isNaN(parseFloat(depositAmount)) && parseFloat(depositAmount) > 0) {
              setScreen("deposit-type-select");
            } else {
              alert("⚠️ Введите корректную сумму.");
            }
          }}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Выбрать способ оплаты
        </Button>
      </div>
    );
  }

  if (screen === "deposit-type-select") {
    const paymentTypes = [
      { type: "НАЛ", icon: DollarSign, color: "green" },
      { type: "БЕЗНАЛ", icon: Smartphone, color: "blue" },
      { type: "КОМБО", icon: Coins, color: "purple" },
    ];

    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Способ оплаты</h2>
          <p className="text-gray-400">Выберите метод расчета</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {paymentTypes.map(({ type, icon: Icon, color }) => (
            <Button
              key={type}
              onClick={() => {
                if (type === "КОМБО") {
                  setScreen("combo-cash");
                } else {
                  alert(`✅ Оплата через ${type} подтверждена.`);
                  resetGuestFlow();
                  setScreen("guest-flow-start");
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500 transition-all text-left"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-${color}-500/20 rounded-full flex items-center justify-center mr-4`}>
                  <Icon className={`text-${color}-400`} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{type}</h3>
                  <p className="text-sm text-gray-400">
                    {type === "НАЛ" && "Оплата наличными"}
                    {type === "БЕЗНАЛ" && "Карта, переводы"}
                    {type === "КОМБО" && "Частично нал/безнал"}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "ticket-select") {
    const updateTicketCount = (ticket: string, change: number) => {
      const currentCount = typeof ticketAmounts[ticket] === 'number' ? ticketAmounts[ticket] as number : 0;
      const newCount = Math.max(0, currentCount + change);
      setTicketAmounts({
        ...ticketAmounts,
        [ticket]: newCount
      });
    };

    const total = 
      (ticketAmounts["1000"] as number) * 1000 +
      (ticketAmounts["3000"] as number) * 3000 +
      parseInt(ticketAmounts.custom as string || "0");

    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Выбор билетов</h2>
          <p className="text-gray-400">Выберите тип и количество билетов</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {/* 1000₽ Ticket */}
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Стандартный</h3>
                  <p className="text-orange-500 font-bold">1,000₽</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => updateTicketCount("1000", -1)}
                    className="w-8 h-8 bg-gray-700 rounded-full p-0 hover:bg-gray-600"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center font-bold">{ticketAmounts["1000"]}</span>
                  <Button
                    onClick={() => updateTicketCount("1000", 1)}
                    className="w-8 h-8 bg-orange-500 rounded-full p-0 hover:bg-orange-600"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3000₽ Ticket */}
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">VIP</h3>
                  <p className="text-pink-500 font-bold">3,000₽</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => updateTicketCount("3000", -1)}
                    className="w-8 h-8 bg-gray-700 rounded-full p-0 hover:bg-gray-600"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center font-bold">{ticketAmounts["3000"]}</span>
                  <Button
                    onClick={() => updateTicketCount("3000", 1)}
                    className="w-8 h-8 bg-pink-500 rounded-full p-0 hover:bg-pink-600"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Free Ticket */}
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Бесплатный</h3>
                  <p className="text-green-400 font-bold">FREE</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => updateTicketCount("FREE", -1)}
                    className="w-8 h-8 bg-gray-700 rounded-full p-0 hover:bg-gray-600"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center font-bold">{ticketAmounts["FREE"]}</span>
                  <Button
                    onClick={() => updateTicketCount("FREE", 1)}
                    className="w-8 h-8 bg-green-500 rounded-full p-0 hover:bg-green-600"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Price */}
          <Button 
            onClick={() => setScreen("ticket-nominals")}
            className="w-full bg-gray-800 border border-dashed border-gray-600 rounded-xl p-4 hover:border-orange-500 transition-all"
          >
            <div className="text-center">
              <PlusCircle className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="font-semibold">Свободная цена</p>
            </div>
          </Button>
        </div>

        {/* Total */}
        <Card className="bg-gray-800 rounded-xl mb-6 border border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Итого:</span>
              <span className="text-xl font-bold text-orange-500">{total}₽</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => {
              setTicketAmounts({
                "1000": 0,
                "3000": 0,
                "FREE": 0,
                "custom": ""
              });
            }}
            className="flex-1 py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
          >
            Очистить
          </Button>
          <Button 
            onClick={() => {
              const hasTickets = total > 0 || (ticketAmounts.FREE as number) > 0;
              if (hasTickets) {
                setScreen("ticket-payment-type");
              } else {
                alert("⚠️ Выберите хотя бы один билет.");
              }
            }}
            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Продолжить
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "ticket-nominals") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Свободная цена</h2>
          <p className="text-gray-400">Введите пользовательскую стоимость билета</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input 
              type="number" 
              placeholder="0"
              value={ticketAmounts.custom}
              onChange={(e) => setTicketAmounts({
                ...ticketAmounts,
                custom: e.target.value
              })}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-center text-3xl font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">₽</div>
          </div>
        </div>
        
        <Button 
          onClick={() => setScreen("ticket-select")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Добавить билет
        </Button>
      </div>
    );
  }

  if (screen === "ticket-payment-type") {
    const paymentTypes = [
      { type: "НАЛ", icon: DollarSign, color: "green" },
      { type: "БЕЗНАЛ", icon: Smartphone, color: "blue" },
      { type: "КОМБО", icon: Coins, color: "purple" },
      { type: "CRYPTO", icon: Bitcoin, color: "orange" },
    ];

    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Способ оплаты</h2>
          <p className="text-gray-400">Выберите метод расчета</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {paymentTypes.map(({ type, icon: Icon, color }) => (
            <Button
              key={type}
              onClick={() => {
                setPaymentType(type);
                if (type === "КОМБО") {
                  setScreen("combo-cash");
                } else {
                  alert(`✅ Оплата через ${type}`);
                  resetGuestFlow();
                  setScreen("guest-flow-start");
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500 transition-all text-left"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-${color}-500/20 rounded-full flex items-center justify-center mr-4`}>
                  <Icon className={`text-${color}-400`} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{type}</h3>
                  <p className="text-sm text-gray-400">
                    {type === "НАЛ" && "Оплата наличными"}
                    {type === "БЕЗНАЛ" && "Карта, переводы"}
                    {type === "КОМБО" && "Частично нал/безнал"}
                    {type === "CRYPTO" && "BTC, ETH, USDT"}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "combo-cash") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Сумма наличными</h2>
          <p className="text-gray-400">Введите часть суммы наличными</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input 
              type="number" 
              placeholder="0"
              value={amountCash}
              onChange={(e) => setAmountCash(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-center text-3xl font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">₽</div>
          </div>
        </div>
        
        <Button 
          onClick={() => setScreen("combo-card")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Далее
        </Button>
      </div>
    );
  }

  if (screen === "combo-card") {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Сумма по карте</h2>
          <p className="text-gray-400">Введите часть суммы по карте</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input 
              type="number" 
              placeholder="0"
              value={amountCard}
              onChange={(e) => setAmountCard(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-center text-3xl font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">₽</div>
          </div>
        </div>
        
        <Button 
          onClick={() => setScreen("combo-summary")}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <ArrowRight className="mr-2" size={20} />
          Проверить
        </Button>
      </div>
    );
  }

  if (screen === "combo-summary") {
    const ticketTotal = 
      (ticketAmounts["1000"] as number) * 1000 +
      (ticketAmounts["3000"] as number) * 3000 +
      parseInt(ticketAmounts.custom as string || "0");
    
    const comboTotal = parseInt(amountCash || "0") + parseInt(amountCard || "0");

    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Проверка суммы</h2>
          <p className="text-gray-400">Убедитесь, что суммы совпадают</p>
        </div>
        
        <Card className="bg-gray-800 rounded-xl mb-6 border border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Наличные:</span>
                <span className="font-semibold">{amountCash}₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">По карте:</span>
                <span className="font-semibold">{amountCard}₽</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Итого комбо:</span>
                  <span className="font-semibold text-orange-500">{comboTotal}₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Стоимость билетов:</span>
                  <span className="font-semibold text-pink-500">{ticketTotal}₽</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => {
            if (comboTotal !== ticketTotal) {
              alert("❌ Сумма не совпадает. Пожалуйста, введите правильные данные.");
              setAmountCash("");
              setAmountCard("");
              setScreen("combo-cash");
            } else {
              alert(`✅ Оплата подтверждена:\nНАЛ: ${amountCash}₽\nБЕЗНАЛ: ${amountCard}₽\nИТОГО: ${comboTotal}₽`);
              resetGuestFlow();
              setScreen("guest-flow-start");
            }
          }}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <Check className="mr-2" size={20} />
          Подтвердить оплату
        </Button>
      </div>
    );
  }

  if (screen === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <Check className="text-white" size={40} />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-green-400">Оплата подтверждена!</h2>
        <p className="text-gray-400 mb-8">Гости успешно зарегистрированы</p>
        
        {/* Payment Summary */}
        <Card className="bg-gray-800 rounded-xl mb-8 w-full max-w-md border border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Гостей:</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Сумма:</span>
                <span className="font-semibold text-orange-500">₽15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Способ:</span>
                <span className="font-semibold">Безналичные</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Время:</span>
                  <span className="font-semibold">
                    {new Date().toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => {
            resetGuestFlow();
            setScreen("guest-flow-start");
          }}
          className="w-full max-w-xs py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
        >
          <Plus className="mr-2" size={20} />
          Добавить еще гостей
        </Button>
      </div>
    );
  }

  return null;
}
