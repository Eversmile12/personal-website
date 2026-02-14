export const imageDitherFragmentShader = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_texture;
uniform vec2 u_resolution;

// 8x8 Bayer ordered dithering matrix
const int bayerMatrix[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayer(ivec2 coord) {
  int x = coord.x & 7;
  int y = coord.y & 7;
  return float(bayerMatrix[y * 8 + x]) / 64.0;
}

void main() {
  // Large pixel quantization (matching hero)
  float pixelSize = 3.5;
  vec2 cell = floor(gl_FragCoord.xy / pixelSize);
  vec2 cellUV = cell * pixelSize / u_resolution;
  cellUV.y = 1.0 - cellUV.y;

  vec4 texColor = texture(u_texture, cellUV);
  float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114)) * texColor.a;
  lum = clamp(lum, 0.0, 1.0);

  // Bayer dithering
  float threshold = getBayer(ivec2(cell));
  float dithered = step(threshold, lum);

  // Match hero colors
  vec3 bgColor = vec3(0.18, 0.18, 0.18);
  vec3 dotColor = vec3(0.60, 0.60, 0.60);
  vec3 color = mix(bgColor, dotColor, dithered);

  fragColor = vec4(color, 1.0);
}
`;
