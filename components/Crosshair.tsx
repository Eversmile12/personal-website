"use client";

import { useEffect, useRef } from "react";

export default function Crosshair() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.style.cursor = "none";

    let rafId: number;

    function onMouseMove(e: MouseEvent) {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        cursor!.style.opacity = "1";
      }
    }

    function onMouseLeave() {
      visible.current = false;
      cursor!.style.opacity = "0";
    }

    function tick() {
      cursor!.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] opacity-0"
      style={{ willChange: "transform" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cursor.png"
        alt=""
        width={12}
        height={18}
        className="block"
        draggable={false}
      />
    </div>
  );
}
