import React, { useState, useEffect } from 'react';
import { CIM_INTEGRATION_FLOW, STATIONS } from '../data/presentationData';
import {
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface IntegrationFlowSlideProps {
  onSelectStation: (index: number) => void;
}

export const IntegrationFlowSlide: React.FC<IntegrationFlowSlideProps> = ({ onSelectStation }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
        soundEffects.playSlideChange();
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const currentFlow = CIM_INTEGRATION_FLOW.find((f) => f.step === activeStep) || CIM_INTEGRATION_FLOW[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase">
              Célula de Manufactura CIM
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Integración de Procesos
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Flujo de Comunicación e Integración Inter-Estaciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Coordinación secuencial entre la alimentación neumática, la clasificación por sensor inductivo, el transfer robótico de 5 ejes y el torneado CNC.
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsSimulating(!isSimulating);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isSimulating ? 'Pausar Simulación' : 'Simular Ciclo CIM'}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveStep(1);
              setIsSimulating(false);
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
            title="Reiniciar a Estación 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive 4-Station Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CIM_INTEGRATION_FLOW.map((item) => {
          const isActive = item.step === activeStep;
          return (
            <div
              key={item.step}
              onClick={() => {
                soundEffects.playClick();
                setActiveStep(item.step);
              }}
              className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between border ${
                isActive
                  ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    0{item.step}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Activo Ahora
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {item.title}
                </h3>
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  {item.equipment}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={isActive ? 'text-cyan-400 font-medium' : 'text-slate-500'}>
                  Paso {item.step} de 4
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Current Step Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Detailed Action Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                Paso 0{currentFlow.step} en Tiempo Real
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentFlow.equipment}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {currentFlow.title}
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 uppercase font-mono mb-1 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Operación Cinemática y Secuencia
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentFlow.action}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs font-bold text-amber-400 uppercase font-mono mb-1 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4" />
                  Intercambio de Señales I/O y Handshake
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentFlow.dataExchange}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 uppercase font-mono mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Disparo de Sensores y Confirmación de Estado
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentFlow.sensorTrigger}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              ¿Deseas profundizar en esta estación?
            </span>
            <button
              onClick={() => onSelectStation(currentFlow.step)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition flex items-center gap-1.5"
            >
              <span>Ver Modelado y Sensores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Comparative Technical Matrix */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Cuadro Comparativo de Arquitectura
              </h3>
            </div>

            <div className="space-y-3">
              {STATIONS.map((st) => (
                <div
                  key={st.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    st.number === activeStep
                      ? 'bg-slate-950 border-cyan-500/60 ring-1 ring-cyan-500/20'
                      : 'bg-slate-950/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">
                      {st.shortName}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {st.keySpecs.precision.split(' ')[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Control: </span>
                      <span className="text-slate-300 font-medium">
                        {st.controllers[0].model.split('/')[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Vel: </span>
                      <span className="text-slate-300 font-medium">
                        {st.keySpecs.speed.split('/')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <strong>Arquitectura CIM UPS:</strong> Totalmente descentralizada con buses industriales MPI / Profibus y lazos cerrados para máxima fiabilidad.
          </div>
        </div>
      </div>
    </div>
  );
};
