export const ditherFragmentShader = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_texture2;
uniform vec2 u_textureSize;
uniform vec2 u_textureSize2;
uniform float u_mix; // 0 = texture1, 1 = texture2

// --- 8x8 Bayer ordered dithering matrix ---
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

// Cover: fill viewport, center-crop excess. Works for any aspect ratio.
vec2 coverUV(vec2 uv, vec2 imgSize, float screenAspect) {
  float imageAspect = imgSize.x / imgSize.y;
  vec2 texUV = uv;

  if (screenAspect > imageAspect) {
    // Screen wider: fit width, crop top/bottom
    float scale = screenAspect / imageAspect;
    texUV.y = (texUV.y - 0.5) / scale + 0.5;
  } else {
    // Screen taller: fit height, crop sides
    float scale = imageAspect / screenAspect;
    texUV.x = (texUV.x - 0.5) / scale + 0.5;
  }

  texUV.y = 1.0 - texUV.y;
  return texUV;
}

float sampleLum(sampler2D tex, vec2 uv) {
  vec4 c = texture(tex, uv);
  return dot(c.rgb, vec3(0.299, 0.587, 0.114)) * c.a;
}

void main() {
  // --- Big pixel quantization ---
  float pixelSize = 6.0;
  vec2 cell = floor(gl_FragCoord.xy / pixelSize);
  vec2 cellUV = cell * pixelSize / u_resolution;

  // --- Slow drift animation ---
  vec2 drift = vec2(
    sin(u_time * 0.2) * 0.015,
    cos(u_time * 0.15) * 0.01
  );
  vec2 driftedUV = cellUV + drift;

  float screenAspect = u_resolution.x / u_resolution.y;

  // Sample both textures with cover-fit
  vec2 uv1 = coverUV(driftedUV, u_textureSize, screenAspect);
  float lum1 = sampleLum(u_texture, uv1);

  vec2 uv2 = coverUV(driftedUV, u_textureSize2, screenAspect);
  float lum2 = sampleLum(u_texture2, uv2);

  // Crossfade luminance
  float lum = mix(lum1, lum2, u_mix);
  lum = clamp(lum, 0.0, 1.0);

  // --- Apply Bayer dithering ---
  float threshold = getBayer(ivec2(cell));
  float dithered = step(threshold, lum);

  vec3 bgColor = vec3(0.18, 0.18, 0.18);
  vec3 dotColor = vec3(0.60, 0.60, 0.60);
  vec3 color = mix(bgColor, dotColor, dithered);

  fragColor = vec4(color, 1.0);
}
`;
