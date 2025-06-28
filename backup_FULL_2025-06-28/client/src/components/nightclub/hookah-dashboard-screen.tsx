interface HookahDashboardScreenProps {
  onBack: () => void;
  onMenu: () => void;
  onCloseShift: () => void;
}

export default function HookahDashboardScreen({ onBack, onMenu, onCloseShift }: HookahDashboardScreenProps) {
  const buttons = [
    "МЕНЮ",
    "СТАТИСТИКА", 
    "ЗАКРЫТЬ СМЕНУ"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        hookah-dashboard-screen
      </div>
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl tracking-tight uppercase font-extralight">ПАНЕЛЬ УПРАВЛЕНИЯ</h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
        </div>

        {/* Main buttons */}
        <div className="space-y-4">
          {buttons.map((buttonText, index) => {
            const isOrange = index % 2 === 0;
            const isMenu = buttonText === "МЕНЮ";
            const isCloseShift = buttonText === "ЗАКРЫТЬ СМЕНУ";
            
            return (
              <div key={buttonText} className="relative">
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isCloseShift 
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20'
                    : 'bg-gradient-to-r from-orange-500/20 to-pink-500/20'
                }`}></div>
                <button
                  onClick={isMenu ? onMenu : isCloseShift ? onCloseShift : undefined}
                  className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                    isCloseShift
                      ? 'hover:border-red-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-red-500/25'
                      : isOrange
                        ? 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25'
                        : 'hover:border-pink-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-pink-500/25'
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <div className="flex items-center justify-start space-x-3 pl-4">
                    <span className="uppercase tracking-wide">
                      {buttonText}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
  );
}