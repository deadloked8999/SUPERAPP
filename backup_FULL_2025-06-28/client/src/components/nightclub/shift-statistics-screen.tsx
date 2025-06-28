import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, DollarSign, Calendar } from "lucide-react";

export default function ShiftStatisticsScreen() {
  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
        shift-statistics-screen
      </div>
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Смена завершена</h2>
        <p className="text-gray-400">Итоги работы за смену</p>
      </div>

      {/* Shift Duration */}
      <Card className="bg-gray-800 border border-gray-700 rounded-xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                <Clock className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Продолжительность смены</h3>
                <p className="text-gray-400">Время работы</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">5ч 30мин</div>
              <div className="text-sm text-gray-400">18:00 - 23:30</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                  <Users className="text-orange-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Обслужено гостей</h3>
                  <p className="text-sm text-gray-400">Всего за смену</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-500">24</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Общая выручка</h3>
                  <p className="text-sm text-gray-400">Депозиты + билеты</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-400">₽85,000</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-gray-800 border border-gray-700 rounded-xl mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Детальная статистика</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Депозиты:</span>
              <span className="font-semibold text-orange-500">₽65,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Билеты:</span>
              <span className="font-semibold text-pink-500">₽20,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Столов занято:</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Средний чек:</span>
              <span className="font-semibold">₽3,542</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Message */}
      <Card className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl border-0">
        <CardContent className="p-6 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Отличная работа!</h3>
          <p className="text-white/80">Смена успешно завершена. Спасибо за вашу работу.</p>
        </CardContent>
      </Card>
    </div>
  );
}