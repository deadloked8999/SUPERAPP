import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";



interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div 
      className="h-screen w-screen bg-cover bg-center bg-no-repeat bg-black relative overflow-hidden"
      style={{
        backgroundImage: `url("/src/assets/1111.png")`
      }}
    >
      <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
        welcome-screen
      </div>
      {/* Subtle moving gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 -right-32 w-80 h-80 bg-pink-600/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/2 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/20 rounded-full animate-bounce"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 8)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i * 0.5)}s`
            }}
          ></div>
        ))}
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-10">
        
        {/* Spacer for top third */}
        <div className="flex-1"></div>
        
        {/* Central content area */}
        <div className="flex flex-col items-center space-y-16">
          
          {/* Typography section */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-extralight text-white tracking-[0.3em] mb-4">WELCOME</h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
            </div>
          </div>

          {/* Action button with modern styling */}
          <div className="w-full max-w-xs text-[12px] mt-[9px] mb-[9px] pt-[0px] pb-[0px] pl-[106px] pr-[106px] font-normal">
            <button
              onClick={onStart}
              className="group relative w-full h-16 overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-800/90 to-zinc-700/90 border border-zinc-600/30 transition-all duration-700 ease-out hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 active:scale-95"
            >
              {/* Background animation on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/20 group-hover:to-pink-500/20 transition-all duration-700"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-center h-full">
                <span className="text-xl font-light text-zinc-300 group-hover:text-white tracking-[0.2em] transition-all duration-500">
                  ВОЙТИ
                </span>
              </div>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse"></div>
              </div>
            </button>
          </div>
          
        </div>
        
        {/* Spacer for bottom third */}
        <div className="flex-1"></div>
        
      </div>
    </div>
  );
}
