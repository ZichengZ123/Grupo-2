import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Timer,
  Award,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  Calendar,
  Search,
  RotateCcw,
  ShieldCheck,
  Flame,
  UserCheck
} from 'lucide-react';
import {
  LeaderboardEntry,
  subscribeToLeaderboard
} from '../services/leaderboardService';

interface LeaderboardProps {
  highlightId?: string | null;
  onStartQuiz?: () => void;
  compact?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  highlightId,
  onStartQuiz,
  compact = false,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((updatedEntries, isLoading) => {
      setEntries(updatedEntries);
      setLoading(isLoading);
    });

    return () => unsubscribe();
  }, []);

  const filteredEntries = entries.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getDeviceIcon = (device?: string) => {
    if (device === 'Móvil') return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />;
    if (device === 'Tablet') return <Tablet className="w-3.5 h-3.5 text-emerald-400" />;
    return <Laptop className="w-3.5 h-3.5 text-blue-400" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-500/20">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          1.º Lugar
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-300/20 text-slate-200 border border-slate-300/30">
          <Medal className="w-3.5 h-3.5 text-slate-300" />
          2.º Lugar
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-700/20 text-amber-400 border border-amber-600/30">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          3.º Lugar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
        #{rank}
      </span>
    );
  };

  // Stats calculation
  const totalParticipants = entries.length;
  const bestScore = totalParticipants > 0 ? entries[0].score : 0;
  const bestTime = totalParticipants > 0 ? entries[0].timeSeconds : 0;
  const avgScore = totalParticipants > 0
    ? (entries.reduce((acc, curr) => acc + curr.score, 0) / totalParticipants).toFixed(1)
    : '0';

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Header bar with Firebase indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-title text-base sm:text-lg font-bold text-white tracking-wide">
                Ranking Oficial de Evaluación
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Clasificación ponderada por respuestas correctas (máx. 6) y menor tiempo
            </p>
          </div>
        </div>

        {/* Global summary stats */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="text-slate-400 text-[10px] block">PARTICIPANTES</span>
            <span className="font-bold text-white text-sm">{totalParticipants}</span>
          </div>
          {totalParticipants > 0 && (
            <>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <span className="text-slate-400 text-[10px] block">RÉCORD</span>
                <span className="font-bold text-amber-400 text-sm">
                  {bestScore}/6 <span className="text-[11px] text-slate-400">({bestTime}s)</span>
                </span>
              </div>
              <div className="hidden md:block px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <span className="text-slate-400 text-[10px] block">PROMEDIO</span>
                <span className="font-bold text-cyan-300 text-sm">{avgScore} / 6</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter / Search input when there are participants */}
      {totalParticipants > 0 && (
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar participante por nombre..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Main Content Area: Empty state or entries list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
          <p className="text-sm text-slate-400 font-mono">Sincronizando con base de datos Firebase...</p>
        </div>
      ) : entries.length === 0 ? (
        /* Empty State as requested: "pero ahora está vacío porque nadie se registró aún" */
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800 shadow-inner">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800/80 to-cyan-500/10 flex items-center justify-center border border-slate-700/80 shadow-lg">
              <Trophy className="w-10 h-10 text-amber-400/80" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-slate-700">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Tablero Inicial en Vivo
          </span>

          <h4 className="text-lg sm:text-xl font-title font-bold text-white mb-2">
            La Tabla de Posiciones Está Vacía
          </h4>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6 font-sans">
            Aún no se ha registrado ningún estudiante o participante en esta sesión. Los resultados de cada usuario se sincronizan en tiempo real mediante Firebase Firestore.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md mb-6 text-left">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Criterio 1</div>
              <div className="text-xs font-semibold text-white mt-0.5">Máx. 6 Aciertos</div>
              <div className="text-[10px] text-slate-400">Estaciones MPS y CNC</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Criterio 2</div>
              <div className="text-xs font-semibold text-white mt-0.5">Tiempo en Segundos</div>
              <div className="text-[10px] text-slate-400">Desempate por velocidad</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Criterio 3</div>
              <div className="text-xs font-semibold text-white mt-0.5">Cualquier Dispositivo</div>
              <div className="text-[10px] text-slate-400">Móvil, tablet o PC</div>
            </div>
          </div>

          {onStartQuiz && (
            <button
              onClick={onStartQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-title text-sm font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              ¡Sé el Primero en Registrarte y Liderar el Ranking!
            </button>
          )}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="py-10 text-center bg-slate-900/40 rounded-xl border border-slate-800">
          <p className="text-sm text-slate-400 font-mono">
            No se encontraron participantes que coincidan con "{searchQuery}".
          </p>
        </div>
      ) : (
        /* Entries Table / Cards */
        <div className="space-y-2">
          {filteredEntries.map((entry, index) => {
            const rank = index + 1;
            const isHighlighted = highlightId === entry.id;
            const percentage = Math.round((entry.score / entry.totalQuestions) * 100);

            return (
              <div
                key={entry.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 gap-3 ${
                  isHighlighted
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                    : rank === 1
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400/60'
                    : rank === 2
                    ? 'bg-slate-800/40 border-slate-600/40 hover:border-slate-500/60'
                    : rank === 3
                    ? 'bg-amber-900/15 border-amber-700/30 hover:border-amber-600/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Left: Rank & Participant Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0">{getRankBadge(rank)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-title font-bold text-white text-sm sm:text-base truncate tracking-wide">
                        {entry.name}
                      </span>
                      {isHighlighted && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500 text-slate-950">
                          Tu intento
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {entry.createdAt ? entry.createdAt.split('T')[0] : 'Hoy'}
                      </span>
                      {entry.device && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
                          • {getDeviceIcon(entry.device)}
                          {entry.device}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Metrics (Score, Time, Accuracy) */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Accuracy Bar / Badge */}
                  <div className="flex flex-col items-start sm:items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white">
                        {entry.score} / {entry.totalQuestions}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          percentage >= 80
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : percentage >= 50
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Puntuación</span>
                  </div>

                  {/* Elapsed Time */}
                  <div className="flex flex-col items-start sm:items-end min-w-[70px]">
                    <div className="flex items-center gap-1 text-cyan-300 font-mono font-bold text-sm">
                      <Timer className="w-3.5 h-3.5 text-cyan-400" />
                      {entry.timeSeconds}s
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Tiempo Total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security & Authenticity Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400 px-2 pt-2 border-t border-slate-800/60">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Base de Datos Verificada: Firestore Cloud Rules v2
        </span>
        <span>Universidad Politécnica Salesiana • Grupo 2</span>
      </div>
    </div>
  );
};
