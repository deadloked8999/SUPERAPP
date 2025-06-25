import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdminScreenProps {
  onBack: () => void;
  isShiftOpen: boolean;
  shiftStartTime: Date | null;
  shiftEndTime: Date | null;
  onOpenShift: () => void;
  onCloseShift: () => void;
  onEmergency: () => void;
  onChats: () => void;
}

export default function AdminScreen({ 
  onBack, 
  isShiftOpen, 
  shiftStartTime, 
  shiftEndTime, 
  onOpenShift, 
  onCloseShift,
  onEmergency,
  onChats
}: AdminScreenProps) {

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let result = '';
    if (hours > 0) {
      const hourWord = hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов';
      result += `${hours} ${hourWord}`;
    }
    if (minutes > 0) {
      if (result) result += ' ';
      const minuteWord = minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут';
      result += `${minutes} ${minuteWord}`;
    }
    if (!result) result = '0 минут';
    
    return result;
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black">
      <div className="flex flex-col justify-center min-h-[calc(100vh-4rem)] p-6 relative">
        <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-6 text-center">
          admin-screen
        </div>

        {/* Background decoration similar to other screens */}
        <div className="absolute top-20 left-6 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-8 w-24 h-24 bg-gradient-to-tl from-pink-500/10 to-orange-500/10 rounded-full blur-2xl"></div>

        <div className="w-full max-w-sm mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-4">
              АДМИНИСТРАТОР
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
          </div>

          {/* Admin action buttons */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={onOpenShift}
                disabled={isShiftOpen}
                className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                  isShiftOpen 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25'
                }`}
              >
                <div className="flex items-center justify-start space-x-3 pl-4">
                  <span className="uppercase tracking-wide">
                    ОТКРЫТЬ СМЕНУ
                  </span>
                </div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={isShiftOpen ? onChats : undefined}
                disabled={!isShiftOpen}
                className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                  isShiftOpen 
                    ? 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-start space-x-3 pl-4">
                  <span className="uppercase tracking-wide">
                    ЧАТЫ
                  </span>
                </div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                disabled={!isShiftOpen}
                onClick={onCloseShift}
                className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                  isShiftOpen 
                    ? 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-start space-x-3 pl-4">
                  <span className="uppercase tracking-wide">
                    ЗАКРЫТЬ СМЕНУ
                  </span>
                </div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                disabled={!isShiftOpen}
                className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                  isShiftOpen 
                    ? 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-start space-x-3 pl-4">
                  <span className="uppercase tracking-wide">
                    СТАТИСТИКА
                  </span>
                </div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={isShiftOpen ? onEmergency : undefined}
                disabled={!isShiftOpen}
                className={`group relative w-full h-16 bg-red-600/80 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                  isShiftOpen 
                    ? 'hover:border-red-400/60 hover:bg-red-600/90 hover:shadow-xl hover:shadow-red-500/25 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-start space-x-3 pl-4">
                  <span className="uppercase tracking-wide">
                    ТРЕВОГА
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Shift information card */}
          <div className="bg-neutral-900 rounded-xl px-4 py-3 mt-[17px] mb-[17px]">
            <div className="space-y-2">
              {shiftStartTime && (
                <div className="text-sm text-neutral-400">
                  <span className="text-neutral-300">Смена открыта:</span> {formatDateTime(shiftStartTime)}
                </div>
              )}
              {shiftEndTime && (
                <div className="text-sm text-neutral-400">
                  <span className="text-neutral-300">Смена закрыта:</span> {formatDateTime(shiftEndTime)}
                </div>
              )}
              {shiftStartTime && shiftEndTime && (
                <div className="text-sm text-neutral-400">
                  <span className="text-neutral-300">Время работы:</span> {calculateDuration(shiftStartTime, shiftEndTime)}
                </div>
              )}
              {!shiftStartTime && !shiftEndTime && (
                <div className="text-sm text-neutral-400 text-center">
                  Смена не открыта
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}