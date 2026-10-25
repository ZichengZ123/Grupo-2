import React, { useState } from 'react';
import { STATIONS } from '../data/presentationData';
import {
  X,
  FileText,
  ExternalLink,
  Download,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPdfFile?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  initialPdfFile,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(
    initialPdfFile
      ? STATIONS.find((s) => s.pdfFile === initialPdfFile)?.id || STATIONS[0].id
      : STATIONS[0].id
  );
  const [activeTab, setActiveTab] = useState<'pages' | 'embed'>('pages');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentStation = STATIONS.find((s) => s.id === selectedStationId) || STATIONS[0];
  const totalPhotos = currentStation.photos?.length || 0;
  const safePhotoIdx = totalPhotos > 0 ? Math.min(selectedPhotoIdx, totalPhotos - 1) : 0;
  const currentPhoto = totalPhotos > 0 ? currentStation.photos[safePhotoIdx] : '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Documentación Técnica & Manuales de Laboratorio
              </h3>
              <p className="text-xs text-slate-400">
                PDF oficial analizado: <strong className="text-slate-200">{currentStation.pdfName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentStation.pdfFile}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
              title="Abrir en pestaña completa"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pestaña Nueva</span>
            </a>

            <a
              href={currentStation.pdfFile}
              download={currentStation.pdfName}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 flex items-center gap-1.5 transition shadow-sm"
              title="Descargar archivo PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Selector Bar & View Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900/90">
          {/* Station pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {STATIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedStationId(st.id);
                  setSelectedPhotoIdx(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition flex items-center gap-1.5 ${
                  selectedStationId === st.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{st.shortName}</span>
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('pages');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'pages'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Fotos del PDF</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('embed');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'embed'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Visor PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 w-full h-full bg-slate-950 relative overflow-hidden flex flex-col">
          {activeTab === 'pages' ? (
            <div className="w-full h-full p-4 flex flex-col justify-between">
              {/* Photo Viewport */}
              <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                {currentPhoto && (
                  <img
                    src={currentPhoto}
                    alt={`Página de ${currentStation.pdfName}`}
                    className="max-h-full max-w-full object-contain shadow-2xl"
                  />
                )}

                {/* Left / Right arrows */}
                {totalPhotos > 1 && (
                  <>
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedPhotoIdx((prev) =>
                          prev === 0 ? totalPhotos - 1 : prev - 1
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 transition"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-3.5 py-1 rounded-full text-xs font-mono text-cyan-300">
                  Fotografía #{safePhotoIdx + 1} de {totalPhotos} — {currentStation.shortName}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {totalPhotos > 0 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1" data-prevent-swipe>
                  {currentStation.photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedPhotoIdx(idx);
                      }}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        safePhotoIdx === idx
                          ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <iframe
                src={`${currentStation.pdfFile}#view=FitH`}
                title={currentStation.pdfName}
                className="w-full h-full border-0 rounded-xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
