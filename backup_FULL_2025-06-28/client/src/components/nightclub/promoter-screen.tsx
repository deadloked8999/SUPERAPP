interface PromoterScreenProps {
  onBack: () => void;
  onOpenShift: () => void;
  onCloseShift: () => void;
  isShiftOpen: boolean;
}

export default function PromoterScreen({ onBack, onOpenShift, onCloseShift, isShiftOpen }: PromoterScreenProps) {
  const buttons = [
    "ОТКРЫТЬ СМЕНУ"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        promoter-screen
      </div>
      
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            ПРОМОУТЕР
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
        </div>

        {/* Main buttons */}
        <div className="space-y-4">
          {buttons.map((buttonText, index) => {
            const isOrange = index % 2 === 0;
            const isOpenShift = buttonText === "ОТКРЫТЬ СМЕНУ";
            
            // Determine if button should be disabled
            const isDisabled = isOpenShift && isShiftOpen;
            
            return (
              <div key={buttonText} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button
                  onClick={isOpenShift ? onOpenShift : undefined}
                  disabled={isDisabled}
                  className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed border-gray-600/30'
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