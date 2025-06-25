import { AlertTriangle } from "lucide-react";

interface EmergencyScreenProps {
  onDisconnectAll: () => void;
  onBackToMain: () => void;
}

export default function EmergencyScreen({ onDisconnectAll, onBackToMain }: EmergencyScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        emergency-screen
      </div>
      
      <div className="w-full max-w-md space-y-8">
        {/* Emergency Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-red-600/20 rounded-3xl flex items-center justify-center border border-red-500/30 backdrop-blur-sm">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight uppercase text-red-500">
            ТРЕВОГА
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
          
          <p className="text-gray-400 text-base leading-relaxed">
            Экстренное управление системой
          </p>
        </div>

        {/* Emergency action buttons */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              onClick={onDisconnectAll}
              className="group relative w-full h-16 bg-red-600/80 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 hover:border-red-400/60 hover:bg-red-600/90 hover:shadow-xl hover:shadow-red-500/25"
            >
              <div className="flex items-center justify-center">
                <span className="uppercase tracking-wide">
                  ОТКЛЮЧИТЬ ВСЕХ
                </span>
              </div>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              onClick={onBackToMain}
              className="group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25"
            >
              <div className="flex items-center justify-center">
                <span className="uppercase tracking-wide">
                  ВЕРНУТЬСЯ НА ГЛАВНУЮ
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Warning message */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-center">
          <p className="text-red-400 text-sm">
            Внимание! Действия на этой странице могут повлиять на работу всей системы.
          </p>
        </div>
      </div>
    </div>
  );
}