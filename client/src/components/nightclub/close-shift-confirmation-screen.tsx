interface CloseShiftConfirmationScreenProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CloseShiftConfirmationScreen({ onConfirm, onCancel }: CloseShiftConfirmationScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        close-shift-confirmation-screen
      </div>
      
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            ВЫ УВЕРЕНЫ?
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
        </div>

        {/* Confirmation buttons */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              onClick={onConfirm}
              className="group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 hover:border-red-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-red-500/25"
            >
              <div className="flex items-center justify-center">
                <span className="uppercase tracking-wide">
                  ДА
                </span>
              </div>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              onClick={onCancel}
              className="group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25"
            >
              <div className="flex items-center justify-center">
                <span className="uppercase tracking-wide">
                  НЕТ
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}