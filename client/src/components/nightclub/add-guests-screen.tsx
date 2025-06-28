import { useState } from "react";

interface AddGuestsScreenProps {
  onBack: () => void;
  onSubmit: (men: number, women: number) => void;
}

export default function AddGuestsScreen({ onBack, onSubmit }: AddGuestsScreenProps) {
  const [menCount, setMenCount] = useState<string>("");
  const [womenCount, setWomenCount] = useState<string>("");

  const handleSubmit = () => {
    const men = parseInt(menCount) || 0;
    const women = parseInt(womenCount) || 0;
    
    if (men >= 0 && women >= 0) {
      onSubmit(men, women);
    }
  };

  const isValidInput = (menCount !== "" || womenCount !== "") && 
                       (parseInt(menCount) >= 0 || menCount === "") &&
                       (parseInt(womenCount) >= 0 || womenCount === "");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        add-guests-screen
      </div>
      
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            ДОБАВИТЬ ГОСТЕЙ
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Men count input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide">
              Количество мужчин
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                pattern="[0-9]*"
                inputMode="numeric"
                value={menCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setMenCount(value);
                  }
                }}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter
                  if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                  }
                  // Ensure that it is a number and stop the keypress
                  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                  }
                }}
                placeholder="0"
                className="w-full h-14 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-lg px-4 focus:outline-none focus:border-orange-500/60 transition-all duration-300"
              />
            </div>
          </div>

          {/* Women count input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide">
              Количество женщин
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                pattern="[0-9]*"
                inputMode="numeric"
                value={womenCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setWomenCount(value);
                  }
                }}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter
                  if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                  }
                  // Ensure that it is a number and stop the keypress
                  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                  }
                }}
                placeholder="0"
                className="w-full h-14 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-lg px-4 focus:outline-none focus:border-orange-500/60 transition-all duration-300"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={handleSubmit}
                disabled={!isValidInput}
                className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                  isValidInput
                    ? 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="uppercase tracking-wide">
                    ДОБАВИТЬ ГОСТЕЙ
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <button 
            onClick={onBack}
            className="text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200"
          >
            ← Назад к смене
          </button>
        </div>
      </div>
    </div>
  );
}