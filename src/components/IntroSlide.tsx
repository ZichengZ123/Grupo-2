import React from 'react';
import {
  UNIVERSITY_INFO,
  TEAM_MEMBERS,
} from '../data/presentationData';
import {
  Play,
  ArrowRight,
  GraduationCap,
  Users,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface IntroSlideProps {
  onStartPresentation: () => void;
  onSelectStation?: (index: number) => void;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({
  onStartPresentation,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 animate-fadeIn">
      {/* Hero Banner with University Branding */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                {UNIVERSITY_INFO.institution}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                {UNIVERSITY_INFO.group}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
              {UNIVERSITY_INFO.academicPeriod}
            </span>
          </div>

          <div>
            <div className="text-xs sm:text-sm font-semibold tracking-wider text-cyan-400 uppercase font-mono mb-2">
              {UNIVERSITY_INFO.course}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Estaciones MPS y Manufactura Automatizada
            </h1>
          </div>

          {/* Academic Direction & Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 bg-slate-950/70 px-4 py-3 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tutor de Cátedra</div>
                <div className="text-sm font-bold text-slate-100">{UNIVERSITY_INFO.tutor}</div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                onStartPresentation();
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Integrantes del Equipo — {UNIVERSITY_INFO.group}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {TEAM_MEMBERS.length} Integrantes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/50 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800/90 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700 font-mono">
                0{i + 1}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-200 tracking-wide">
                  {member.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
