import React, { useState, useEffect } from 'react';
import {
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Trophy,
} from 'lucide-react';
import { UNIVERSITY_INFO } from '../data/presentationData';
import { soundEffects } from '../utils/audio';

interface SlideHeaderProps {
  currentSlide: number;
  totalSlides: number;
  onJumpToSlide: (idx: number) => void;
  laserPointerActive: boolean;
  onToggleLaser: () => void;
  onOpenPdfModal: () => void;
  slideTitles: string[];
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({
  currentSlide,
  totalSlides,
  onJumpToSlide,
  laserPointerActive,
  onToggleLaser,
  onOpenPdfModal,
  slideTitles,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleFullscreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: UPS Academic Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-sm tracking-tight shadow-md shadow-amber-500/20">
            UPS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-amber-400 font-mono">
                {UNIVERSITY_INFO.group}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-slate-300">
                {UNIVERSITY_INFO.career}
              </span>
            </div>
            <h1 className="text-sm font-semibold text-slate-100 truncate max-w-[280px] sm:max-w-md">
              {UNIVERSITY_INFO.topic}
            </h1>
          </div>
        </div>

        {/* Center: Slide Jump Pills (hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {slideTitles.map((title, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playSlideChange();
                onJumpToSlide(idx);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                currentSlide === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {idx === 0 ? 'Inicio' : idx === slideTitles.length - 1 ? 'Quiz' : `S${idx}`}
            </button>
          ))}
        </div>

        {/* Right: Presentation Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Ranking / Leaderboard Direct Shortcut */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onJumpToSlide(totalSlides - 1);
            }}
            className="p-2 rounded-lg bg-slate-900/80 text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 transition flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Ver Ranking Oficial (Firebase Firestore)"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ranking</span>
          </button>

          {/* Laser Pointer Mode */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleLaser();
            }}
            className={`p-2 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
              laserPointerActive
                ? 'bg-red-500/20 text-red-400 border-red-500/60 ring-1 ring-red-500/40'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Puntero Láser Virtual (Para proyectores y presentaciones)"
          >
            <Zap className="w-4 h-4 text-red-400" />
            <span className="hidden md:inline">Láser</span>
          </button>

          {/* View Original Lab PDFs */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenPdfModal();
            }}
            className="p-2 rounded-lg bg-slate-900/80 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition flex items-center gap-1 text-xs font-medium"
            title="Ver los 4 manuales y reportes en PDF del laboratorio"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">PDFs</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition"
            title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos de sonido'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
