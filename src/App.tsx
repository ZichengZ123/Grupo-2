/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { STATIONS } from './data/presentationData';
import { SlideHeader } from './components/SlideHeader';
import { IntroSlide } from './components/IntroSlide';
import { StationSlide } from './components/StationSlide';
import { QuizSlide } from './components/QuizSlide';
import { BottomNav } from './components/BottomNav';
import { TouchGestureHandler } from './components/TouchGestureHandler';
import { PdfViewerModal } from './components/PdfViewerModal';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [laserPointerActive, setLaserPointerActive] = useState<boolean>(false);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [activePdfFile, setActivePdfFile] = useState<string | undefined>(undefined);

  // Total slides:
  // 0: Portada
  // 1: MPS Selección (Handling)
  // 2: MPS Posicionamiento (Sorting)
  // 3: Brazo Robot (RV-2AJ)
  // 4: Torno CNC (EMCO)
  // 5: Banco de Preguntas MPS & CNC
  const TOTAL_SLIDES = 6;

  const slideTitles = [
    'Inicio & Equipo UPS',
    '1. MPS Selección (Handling)',
    '2. MPS Posicionamiento (Sorting)',
    '3. Brazo Robot (RV-2AJ)',
    '4. Torno CNC (EMCO PC Turn)',
    'Banco de Preguntas MPS & CNC',
  ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev < TOTAL_SLIDES - 1) {
        soundEffects.playSlideChange();
        return prev + 1;
      }
      return prev;
    });
  }, [TOTAL_SLIDES]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev > 0) {
        soundEffects.playSlideChange();
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleJumpToSlide = useCallback((idx: number) => {
    if (idx >= 0 && idx < TOTAL_SLIDES) {
      soundEffects.playSlideChange();
      setCurrentSlide(idx);
    }
  }, [TOTAL_SLIDES]);

  const handleOpenPdf = (pdfFile: string, pdfName: string) => {
    setActivePdfFile(pdfFile);
    setPdfModalOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if typing in input or text area
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleJumpToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleJumpToSlide(TOTAL_SLIDES - 1);
      } else if (e.key.toLowerCase() === 'l') {
        setLaserPointerActive((prev) => !prev);
      } else if (e.key.toLowerCase() === 'p') {
        setPdfModalOpen(true);
      } else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleJumpToSlide, TOTAL_SLIDES]);

  return (
    <TouchGestureHandler
      onSwipeLeft={handleNext}
      onSwipeRight={handlePrev}
      laserPointerActive={laserPointerActive}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-20">
        {/* Top Slide Header */}
        <SlideHeader
          currentSlide={currentSlide}
          totalSlides={TOTAL_SLIDES}
          onJumpToSlide={handleJumpToSlide}
          laserPointerActive={laserPointerActive}
          onToggleLaser={() => setLaserPointerActive(!laserPointerActive)}
          onOpenPdfModal={() => setPdfModalOpen(true)}
          slideTitles={slideTitles}
        />

        {/* Dynamic Slide Stage */}
        <main className="flex-1 flex flex-col items-center justify-center py-2 sm:py-6">
          {currentSlide === 0 && (
            <IntroSlide
              onStartPresentation={() => handleJumpToSlide(1)}
              onSelectStation={(stIdx) => handleJumpToSlide(stIdx)}
            />
          )}

          {currentSlide === 1 && (
            <StationSlide
              station={STATIONS[0]} // Handling
              onOpenPdf={handleOpenPdf}
            />
          )}

          {currentSlide === 2 && (
            <StationSlide
              station={STATIONS[1]} // Sorting
              onOpenPdf={handleOpenPdf}
            />
          )}

          {currentSlide === 3 && (
            <StationSlide
              station={STATIONS[2]} // Robot
              onOpenPdf={handleOpenPdf}
            />
          )}

          {currentSlide === 4 && (
            <StationSlide
              station={STATIONS[3]} // Torno CNC
              onOpenPdf={handleOpenPdf}
            />
          )}

          {currentSlide === 5 && <QuizSlide />}
        </main>

        {/* Unified Tactile Bottom Dock */}
        <BottomNav
          currentSlide={currentSlide}
          totalSlides={TOTAL_SLIDES}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpToSlide={handleJumpToSlide}
          slideTitles={slideTitles}
        />

        {/* Technical Documentation / PDF Viewer Modal */}
        <PdfViewerModal
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          initialPdfFile={activePdfFile}
        />
      </div>
    </TouchGestureHandler>
  );
}
