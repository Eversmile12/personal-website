"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { createProgram, setupFullscreenQuad } from "@/lib/webgl";
import { ditherVertexShader } from "@/shaders/dither.vert";
import { ditherFragmentShader } from "@/shaders/dither.frag";

const DISPLAY_DURATION = 6;
export const FADE_DURATION = 2;

interface HeroSource {
  type: "video" | "image";
  src: string;
}

interface LoadedSource {
  texture: WebGLTexture;
  width: number;
  height: number;
  video?: HTMLVideoElement;
}

export interface DitherCanvasHandle {
  next: () => void;
  prev: () => void;
}

const DitherCanvas = forwardRef<DitherCanvasHandle, { sources: HeroSource[] }>(
  function DitherCanvas({ sources: HERO_SOURCES }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const manualIndex = useRef<number | null>(null);
    const manualPrev = useRef(0);
    const manualTime = useRef(0);
    const visibleIndex = useRef(0);

    useImperativeHandle(ref, () => ({
      next: () => {
        const total = HERO_SOURCES.length;
        if (total <= 1) return;
        manualPrev.current = visibleIndex.current;
        manualIndex.current = (visibleIndex.current + 1) % total;
        manualTime.current = performance.now();
      },
      prev: () => {
        const total = HERO_SOURCES.length;
        if (total <= 1) return;
        manualPrev.current = visibleIndex.current;
        manualIndex.current = (visibleIndex.current - 1 + total) % total;
        manualTime.current = performance.now();
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext("webgl2", {
        antialias: false,
        alpha: false,
      });

      if (!gl) {
        canvas.dataset.webglFailed = "true";
        return;
      }

      const program = createProgram(
        gl,
        ditherVertexShader,
        ditherFragmentShader
      );
      if (!program) return;

      const vao = setupFullscreenQuad(gl, program);
      if (!vao) return;

      gl.useProgram(program);

      const uResolution = gl.getUniformLocation(program, "u_resolution");
      const uTime = gl.getUniformLocation(program, "u_time");
      const uTexture = gl.getUniformLocation(program, "u_texture");
      const uTexture2 = gl.getUniformLocation(program, "u_texture2");
      const uTextureSize = gl.getUniformLocation(program, "u_textureSize");
      const uTextureSize2 = gl.getUniformLocation(program, "u_textureSize2");
      const uMix = gl.getUniformLocation(program, "u_mix");

      let animationId: number;
      let startTime = performance.now();
      const sources: LoadedSource[] = [];
      let loadedCount = 0;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      function initTexture(): WebGLTexture {
        const tex = gl!.createTexture()!;
        gl!.bindTexture(gl!.TEXTURE_2D, tex);
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_WRAP_S,
          gl!.CLAMP_TO_EDGE
        );
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_WRAP_T,
          gl!.CLAMP_TO_EDGE
        );
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_MIN_FILTER,
          gl!.LINEAR
        );
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_MAG_FILTER,
          gl!.LINEAR
        );
        return tex;
      }

      function uploadImage(tex: WebGLTexture, source: TexImageSource) {
        gl!.bindTexture(gl!.TEXTURE_2D, tex);
        gl!.texImage2D(
          gl!.TEXTURE_2D,
          0,
          gl!.RGBA,
          gl!.RGBA,
          gl!.UNSIGNED_BYTE,
          source
        );
      }

      function resize() {
        const dpr = Math.min(window.devicePixelRatio, 2.0);
        canvas!.width = canvas!.clientWidth * dpr;
        canvas!.height = canvas!.clientHeight * dpr;
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
      }

      function updateVideoTexture(src: LoadedSource) {
        if (src.video && src.video.readyState >= src.video.HAVE_CURRENT_DATA) {
          gl!.bindTexture(gl!.TEXTURE_2D, src.texture);
          gl!.texImage2D(
            gl!.TEXTURE_2D,
            0,
            gl!.RGBA,
            gl!.RGBA,
            gl!.UNSIGNED_BYTE,
            src.video
          );
        }
      }

      function render() {
        if (loadedCount < HERO_SOURCES.length) {
          animationId = requestAnimationFrame(render);
          return;
        }

        const now = performance.now();
        const time = prefersReducedMotion ? 0 : (now - startTime) / 1000;

        let currentIndex: number;
        let nextIndex: number;
        let mixValue = 0;

        if (manualIndex.current !== null) {
          // Manual navigation: crossfade from previous slide to selected slide
          currentIndex = manualIndex.current;
          nextIndex = manualPrev.current;
          const elapsed = (now - manualTime.current) / 1000;
          if (elapsed < FADE_DURATION) {
            // Still transitioning: mix=1 shows prev, mix=0 shows target
            mixValue = 1.0 - elapsed / FADE_DURATION;
            mixValue = mixValue * mixValue * (3 - 2 * mixValue);
          } else if (elapsed > DISPLAY_DURATION) {
            // Resume auto-cycle from this point
            startTime =
              now -
              currentIndex *
                (DISPLAY_DURATION + FADE_DURATION) *
                1000;
            manualIndex.current = null;
          }
        }

        if (manualIndex.current === null) {
          // Auto-cycle
          const cycleDuration = DISPLAY_DURATION + FADE_DURATION;
          const totalCycle = cycleDuration * sources.length;
          const t = time % totalCycle;

          currentIndex = Math.floor(t / cycleDuration) % sources.length;
          nextIndex = (currentIndex + 1) % sources.length;
          const timeInSlide = t - currentIndex * cycleDuration;

          if (sources.length > 1 && timeInSlide > DISPLAY_DURATION) {
            mixValue = (timeInSlide - DISPLAY_DURATION) / FADE_DURATION;
            mixValue = mixValue * mixValue * (3 - 2 * mixValue);
          }
        }

        visibleIndex.current = currentIndex!;

        const curr = sources[currentIndex!];
        const next = sources[nextIndex!];

        if (curr.video) updateVideoTexture(curr);
        if (next.video) updateVideoTexture(next);

        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, curr.texture);
        gl!.uniform1i(uTexture, 0);
        gl!.uniform2f(uTextureSize, curr.width, curr.height);

        gl!.activeTexture(gl!.TEXTURE1);
        gl!.bindTexture(gl!.TEXTURE_2D, next.texture);
        gl!.uniform1i(uTexture2, 1);
        gl!.uniform2f(uTextureSize2, next.width, next.height);

        gl!.uniform1f(uMix, mixValue);
        gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
        gl!.uniform1f(uTime, time);

        gl!.bindVertexArray(vao);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);

        animationId = requestAnimationFrame(render);
      }

      // Load all sources
      HERO_SOURCES.forEach((entry, i) => {
        if (entry.type === "video") {
          const video = document.createElement("video");
          video.src = entry.src;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.crossOrigin = "anonymous";

          const tex = initTexture();
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0])
          );

          video.addEventListener("loadeddata", () => {
            sources[i] = {
              texture: tex,
              width: video.videoWidth,
              height: video.videoHeight,
              video,
            };
            video.play();
            loadedCount++;
          });

          video.load();
        } else {
          const img = new Image();
          img.onload = () => {
            const tex = initTexture();
            uploadImage(tex, img);
            sources[i] = {
              texture: tex,
              width: img.naturalWidth,
              height: img.naturalHeight,
            };
            loadedCount++;
          };
          img.src = entry.src;
        }
      });

      resize();
      render();

      window.addEventListener("resize", resize);

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resize);
        sources.forEach((s) => {
          gl.deleteTexture(s.texture);
          if (s.video) {
            s.video.pause();
            s.video.src = "";
          }
        });
        gl.deleteProgram(program);
        gl.deleteVertexArray(vao);
      };
    }, [HERO_SOURCES]);

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    );
  }
);

export default DitherCanvas;
