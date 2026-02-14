"use client";

import { useEffect, useRef } from "react";
import { createProgram, setupFullscreenQuad } from "@/lib/webgl";
import { ditherVertexShader } from "@/shaders/dither.vert";
import { imageDitherFragmentShader } from "@/shaders/imageDither.frag";

interface DitheredImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function DitheredImage({
  src,
  alt,
  width,
  height,
  className = "",
}: DitheredImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      fallbackRef.current = true;
      return;
    }

    const program = createProgram(
      gl,
      ditherVertexShader,
      imageDitherFragmentShader
    );
    if (!program) return;

    const vao = setupFullscreenQuad(gl, program);
    if (!vao) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const dpr = Math.min(window.devicePixelRatio, 2.0);
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      // Create texture
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );

      // Set uniforms
      const uTexture = gl.getUniformLocation(program, "u_texture");
      const uResolution = gl.getUniformLocation(program, "u_resolution");
      gl.uniform1i(uTexture, 0);
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      // Single draw
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    img.src = src;

    return () => {
      gl.deleteProgram(program);
      gl.deleteVertexArray(vao);
    };
  }, [src, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
      role="img"
      aria-label={alt}
    />
  );
}
