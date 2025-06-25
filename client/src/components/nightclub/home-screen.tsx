import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BarChart3, User, Play, Square } from "lucide-react";
import type { Role, Screen } from "@/pages/nightclub-app";

interface HomeScreenProps {
  selectedRole: Role | null;
  onNavigate: (screen: Screen) => void;
  shiftOpen: boolean;
  setShiftOpen: (open: boolean) => void;
  onShiftOpen?: () => void;
  onShiftClose?: () => void;
}

export default function HomeScreen({ 
  selectedRole, 
  onNavigate, 
  shiftOpen, 
  setShiftOpen,
  onShiftOpen,
  onShiftClose
}: HomeScreenProps) {
  const handleToggleShift = () => {
    if (shiftOpen) {
      // Closing shift
      setShiftOpen(false);
      if (onShiftClose) {
        onShiftClose();
      }
    } else {
      // Opening shift
      setShiftOpen(true);
      if (onShiftOpen) {
        onShiftOpen();
      }
      onNavigate("shift-dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        home-screen
      </div>
      
      <div className="p-4 space-y-4">
        <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
          home-screen
        </div>

        {/* User Profile Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-pink-600 p-6 shadow-2xl">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
          <div className="relative flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <User size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                {selectedRole?.title || "Администратор"}
              </h2>
              <p className="text-white/80 text-sm font-medium">
                {new Date().toLocaleDateString('ru-RU')} • {new Date().toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${shiftOpen ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}></div>
          </div>
        </div>

        {/* Shift Control */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Управление сменой</h3>
              <p className="text-sm text-gray-400">
                {shiftOpen ? "Смена активна" : "Смена не начата"}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              shiftOpen ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {shiftOpen ? "Открыта" : "Закрыта"}
            </div>
          </div>
          
          <Button 
            onClick={handleToggleShift}
            className={`w-full rounded-2xl py-4 font-semibold text-base transition-all duration-300 transform active:scale-95 ${
              shiftOpen 
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25" 
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {shiftOpen ? (
                <>
                  <Square size={18} />
                  <span>Закрыть смену</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>Открыть смену</span>
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate("guest-flow-start")}
            disabled={!shiftOpen}
            className={`group relative p-6 rounded-2xl border transition-all duration-300 transform ${
              shiftOpen 
                ? 'bg-gray-900/50 border-gray-700 hover:border-orange-500/50 hover:bg-gray-800/50 active:scale-95 hover:shadow-lg hover:shadow-orange-500/10' 
                : 'bg-gray-900/30 border-gray-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                shiftOpen 
                  ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 group-hover:from-orange-500/30 group-hover:to-orange-600/30' 
                  : 'bg-gray-800/50 border border-gray-700'
              }`}>
                <Users size={24} className={`${shiftOpen ? 'text-orange-400' : 'text-gray-500'} transition-colors duration-300`} />
              </div>
              <span className={`font-medium text-sm ${shiftOpen ? 'text-white' : 'text-gray-500'}`}>
                Гости
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => onNavigate("shift-dashboard")}
            disabled={!shiftOpen}
            className={`group relative p-6 rounded-2xl border transition-all duration-300 transform ${
              shiftOpen 
                ? 'bg-gray-900/50 border-gray-700 hover:border-pink-500/50 hover:bg-gray-800/50 active:scale-95 hover:shadow-lg hover:shadow-pink-500/10' 
                : 'bg-gray-900/30 border-gray-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                shiftOpen 
                  ? 'bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 group-hover:from-pink-500/30 group-hover:to-pink-600/30' 
                  : 'bg-gray-800/50 border border-gray-700'
              }`}>
                <BarChart3 size={24} className={`${shiftOpen ? 'text-pink-400' : 'text-gray-500'} transition-colors duration-300`} />
              </div>
              <span className={`font-medium text-sm ${shiftOpen ? 'text-white' : 'text-gray-500'}`}>
                Статистика
              </span>
            </div>
          </button>
        </div>

        {/* Stats Dashboard */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Статистика сегодня</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                <Users size={20} className="text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {shiftOpen ? "12" : "0"}
              </div>
              <div className="text-xs text-gray-400 font-medium">Гостей</div>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-pink-600/30 transition-all duration-300">
                <span className="text-pink-400 font-bold text-lg">₽</span>
              </div>
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {shiftOpen ? "45K" : "0"}
              </div>
              <div className="text-xs text-gray-400 font-medium">Выручка</div>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                <BarChart3 size={20} className="text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {shiftOpen ? "8" : "0"}
              </div>
              <div className="text-xs text-gray-400 font-medium">Столов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
