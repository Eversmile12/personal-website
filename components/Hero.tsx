"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DitherCanvas, { DitherCanvasHandle, FADE_DURATION } from "./DitherCanvas";

interface HeroSource {
  type: "video" | "image";
  src: string;
}

export default function Hero({ sources }: { sources: HeroSource[] }) {
  const canvasRef = useRef<DitherCanvasHandle>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const navigate = useCallback((dir: "next" | "prev") => {
    if (transitioning) return;
    canvasRef.current?.[dir]();
    setTransitioning(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTransitioning(false), FADE_DURATION * 1000);
  }, [transitioning]);

  useEffect(() => {
    const canvas = document.querySelector("canvas[data-webgl-failed]");
    if (canvas) setWebglFailed(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* WebGL background */}
      {!webglFailed ? (
        <DitherCanvas ref={canvasRef} sources={sources} />
      ) : (
        <div
          className="absolute inset-0 bg-bg"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23222'/%3E%3Crect x='4' y='4' width='1' height='1' fill='%23222'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "8px 8px",
          }}
        />
      )}

      {/* Content overlay */}
      <div className="relative z-10 text-center">
        <h1 className="font-sans text-5xl font-bold tracking-tight text-text-primary md:text-7xl">
          Vittorio Rivabella
        </h1>
        <p className="mt-4 font-mono text-sm tracking-widest text-text-primary uppercase md:text-base">
          Engineer / AI Researcher / Speaker
        </p>
      </div>

      {/* Prev / Next buttons */}
      {sources.length > 1 && (
        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2 opacity-0 animate-[fadeIn_1s_ease_.5s_forwards]">
          <button
            onClick={() => navigate("prev")}
            disabled={transitioning}
            className="flex h-8 w-8 items-center justify-center border border-text-primary/50 text-text-primary/80 transition-colors hover:border-text-primary hover:text-text-primary disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => navigate("next")}
            disabled={transitioning}
            className="flex h-8 w-8 items-center justify-center border border-text-primary/50 text-text-primary/80 transition-colors hover:border-text-primary hover:text-text-primary disabled:pointer-events-none"
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 z-10 w-full flex justify-center opacity-0 animate-[fadeIn_1s_ease_.5s_forwards]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-9 w-6 rounded-full border-2 border-text-primary"
            style={{ position: "relative" }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full bg-text-primary"
              style={{ position: "absolute", top: 6, left: "50%", marginLeft: -3 }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-text-primary uppercase">
            Scroll down
          </span>
        </div>
      </div>
    </section>
  );
}
