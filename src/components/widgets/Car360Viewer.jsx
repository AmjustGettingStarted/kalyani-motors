import React, { useEffect, useRef, useState } from "react";

const Car360Viewer = ({ frames, fallbackImage, alt }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startFrame = useRef(0);

  // Reset rotation when car/color changes
  useEffect(() => {
    setCurrentFrame(0);
  }, [frames]);

  // Preload frames
  useEffect(() => {
    if (!frames || frames.length === 0) return;

    // Load first frame immediately
    const firstImage = new Image();
    firstImage.src = frames[0];

    // Load remaining frames shortly after
    const timer = setTimeout(() => {
      frames.slice(1).forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [frames]);

  // No 360 available → fallback image
  if (!frames || frames.length === 0) {
    return (
      <img
        src={fallbackImage}
        alt={alt}
        draggable="false"
        className="w-full h-full object-contain object-center select-none"
      />
    );
  }

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startFrame.current = currentFrame;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    const delta = e.clientX - startX.current;

    // Lower = more sensitive
    const pixelsPerFrame = 8;

    const framesMoved = Math.round(delta / pixelsPerFrame);

    let nextFrame = startFrame.current - framesMoved;

    nextFrame = ((nextFrame % frames.length) + frames.length) % frames.length;

    setCurrentFrame(nextFrame);
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerCancel = (e) => {
    isDragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <img
        src={frames[currentFrame]}
        alt={alt}
        draggable="false"
        className="w-full h-full object-contain object-center pointer-events-none select-none"
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="px-4 py-2 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
          Drag to rotate
        </span>
      </div>
    </div>
  );
};

export default Car360Viewer;
