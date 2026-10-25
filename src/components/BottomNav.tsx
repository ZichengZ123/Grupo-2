import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  HelpCircle,
  Smartphone,
  Keyboard,
  X,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface BottomNavProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpToSlide: (idx: number) => void;
  slideTitles: string[];
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onJumpToSlide,
  slideTitles,
}) => {
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  // Auto-advance loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoAdvancing) {
      interval = setInterval(() => {
        onNext();
      }, 12000); // 12 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isAutoAdvancing, onNext]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 px-4 py-2.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Previous Button & Slide Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEffects.playSlideChange();
                onPrev();
              }}
              disabled={currentSlide === 0}
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Diapositiva {currentSlide + 1} de {totalSlides}
              </span>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[220px]">
                {slideTitles[currentSlide]}
              </span>
            </div>
          </div>

          {/* Center: Interactive Slide Dots & Mobile Touch Gesture Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 sm:gap-2">
              {slideTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEffects.playSlideChange();
                    onJumpToSlide(idx);
                  }}
                  className={`group relative py-2 px-1 focus:outline-none`}
                  title={title}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx
                        ? 'w-7 sm:w-9 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                        : 'w-2 sm:w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex sm:hidden items-center gap-1 text-[10px] text-slate-500 font-mono">
              <Smartphone className="w-3 h-3 text-cyan-500/70" />
              <span>Desliza para cambiar</span>
            </div>
          </div>

          {/* Right: Next Button & Auto-Play / Shortcuts */}
          <div className="flex items-center gap-2">
            {/* Auto Advance Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsAutoAdvancing(!isAutoAdvancing);
              }}
              className={`p-2 rounded-xl border text-xs font-medium transition flex items-center gap-1 ${
                isAutoAdvancing
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={isAutoAdvancing ? 'Detener pase automático' : 'Pase automático cada 12s'}
            >
              {isAutoAdvancing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />}
              <span className="hidden lg:inline">{isAutoAdvancing ? 'Auto: On' : 'Auto'}</span>
            </button>

            {/* Keyboard shortcuts modal trigger */}
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="hidden sm:flex p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Atajos de teclado y gestos táctiles"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              onClick={() => {
                soundEffects.playSlideChange();
                onNext();
              }}
              disabled={currentSlide === totalSlides - 1}
              className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Keyboard & Touch Gesture Help Modal */}
      {showKeyboardHelp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Navegación y Atajos</h3>
              </div>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-100">Deslizar izquierda / derecha</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Gesto Táctil
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-100">Flecha Derecha / Espacio</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Siguiente
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-100">Flecha Izquierda / Backspace</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Anterior
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-100">Tecla F</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Pantalla Completa
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-100">Tecla L</span>
                <span className="font-mono text-red-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Puntero Láser
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-100">Tecla P</span>
                <span className="font-mono text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Ver PDFs Lab
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
