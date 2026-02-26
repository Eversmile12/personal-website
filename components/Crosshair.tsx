"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input[type='submit'], select, summary";

export default function Crosshair() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLImageElement>(null);
  const pointerRef = useRef<HTMLImageElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const offset = useRef({ x: 0, y: 0 });
  const visible = useRef(false);
  const hovering = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const arrow = arrowRef.current;
    const pointer = pointerRef.current;
    if (!cursor || !arrow || !pointer) return;

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

      const target = e.target as HTMLElement;
      const isInteractive = target.closest(INTERACTIVE) !== null;

      if (isInteractive !== hovering.current) {
        hovering.current = isInteractive;
        if (isInteractive) {
          arrow!.style.display = "none";
          pointer!.style.display = "block";
          offset.current = { x: -6, y: 0 };
        } else {
          arrow!.style.display = "block";
          pointer!.style.display = "none";
          offset.current = { x: 0, y: 0 };
        }
      }
    }

    function onMouseLeave() {
      visible.current = false;
      cursor!.style.opacity = "0";
    }

    function tick() {
      cursor!.style.transform = `translate(${pos.current.x + offset.current.x}px, ${pos.current.y + offset.current.y}px)`;
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
        ref={arrowRef}
        src="/cursor.png"
        alt=""
        width={12}
        height={18}
        className="block"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={pointerRef}
        src="/pointer.svg"
        alt=""
        width={16}
        height={21}
        style={{ display: "none" }}
        draggable={false}
      />
    </div>
  );
}
