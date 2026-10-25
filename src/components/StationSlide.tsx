import React, { useState, useEffect } from 'react';
import { StationData } from '../types/presentation';
import { ThreeScene } from './ThreeScene';
import {
  Box,
  Video,
  Image as ImageIcon,
  Cpu,
  Activity,
  Gauge,
  Zap,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle,
  FileText,
  Clock,
  Compass,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface StationSlideProps {
  station: StationData;
  onOpenPdf: (pdfFile: string, pdfName: string) => void;
}

export const StationSlide: React.FC<StationSlideProps> = ({ station, onOpenPdf }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video' | 'photos'>('3d');
  const [activeInfoTab, setActiveInfoTab] = useState<'controllers' | 'actuators' | 'sensors'>('controllers');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Reset photo index when station changes
  useEffect(() => {
    setSelectedPhotoIdx(0);
  }, [station.id]);

  const totalPhotos = station.photos && station.photos.length > 0 ? station.photos.length : 0;
  const safePhotoIdx = totalPhotos > 0 ? Math.min(selectedPhotoIdx, totalPhotos - 1) : 0;
  const currentPhoto = totalPhotos > 0 ? station.photos[safePhotoIdx] : '';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6 animate-fadeIn">
      {/* Station Title & Key Spec Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase">
              {station.orderTitle}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Estación #{station.number}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {station.name}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            {station.subtitle}
          </p>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Precisión
            </span>
            <span className="text-xs font-bold text-cyan-300 truncate mt-0.5" title={station.keySpecs.precision}>
              {station.keySpecs.precisionBadge}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" />
              Velocidad
            </span>
            <span className="text-xs font-bold text-amber-300 truncate mt-0.5" title={station.keySpecs.speed}>
              {station.keySpecs.speedBadge}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              Fuerza/Pot.
            </span>
            <span className="text-xs font-bold text-emerald-300 truncate mt-0.5" title={station.keySpecs.pressureForce}>
              {station.keySpecs.forceBadge}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" />
              Tiempo Ciclo
            </span>
            <span className="text-xs font-bold text-purple-300 truncate mt-0.5" title={station.keySpecs.cycleTime}>
              {station.keySpecs.cycleBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Media & Technical Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Interactive Viewport (3D, Video, Photos) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Media Switcher Tab Bar */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveMediaTab('3d');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeMediaTab === '3d'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Simulador 3D</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveMediaTab('video');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeMediaTab === 'video'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Real Lab</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveMediaTab('photos');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeMediaTab === 'photos'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Galería ({station.photos.length})</span>
              </button>
            </div>

            <button
              onClick={() => onOpenPdf(station.pdfFile, station.pdfName)}
              className="px-2.5 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
              title="Abrir PDF original del manual de laboratorio"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver PDF Oficial</span>
            </button>
          </div>

          {/* Viewport Content */}
          <div className="w-full">
            {activeMediaTab === '3d' && (
              <ThreeScene
                modelType={station.threeModelType}
                title={station.shortName}
              />
            )}

            {activeMediaTab === 'video' && (
              <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-center items-center">
                <video
                  src={station.videoSrc}
                  poster={station.posterSrc}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 border border-slate-700/60 px-3 py-1 rounded-full text-xs font-mono text-cyan-300">
                  Grabación Real en Laboratorio Mecatrónica UPS
                </div>
              </div>
            )}

            {activeMediaTab === 'photos' && (
              <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col p-4">
                {/* Main Large Photo */}
                <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-black/60 flex items-center justify-center group">
                  {currentPhoto ? (
                    <img
                      src={currentPhoto}
                      alt={`Foto ${safePhotoIdx + 1} de ${station.name}`}
                      className="max-h-full max-w-full object-contain cursor-zoom-in transition transform group-hover:scale-[1.02] duration-300"
                      onClick={() => setLightboxOpen(true)}
                      loading="eager"
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-8 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
                      <p className="text-sm">Sin imágenes disponibles</p>
                    </div>
                  )}

                  {/* Top Overlays */}
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 shadow-md">
                    Foto {safePhotoIdx + 1} de {totalPhotos}
                  </div>

                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 transition shadow-md"
                    title="Ampliar imagen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Prev / Next photo buttons */}
                  {totalPhotos > 1 && (
                    <>
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          setSelectedPhotoIdx((prev) =>
                            prev === 0 ? totalPhotos - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-cyan-500 hover:text-slate-950 transition shadow-lg"
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          setSelectedPhotoIdx((prev) =>
                            prev === totalPhotos - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-cyan-500 hover:text-slate-950 transition shadow-lg"
                        aria-label="Foto siguiente"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {totalPhotos > 0 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1" data-prevent-swipe>
                    {station.photos.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEffects.playClick();
                          setSelectedPhotoIdx(idx);
                        }}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                          safePhotoIdx === idx
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30 opacity-100 scale-105'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Technical Specifications & Decomposition */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Info Sub-tabs: Controladores, Motores y Actuadores, Sensores */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveInfoTab('controllers');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeInfoTab === 'controllers'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Control</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveInfoTab('actuators');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeInfoTab === 'actuators'
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Actuadores</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveInfoTab('sensors');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeInfoTab === 'sensors'
                  ? 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Sensores</span>
            </button>
          </div>

          {/* Scrollable Container for Technical Decomposition matching viewport */}
          <div className="max-h-[460px] overflow-y-auto pr-1 flex flex-col gap-3.5">
            {/* Tab 1: Controladores */}
            {activeInfoTab === 'controllers' && (
              <div className="flex flex-col gap-3.5">
              {station.controllers.map((ctrl, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4.5 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                        {ctrl.title}
                      </h4>
                      <span className="text-xs font-mono text-cyan-400/90 font-medium">
                        {ctrl.model}
                      </span>
                    </div>
                    {ctrl.executionSpeed && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 font-mono text-[10px] shrink-0">
                        {ctrl.executionSpeed}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ctrl.description}
                  </p>

                  {ctrl.signals && (
                    <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                      <strong className="text-slate-300">Señales:</strong> {ctrl.signals}
                    </div>
                  )}

                  {ctrl.highlights && ctrl.highlights.length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {ctrl.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Motores y Actuadores */}
          {activeInfoTab === 'actuators' && (
            <div className="flex flex-col gap-3.5">
              {station.actuators.map((act, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4.5 flex flex-col gap-2.5"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                      {act.title}
                    </h4>
                    <span className="text-xs font-mono text-amber-400/90 font-medium">
                      {act.model}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Specs Table */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {act.specs.map((sp, spIdx) => (
                      <div
                        key={spIdx}
                        className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/90"
                      >
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          {sp.label}
                        </div>
                        <div className="text-xs font-bold text-slate-100 mt-0.5">
                          {sp.value}
                        </div>
                        {sp.detail && (
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            {sp.detail}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Sensores */}
          {activeInfoTab === 'sensors' && (
            <div className="flex flex-col gap-3.5">
              {station.sensors.map((sens, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4.5 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                        {sens.title}
                      </h4>
                      <span className="text-xs font-mono text-emerald-400/90 font-medium">
                        {sens.type}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-mono text-[10px] shrink-0">
                      {sens.responseTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sens.description}
                  </p>

                  <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    <strong className="text-slate-300">Rango / Alcance:</strong> {sens.range}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Lightbox for zooming photos */}
      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={currentPhoto}
              alt="Laboratorio MPS"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-4 text-slate-300 text-sm">
              <span>
                Foto {safePhotoIdx + 1} de {totalPhotos} — {station.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(false);
                }}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
              >
                Cerrar (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
