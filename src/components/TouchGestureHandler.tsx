import React, { useEffect, useRef, useState } from 'react';

interface TouchGestureHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
  laserPointerActive: boolean;
}

export const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
  laserPointerActive,
}) => {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  const isInteractiveTarget = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    // Don't intercept swipe when user is dragging inside the 3D canvas or sliders or inputs
    return !!target.closest('canvas, input, button, select, [data-prevent-swipe]');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (laserPointerActive) {
      const touch = e.touches[0];
      setLaserPos({ x: touch.clientX, y: touch.clientY });
      return;
    }

    if (isInteractiveTarget(e.target)) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (laserPointerActive) {
      const touch = e.touches[0];
      setLaserPos({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (laserPointerActive) {
      setLaserPos(null);
      return;
    }

    if (isInteractiveTarget(e.target)) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX.current;
    const dy = touchEndY - touchStartY.current;
    const duration = Date.now() - touchStartTime.current;

    // Must be horizontal gesture (> 60px distance, horizontal > 1.5x vertical, within 800ms)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && duration < 800) {
      if (dx < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  };

  // Also support mouse-based laser pointer if active
  useEffect(() => {
    if (!laserPointerActive) {
      setLaserPos(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setLaserPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [laserPointerActive]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen select-none"
    >
      {children}

      {/* Presentation Laser Pointer */}
      {laserPointerActive && laserPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: laserPos.x, right: 'auto', top: laserPos.y }}
        >
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_16px_4px_rgba(239,68,68,0.9)] ring-2 ring-red-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
    </div>
  );
};
