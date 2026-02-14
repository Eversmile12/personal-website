"use client";

import { useEffect } from "react";

export default function ConsoleEasterEgg() {
  useEffect(() => {
    const art = `
%c██╗   ██╗██╗████████╗████████╗ ██████╗ ██████╗ ██╗ ██████╗
██║   ██║██║╚══██╔══╝╚══██╔══╝██╔═══██╗██╔══██╗██║██╔═══██╗
██║   ██║██║   ██║      ██║   ██║   ██║██████╔╝██║██║   ██║
╚██╗ ██╔╝██║   ██║      ██║   ██║   ██║██╔══██╗██║██║   ██║
 ╚████╔╝ ██║   ██║      ██║   ╚██████╔╝██║  ██║██║╚██████╔╝
  ╚═══╝  ╚═╝   ╚═╝      ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝

%c  ░░░ Engineer / AI Researcher / Speaker ░░░

%c  Hey, you're looking at the source. Nice.
  This site is built with Next.js + vanilla WebGL2 shaders.
  The dithering uses an 8×8 Bayer ordered matrix.
  No Three.js — just a fullscreen quad and GLSL.

  → twitter.com/vittostack
  → github.com/Eversmile12
`;

    console.log(
      art,
      "color: #f0f0f0; font-family: monospace; font-size: 10px; line-height: 1.2;",
      "color: #888888; font-family: monospace; font-size: 11px;",
      "color: #555555; font-family: monospace; font-size: 11px;"
    );
  }, []);

  return null;
}
