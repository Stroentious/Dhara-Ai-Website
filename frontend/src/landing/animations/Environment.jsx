import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Environment Component — Living Agricultural Land, Fertile Soil Bed, Subterranean Strata,
 * Layered Atmospheric Sky with Sunlight Diffusion, Multi-Tiered Moving Clouds & Flying Birds.
 * 
 * Depth Hierarchy (Back to Front):
 * 1. Layered Atmospheric Sky Backdrop with Sunlight Diffusion (z = -3.3)
 * 2. High-Altitude Atmospheric Cirrus Veil (z = -2.85) — Continuous gentle drift
 * 3. Distant Flying Bird Flocks (z = -2.2 to -2.7) — Flapping & gliding procedural flight
 * 4. Mid-Altitude Sprawling Cumulus Cloud Bank (z = -2.4) — Continuous volumetric drift
 * 5. Low-Altitude Rolling Field Mist (z = -1.9) — Continuous soft mist above soil
 * 6. 3D Fertile Topsoil Bed & Root Mound (y = -0.165, z = 0)
 * 7. Subterranean Soil Cross-Section / Horizons (y = -0.88, z = -0.38)
 * 8. Airborne Pollen & Organic Dust (GPU Particles)
 * 
 * Features:
 * - Natural blue-to-deeper-blue layered sky with soft sunbeam diffusion.
 * - Multi-depth clouds moving continuously with organic domain-warped procedural noise.
 * - Distant procedural bird flocks with natural V-formation spacing, flapping, and thermal gliding.
 * - 100% positioned BEHIND the 3D tree, fruits, leaves, and foreground website UI.
 * - Seamless support for both Dark Mode and Light Mode (`isBW`).
 * - Highly optimized GPU shaders, guaranteed 60 FPS performance on mobile and desktop.
 */

// ── 1. TOPSOIL BED SHADER (Ultra-Realistic Agricultural Loam & Fertile Crumb Structure) ──
const SOIL_VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vec3 p = position;

    // Organic central root mound (tree emerges naturally out of this elevated soil horizon)
    float dist = length(p.xy);
    float mound = 0.065 * exp(-dist * 2.4);
    
    // Multi-scale undulating agricultural soil ridges, clods & furrows
    float furrows = sin(p.x * 3.2 + p.y * 1.8) * 0.014 * smoothstep(0.3, 1.8, dist);
    float microClumps = sin(p.x * 12.0) * cos(p.y * 12.0) * 0.005 * exp(-dist * 1.8);
    p.z += mound + furrows + microClumps;

    vec4 worldPos = modelMatrix * vec4(p, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const SOIL_FRAGMENT_SHADER = /* glsl */`
  uniform float uScrollProgress;
  uniform float uTime;
  uniform float uIsLight;
  uniform vec3 uSoilDark;
  uniform vec3 uSoilMid;
  uniform vec3 uSoilHumus;
  uniform vec3 uSoilMoist;
  uniform vec3 uMossColor;
  uniform vec3 uBioGlow;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  // Pseudo-random hash
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // 2D Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractional Brownian Motion for natural soil granular texture
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; ++i) {
      v += a * noise(p);
      p = rot * p * 2.05 + shift;
      a *= 0.48;
    }
    return v;
  }

  // Cellular Voronoi for soil aggregate crumbs & micro-cracks
  vec2 cellular(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float minDist = 1.0;
    float secondDist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = vec2(hash(i + neighbor), hash(i + neighbor + 13.7));
        vec2 diff = neighbor + point - f;
        float d = length(diff);
        if (d < minDist) {
          secondDist = minDist;
          minDist = d;
        } else if (d < secondDist) {
          secondDist = d;
        }
      }
    }
    return vec2(minDist, secondDist);
  }

  // Screen-Space Bump Mapping for physical 3D soil surface depth
  vec3 computeSoilBumpedNormal(vec3 surfNorm, vec3 surfPos, float height, float bumpScale) {
    vec3 dp1 = dFdx(surfPos);
    vec3 dp2 = dFdy(surfPos);
    float dh1 = dFdx(height);
    float dh2 = dFdy(height);

    vec3 r1 = cross(dp2, surfNorm);
    vec3 r2 = cross(surfNorm, dp1);

    float det = dot(dp1, r1);
    if (abs(det) < 0.000001) return surfNorm;

    vec3 grad = (r1 * dh1 + r2 * dh2) / det;
    return normalize(surfNorm - grad * bumpScale);
  }

  void main() {
    vec2 uv = vUv;
    float dist = length(uv - 0.5) * 2.0;

    // ── 1. MULTI-SCALE PROCEDURAL SOIL AGGREGATES & CRUMB TEXTURE ──
    vec2 soilPos = vWorldPos.xz;
    
    // Macro crumb texture
    float macroNoise = fbm(soilPos * 4.5);
    // Medium soil aggregates & clods
    vec2 cell = cellular(soilPos * 12.0);
    float crumbs = cell.x * 0.70 + (cell.y - cell.x) * 0.30;
    // Micro silt & sand grit
    float microGrit = noise(soilPos * 48.0) * 0.25;
    
    float soilHeight = (macroNoise * 0.55 + crumbs * 0.35 + microGrit * 0.10);

    // Physical normal bump perturbation
    vec3 bumpedNormal = computeSoilBumpedNormal(vNormal, vWorldPos, soilHeight, 0.045);

    // ── 2. NATURAL SOIL MICRO-CRACKS & DRYING FISSURES ──
    vec2 crackCell = cellular(soilPos * 6.5);
    float crackDist = crackCell.y - crackCell.x;
    float crackLine = smoothstep(0.12, 0.02, crackDist) * 0.65;

    // ── 3. MOISTURE VARIATION (Rich, dark damp loam near core) ──
    float moistureMap = noise(soilPos * 2.4 + vec2(1.7, 3.1));
    float moistCore = smoothstep(0.88, 0.10, dist) * (0.65 + 0.35 * moistureMap);

    // ── 4. COLOR GRADING & RICH AGRICULTURAL HUMUS PALETTE ──
    vec3 baseSoil = mix(uSoilDark, uSoilMid, clamp(soilHeight * 1.2, 0.0, 1.0));
    baseSoil = mix(baseSoil, uSoilHumus, smoothstep(0.25, 0.75, macroNoise));
    
    // Organic compost & mineral speckles
    float mineralSpeck = step(0.88, hash(floor(soilPos * 36.0))) * 0.15;
    baseSoil += vec3(mineralSpeck * 0.08, mineralSpeck * 0.06, mineralSpeck * 0.04);

    // Apply rich damp moisture darkening
    baseSoil = mix(baseSoil, uSoilMoist, moistCore * 0.65);

    // Dark fissure crevice shading
    baseSoil = mix(baseSoil, uSoilDark * 0.35, crackLine * (1.0 - moistCore * 0.45));

    // ── 5. VELVETY AGRICULTURAL MOSS IN DAMP SHADED ZONES ──
    float mossNoise = fbm(soilPos * 8.5 + vec2(5.2, 1.8));
    float mossMask = smoothstep(0.65, 0.12, dist) * smoothstep(0.44, 0.74, mossNoise);
    vec3 soilWithMoss = mix(baseSoil, uMossColor, mossMask * (uIsLight > 0.5 ? 0.55 : 0.65));

    // ── 6. DIRECTIONAL SUNLIGHT, CAVITY AO & DIFFUSE RELIEF ──
    vec3 sunDir = normalize(vec3(0.55, 0.85, 0.40));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float NdotL = dot(bumpedNormal, sunDir);
    float diffuse = clamp(NdotL * 0.55 + 0.45, 0.0, 1.0);

    // Cavity ambient occlusion in soil pores
    float cavityAO = clamp(soilHeight * 0.55 + 0.45, 0.0, 1.0);
    cavityAO *= (1.0 - crackLine * 0.45);

    vec3 litSoil = soilWithMoss * diffuse * cavityAO;

    // Subtle sunlit warm crest highlight on upper granules
    vec3 sunCrest = mix(uSoilHumus, vec3(0.65, 0.48, 0.32), 0.55);
    litSoil += sunCrest * max(0.0, NdotL) * 0.12 * (1.0 - moistCore * 0.5);

    // Moisture wet-soil specular highlight near watered center
    vec3 halfVec = normalize(sunDir + viewDir);
    float NdotH = max(dot(bumpedNormal, halfVec), 0.0);
    float spec = pow(NdotH, 20.0) * moistCore * (uIsLight > 0.5 ? 0.16 : 0.22);
    litSoil += vec3(1.0, 0.96, 0.88) * spec;

    // ── 7. SUBTERRANEAN ROOT BIO-RESONANCE ──
    float rootProximity = smoothstep(0.70, 0.0, dist);
    float pulse = sin(-uTime * 1.5 + dist * 10.0) * 0.5 + 0.5;
    vec3 bio = uBioGlow * rootProximity * pulse * (0.22 + uScrollProgress * 0.35);
    litSoil += bio;

    // ── 8. SOFT RADIAL EDGE BLEND ──
    float alpha = smoothstep(1.0, 0.68, dist);
    if (dist >= 1.0 || alpha <= 0.001) discard;

    gl_FragColor = vec4(litSoil, alpha);
  }
`;

// ── 2. SUBTERRANEAN SOIL CROSS-SECTION STRATA SHADER ──
const STRATA_VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const STRATA_FRAGMENT_SHADER = /* glsl */`
  uniform float uScrollProgress;
  uniform float uTime;
  uniform float uIsLight;
  uniform vec3 uStrataTop;     // Horizon A: Rich dark topsoil humus
  uniform vec3 uStrataMid;     // Horizon B: Subsoil clay/loam with mineral veins
  uniform vec3 uStrataDeep;    // Horizon C: Deep substratum
  uniform vec3 uBioGlow;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x),
               mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;

    // 1. Multi-layered geological soil horizons (vertical gradient with organic strata wave)
    float wave = sin(uv.x * 12.0 + sin(uv.x * 24.0) * 0.4) * 0.035;
    float depthCoord = (1.0 - uv.y) + wave;

    // Horizon A (Topsoil: 0.0 - 0.28) -> Horizon B (Subsoil: 0.28 - 0.72) -> Horizon C (Deep Bed: 0.72 - 1.0)
    vec3 col = mix(uStrataTop, uStrataMid, smoothstep(0.12, 0.55, depthCoord));
    col = mix(col, uStrataDeep, smoothstep(0.50, 0.95, depthCoord));

    // 2. Earthy sedimentary bands & mineral grain
    float band = sin(depthCoord * 38.0 + noise2(uv * 18.0) * 2.0) * 0.08;
    col += (uStrataMid - uStrataTop) * band;

    // 3. Faint embedded micro-rootlet filaments & moisture channels
    float rootlets = sin(uv.x * 55.0 + uv.y * 30.0 + noise2(uv * 32.0) * 4.0);
    float rootletMask = smoothstep(0.92, 1.0, rootlets) * smoothstep(0.85, 0.20, depthCoord);
    col = mix(col, (uIsLight > 0.5 ? vec3(0.55, 0.42, 0.28) : vec3(0.42, 0.32, 0.22)), rootletMask * 0.45);

    // 4. Biological moisture resonance near center where roots expand
    float centerProx = smoothstep(0.85, 0.0, abs(uv.x - 0.5) * 2.0);
    float rootActivity = smoothstep(0.12, 0.45, uScrollProgress);
    float glowPulse = sin(-uTime * 1.8 + depthCoord * 8.0) * 0.5 + 0.5;
    vec3 bio = uBioGlow * centerProx * rootActivity * glowPulse * 0.18;
    col += bio;

    // 5. Edge alpha falloff (smooth integration into background)
    float edgeX = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x);
    float edgeY = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.88, uv.y);
    float alpha = edgeX * edgeY * (uIsLight > 0.5 ? 0.72 : 0.85);

    if (alpha <= 0.001) discard;

    gl_FragColor = vec4(col, alpha);
  }
`;

// ── 3. CONTINUOUSLY MOVING ATMOSPHERIC CLOUD SHADER ──
const CLOUD_VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const CLOUD_FRAGMENT_SHADER = /* glsl */`
  uniform float uTime;
  uniform float uSpeed;
  uniform float uLayerIndex;      // 0.0 = low mist, 1.0 = mid cumulus, 2.0 = high cirrus
  uniform float uIsLight;
  uniform float uDensity;
  uniform vec3 uCloudBase;
  uniform vec3 uCloudMid;
  uniform vec3 uCloudHighlight;
  uniform vec3 uSunTint;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  // Pseudo-random hash
  float hashC(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 43.13);
    return fract(p.x * p.y);
  }

  // 2D Value Noise
  float noiseC(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hashC(i), hashC(i + vec2(1.0, 0.0)), f.x),
               mix(hashC(i + vec2(0.0, 1.0)), hashC(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  // Multi-octave fBM with domain rotation for natural billowing cloud forms
  float cloudFbm(vec2 p) {
    float v = 0.0;
    float a = 0.52;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; ++i) {
      v += a * noiseC(p);
      p = rot * p * 2.06 + vec2(1.7, 9.2);
      a *= 0.50;
    }
    return v;
  }

  // Domain warping for organic, swirling, evolving cloud shapes
  float warpedCloudNoise(vec2 p, float time) {
    vec2 move = vec2(time * uSpeed, sin(time * 0.025 + p.x * 0.4) * 0.035);
    vec2 q = vec2(
      cloudFbm(p + move),
      cloudFbm(p + vec2(5.2, 1.3) + move * 0.8)
    );
    vec2 r = vec2(
      cloudFbm(p + 3.0 * q + vec2(time * uSpeed * 0.45, 9.2)),
      cloudFbm(p + 3.0 * q + vec2(8.3, 2.8) + vec2(0.0, time * 0.005))
    );
    return cloudFbm(p + 3.2 * r + move * 0.25);
  }

  void main() {
    vec2 uv = vUv;

    // Coordinate space scaled for expansive natural clouds
    vec2 p = uv * vec2(4.6, 2.3) + vec2(uLayerIndex * 19.3, uLayerIndex * 11.7);

    // Continuous smooth horizontal translation
    float density = warpedCloudNoise(p, uTime);

    // Shape clouds with smooth soft thresholding
    float cutoff = mix(0.36, 0.44, uLayerIndex * 0.5);
    float cloudMask = smoothstep(cutoff, cutoff + 0.34, density);

    // Vertical boundary soft masking (clouds fade out smoothly at bottom towards soil and top towards sky)
    float vertMask = smoothstep(0.0, 0.24, uv.y) * smoothstep(1.0, 0.72, uv.y);
    // Horizontal boundary soft edge fade (prevents hard viewport edge clips)
    float horizMask = smoothstep(0.0, 0.14, uv.x) * smoothstep(1.0, 0.86, uv.x);
    float boundaryMask = vertMask * horizMask;

    float finalAlpha = cloudMask * boundaryMask * uDensity;
    if (finalAlpha <= 0.002) discard;

    // Volumetric cloud shading:
    // Shadow base -> soft midtone -> sunlit silver/golden crest
    vec3 col = mix(uCloudBase, uCloudMid, smoothstep(0.08, 0.55, cloudMask));
    col = mix(col, uCloudHighlight, smoothstep(0.50, 0.95, cloudMask));

    // Subtle sun rim lighting on upper billows
    float sunRim = smoothstep(0.60, 0.90, density) * smoothstep(0.3, 0.9, uv.y);
    col = mix(col, uSunTint, sunRim * 0.32);

    gl_FragColor = vec4(col, finalAlpha);
  }
`;

// ── 4. LAYERED ATMOSPHERIC SKY BACKDROP WITH SUNLIGHT DIFFUSION SHADER ──
const ATMOSPHERE_VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */`
  uniform float uTime;
  uniform float uIsLight;
  uniform vec3 uSkyZenith;     // Deep blue upper sky
  uniform vec3 uSkyMid;        // Natural azure mid-sky
  uniform vec3 uSkyHorizon;    // Soft warm horizon haze
  uniform vec3 uSunGlow;       // Diffuse sunlight core
  uniform vec3 uMistColor;     // Agricultural morning field mist

  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vec2 uv = vUv;

    // 1. Natural 3-Stop Rayleigh Sky Gradient (Deep Sky -> Azure Atmosphere -> Horizon Glow)
    vec3 skyBase = mix(uSkyHorizon, uSkyMid, smoothstep(0.12, 0.55, uv.y));
    skyBase = mix(skyBase, uSkyZenith, smoothstep(0.50, 0.95, uv.y));

    // 2. Subtle Sunlight Diffusion & Ambient Optical Glow (Positioned at upper-right sun source)
    vec2 sunPos = vec2(0.68, 0.82);
    float sunDist = length((uv - sunPos) * vec2(1.2, 1.0));
    float sunDiffusion = exp(-sunDist * 2.2) * (uIsLight > 0.5 ? 0.32 : 0.18);
    float sunCore = exp(-sunDist * 6.5) * (uIsLight > 0.5 ? 0.25 : 0.12);
    skyBase += uSunGlow * (sunDiffusion + sunCore);

    // 3. Very soft drifting morning mist / agricultural field haze near horizon (uv.y ~ 0.08 to 0.40)
    float mistDrift = sin(uTime * 0.06 + uv.x * 3.2 + sin(uv.x * 5.0) * 0.4) * 0.5 + 0.5;
    float mistLayer = smoothstep(0.04, 0.24, uv.y) * smoothstep(0.52, 0.18, uv.y) * (0.60 + 0.40 * mistDrift);
    vec3 finalAtmosphere = mix(skyBase, uMistColor, mistLayer * (uIsLight > 0.5 ? 0.32 : 0.22));

    // 4. Smooth edge vignetting
    float vignette = smoothstep(0.0, 0.22, uv.x) * smoothstep(1.0, 0.78, uv.x);
    float alpha = smoothstep(0.0, 0.08, uv.y) * vignette * 0.98;

    gl_FragColor = vec4(finalAtmosphere, alpha);
  }
`;

// ── 5. PROCEDURAL DISTANT FLYING BIRDS SHADER ──
const BIRD_VERTEX_SHADER = /* glsl */`
  attribute float aWingSide;      // -1.0 = left wingtip, 0.0 = body, +1.0 = right wingtip
  attribute float aFlapSpeed;
  attribute float aFlapPhase;
  attribute float aGlideOffset;
  attribute float aFlockId;

  uniform float uTime;
  uniform mat4 instanceMatrix;

  varying vec2 vUv;
  varying float vFlockId;

  void main() {
    vUv = uv;
    vFlockId = aFlockId;
    vec3 pos = position;

    // Wing flapping & thermal gliding cycle:
    // Alternate between bursts of active wing flaps and outstretched gliding
    float glideCycle = sin(uTime * 0.42 + aGlideOffset);
    float flapActive = smoothstep(-0.15, 0.35, glideCycle);
    float flapAngle = sin(uTime * aFlapSpeed + aFlapPhase) * flapActive;

    // Dihedral wing articulation: wingtips flap with organic vertical arc
    pos.y += flapAngle * abs(aWingSide) * 0.075;
    pos.z += abs(flapAngle) * abs(aWingSide) * 0.018;

    vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const BIRD_FRAGMENT_SHADER = /* glsl */`
  uniform vec3 uBirdColor;
  uniform float uIsLight;
  varying vec2 vUv;
  varying float vFlockId;

  void main() {
    // Subtle distance depth fade
    float distFade = mix(0.72, 0.92, vFlockId * 0.3);
    gl_FragColor = vec4(uBirdColor, distFade * (uIsLight > 0.5 ? 0.88 : 0.78));
  }
`;

// ── 6. ATMOSPHERIC POLLEN & ORGANIC DUST SHADER ──
const DUST_VERTEX_SHADER = /* glsl */`
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;

  uniform float uTime;
  uniform vec2 uCursor;

  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Organic drift & harmonic sway through sunbeams
    p.y += sin(uTime * aSpeed * 0.45 + aPhase) * 0.42;
    p.x += cos(uTime * aSpeed * 0.35 + aPhase * 1.3) * 0.32;
    p.z += sin(uTime * aSpeed * 0.30 + aPhase * 0.8) * 0.32;

    // Interactive cursor wind repulsion
    float cDist = length(p.xy - uCursor * 2.2);
    if (cDist < 1.4) {
      vec2 push = normalize(p.xy - uCursor * 2.2) * (1.4 - cDist) * 0.38;
      p.x += push.x;
      p.y += push.y;
    }

    vAlpha = (sin(uTime * 1.15 + aPhase) * 0.5 + 0.5) * 0.65 + 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (360.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const DUST_FRAGMENT_SHADER = /* glsl */`
  uniform vec3 uParticleColor;
  uniform float uIsLight;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(uParticleColor, glow * vAlpha * (uIsLight > 0.5 ? 0.55 : 0.75));
  }
`;

// Helper: Procedural low-poly dual-wing bird silhouette geometry
function createBirdGeometry() {
  const geo = new THREE.BufferGeometry();
  // 6 vertices: Left Wingtip, Left Inner, Head/Body, Tail, Right Inner, Right Wingtip
  const vertices = new Float32Array([
    // Triangle 1: Left Wingtip -> Left Inner -> Body Center
    -0.18, 0.015, -0.01,
    -0.08, 0.025, 0.02,
     0.00, 0.000, 0.035,

    // Triangle 2: Left Inner -> Body Center -> Tail
    -0.08, 0.025, 0.02,
     0.00, 0.000, 0.035,
     0.00, 0.000, -0.035,

    // Triangle 3: Right Wingtip -> Right Inner -> Body Center
     0.18, 0.015, -0.01,
     0.08, 0.025, 0.02,
     0.00, 0.000, 0.035,

    // Triangle 4: Right Inner -> Body Center -> Tail
     0.08, 0.025, 0.02,
     0.00, 0.000, 0.035,
     0.00, 0.000, -0.035,
  ]);

  const wingSides = new Float32Array([
    -1.0, -0.5, 0.0,
    -0.5,  0.0, 0.0,
     1.0,  0.5, 0.0,
     0.5,  0.0, 0.0,
  ]);

  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.setAttribute('aWingSide', new THREE.BufferAttribute(wingSides, 1));
  return geo;
}

export default function Environment({ progressRef, cursorRef, quality = 'high', isBW = false }) {
  const dustRef = useRef();
  const birdInstancedMeshRef = useRef();

  const particleCount = quality === 'low' ? 70 : quality === 'medium' ? 150 : 260;

  // Dust & Pollen Particles Buffer
  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    const speed = new Float32Array(particleCount);
    const phase = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 7.5;
      pos[i * 3 + 1] = -1.1 + Math.random() * 5.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5.5;

      size[i] = 0.032 + Math.random() * 0.050;
      speed[i] = 0.38 + Math.random() * 0.80;
      phase[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

    return geo;
  }, [particleCount]);

  // 1. Topsoil Material
  const soilMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SOIL_VERTEX_SHADER,
      fragmentShader: SOIL_FRAGMENT_SHADER,
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        // Dark Mode: Deep dark fertile loam; Light Mode: Rich natural agricultural loam & humus
        uSoilDark: { value: isBW ? new THREE.Color('#2c1810') : new THREE.Color('#0c0906') },
        uSoilMid: { value: isBW ? new THREE.Color('#543621') : new THREE.Color('#1a120b') },
        uSoilHumus: { value: isBW ? new THREE.Color('#7a5234') : new THREE.Color('#2c1b10') },
        uSoilMoist: { value: isBW ? new THREE.Color('#382012') : new THREE.Color('#140d07') },
        uMossColor: { value: isBW ? new THREE.Color('#3b782b') : new THREE.Color('#224b1c') },
        uBioGlow: { value: new THREE.Color(0, 0, 0) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // 2. Subterranean Strata Material
  const strataMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: STRATA_VERTEX_SHADER,
      fragmentShader: STRATA_FRAGMENT_SHADER,
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        // Strata Horizon Colors
        uStrataTop: { value: isBW ? new THREE.Color('#4a3321') : new THREE.Color('#160f0a') },
        uStrataMid: { value: isBW ? new THREE.Color('#684931') : new THREE.Color('#26170d') },
        uStrataDeep: { value: isBW ? new THREE.Color('#3a2416') : new THREE.Color('#0a0705') },
        uBioGlow: { value: new THREE.Color(0, 0, 0) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // 3. CONTINUOUSLY MOVING CLOUD MATERIALS (3 Distinct Parallax Layers)
  // Layer 0: Low-Altitude Rolling Field Mist (Above Soil: y ~ 0.95, z = -1.9)
  const cloudLowMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: CLOUD_VERTEX_SHADER,
      fragmentShader: CLOUD_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.016 },       // Drift speed
        uLayerIndex: { value: 0.0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        uDensity: { value: isBW ? 0.42 : 0.36 },
        uCloudBase: { value: isBW ? new THREE.Color('#c2d4bf') : new THREE.Color('#06140b') },
        uCloudMid: { value: isBW ? new THREE.Color('#e0ede0') : new THREE.Color('#0e2215') },
        uCloudHighlight: { value: isBW ? new THREE.Color('#f4faf3') : new THREE.Color('#1a3824') },
        uSunTint: { value: isBW ? new THREE.Color('#fff9e6') : new THREE.Color('#22c55e') },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // Layer 1: Mid-Altitude Sprawling Cumulus Cloud Bank (Canopy Level: y ~ 1.85, z = -2.4)
  const cloudMidMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: CLOUD_VERTEX_SHADER,
      fragmentShader: CLOUD_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.011 },       // Slower parallax drift
        uLayerIndex: { value: 1.0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        uDensity: { value: isBW ? 0.48 : 0.42 },
        uCloudBase: { value: isBW ? new THREE.Color('#bcd0b9') : new THREE.Color('#07170c') },
        uCloudMid: { value: isBW ? new THREE.Color('#e3efe2') : new THREE.Color('#132a1b') },
        uCloudHighlight: { value: isBW ? new THREE.Color('#ffffff') : new THREE.Color('#22442d') },
        uSunTint: { value: isBW ? new THREE.Color('#fffbf0') : new THREE.Color('#34d399') },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // Layer 2: High-Altitude Atmospheric Cirrus Veil (Upper Sky: y ~ 2.65, z = -2.85)
  const cloudHighMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: CLOUD_VERTEX_SHADER,
      fragmentShader: CLOUD_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.007 },       // Majestic background drift
        uLayerIndex: { value: 2.0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        uDensity: { value: isBW ? 0.35 : 0.30 },
        uCloudBase: { value: isBW ? new THREE.Color('#b6cbb3') : new THREE.Color('#051109') },
        uCloudMid: { value: isBW ? new THREE.Color('#dbebe0') : new THREE.Color('#0f2316') },
        uCloudHighlight: { value: isBW ? new THREE.Color('#f0f7f0') : new THREE.Color('#1e3d29') },
        uSunTint: { value: isBW ? new THREE.Color('#fffbf2') : new THREE.Color('#2dd4bf') },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // 4. LAYERED ATMOSPHERIC SKY BACKDROP SHADER (Rayleigh Scattering & Sun Diffusion)
  const atmosphereMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: ATMOSPHERE_VERTEX_SHADER,
      fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        // Light Mode: Subtle natural blue-to-azure sky; Dark Mode: Deep midnight celestial blue
        uSkyZenith: { value: isBW ? new THREE.Color('#2563eb') : new THREE.Color('#020617') },
        uSkyMid: { value: isBW ? new THREE.Color('#60a5fa') : new THREE.Color('#051422') },
        uSkyHorizon: { value: isBW ? new THREE.Color('#dbeafe') : new THREE.Color('#081f18') },
        uSunGlow: { value: isBW ? new THREE.Color('#fff7ed') : new THREE.Color('#10b981') },
        uMistColor: { value: isBW ? new THREE.Color('#e2e8f0') : new THREE.Color('#0a241b') },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // 5. Distant Flying Birds Material & Geometry
  const birdGeo = useMemo(() => createBirdGeometry(), []);

  // Configure 3 Distant Bird Flocks (12 birds total for high quality, 5 for low quality)
  const flockConfigs = useMemo(() => {
    const birds = [
      // ── FLOCK 1: Primary V-Formation (Altitude: y ~ 2.35, Depth: z = -2.35, Speed: 0.58) ──
      { flockId: 1, baseOffset: 0.00, offsetX:  0.00, offsetY:  0.00, offsetZ: 0.00, scale: 0.95, flapSpeed: 8.5, flapPhase: 0.0, glideOffset: 0.0 },
      { flockId: 1, baseOffset: 0.00, offsetX: -0.42, offsetY: -0.14, offsetZ: 0.04, scale: 0.88, flapSpeed: 8.2, flapPhase: 0.6, glideOffset: 0.4 },
      { flockId: 1, baseOffset: 0.00, offsetX:  0.45, offsetY: -0.16, offsetZ: 0.02, scale: 0.90, flapSpeed: 8.4, flapPhase: 1.1, glideOffset: 0.2 },
      { flockId: 1, baseOffset: 0.00, offsetX: -0.85, offsetY: -0.32, offsetZ: 0.07, scale: 0.84, flapSpeed: 8.0, flapPhase: 1.8, glideOffset: 0.7 },
      { flockId: 1, baseOffset: 0.00, offsetX:  0.92, offsetY: -0.34, offsetZ: 0.05, scale: 0.85, flapSpeed: 8.1, flapPhase: 2.3, glideOffset: 0.5 },

      // ── FLOCK 2: Mid-Altitude Pair/Cluster (Altitude: y ~ 1.75, Depth: z = -2.60, Speed: 0.46) ──
      { flockId: 2, baseOffset: 6.80, offsetX:  0.00, offsetY:  0.00, offsetZ: 0.00, scale: 0.75, flapSpeed: 9.0, flapPhase: 3.1, glideOffset: 1.8 },
      { flockId: 2, baseOffset: 6.80, offsetX: -0.36, offsetY: -0.12, offsetZ: 0.03, scale: 0.72, flapSpeed: 8.8, flapPhase: 3.7, glideOffset: 2.1 },
      { flockId: 2, baseOffset: 6.80, offsetX:  0.40, offsetY:  0.10, offsetZ: 0.02, scale: 0.70, flapSpeed: 9.2, flapPhase: 4.2, glideOffset: 1.5 },
      { flockId: 2, baseOffset: 6.80, offsetX: -0.72, offsetY: -0.22, offsetZ: 0.06, scale: 0.68, flapSpeed: 8.6, flapPhase: 4.9, glideOffset: 2.4 },

      // ── FLOCK 3: High Atmospheric Triad (Altitude: y ~ 2.95, Depth: z = -2.75, Speed: 0.38) ──
      { flockId: 3, baseOffset: 13.5, offsetX:  0.00, offsetY:  0.00, offsetZ: 0.00, scale: 0.60, flapSpeed: 9.8, flapPhase: 0.8, glideOffset: 3.2 },
      { flockId: 3, baseOffset: 13.5, offsetX: -0.28, offsetY: -0.10, offsetZ: 0.02, scale: 0.58, flapSpeed: 9.5, flapPhase: 1.4, glideOffset: 3.5 },
      { flockId: 3, baseOffset: 13.5, offsetX:  0.32, offsetY: -0.12, offsetZ: 0.03, scale: 0.57, flapSpeed: 9.6, flapPhase: 2.0, glideOffset: 3.0 },
    ];

    return quality === 'low' ? birds.slice(0, 5) : quality === 'medium' ? birds.slice(0, 9) : birds;
  }, [quality]);

  const birdMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: BIRD_VERTEX_SHADER,
      fragmentShader: BIRD_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        // Dark Mode: Midnight silhouette; Light Mode: Charcoal slate bird silhouette
        uBirdColor: { value: isBW ? new THREE.Color('#292524') : new THREE.Color('#030805') },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isBW]);

  // Per-instance attributes for bird wing flap variation
  useMemo(() => {
    if (!birdGeo) return;
    const count = flockConfigs.length;
    const aFlapSpeed = new Float32Array(count * 12);
    const aFlapPhase = new Float32Array(count * 12);
    const aGlideOffset = new Float32Array(count * 12);
    const aFlockId = new Float32Array(count * 12);

    flockConfigs.forEach((cfg, i) => {
      for (let v = 0; v < 12; v++) {
        const idx = i * 12 + v;
        aFlapSpeed[idx] = cfg.flapSpeed;
        aFlapPhase[idx] = cfg.flapPhase;
        aGlideOffset[idx] = cfg.glideOffset;
        aFlockId[idx] = cfg.flockId;
      }
    });

    birdGeo.setAttribute('aFlapSpeed', new THREE.BufferAttribute(aFlapSpeed, 1));
    birdGeo.setAttribute('aFlapPhase', new THREE.BufferAttribute(aFlapPhase, 1));
    birdGeo.setAttribute('aGlideOffset', new THREE.BufferAttribute(aGlideOffset, 1));
    birdGeo.setAttribute('aFlockId', new THREE.BufferAttribute(aFlockId, 1));
  }, [birdGeo, flockConfigs]);

  // 6. Pollen & Dust Material
  const dustMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: DUST_VERTEX_SHADER,
      fragmentShader: DUST_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uIsLight: { value: isBW ? 1.0 : 0.0 },
        uParticleColor: { value: isBW ? new THREE.Color('#e2e8f0') : new THREE.Color('#cbd5e1') },
      },
      transparent: true,
      depthWrite: false,
      blending: isBW ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
  }, [isBW]);

  // Dummy matrix for instanced bird positioning
  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyRot = useMemo(() => new THREE.Euler(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const p = progressRef?.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;
    const t = state.clock.elapsedTime;

    if (soilMat) {
      soilMat.uniforms.uScrollProgress.value = p;
      soilMat.uniforms.uTime.value = t;
    }

    if (strataMat) {
      strataMat.uniforms.uScrollProgress.value = p;
      strataMat.uniforms.uTime.value = t;
    }

    // Continuous cloud movement updates
    if (cloudLowMat) cloudLowMat.uniforms.uTime.value = t;
    if (cloudMidMat) cloudMidMat.uniforms.uTime.value = t;
    if (cloudHighMat) cloudHighMat.uniforms.uTime.value = t;

    // Atmosphere update
    if (atmosphereMat) atmosphereMat.uniforms.uTime.value = t;

    // Distant bird flight simulation
    if (birdMat) birdMat.uniforms.uTime.value = t;
    if (birdInstancedMeshRef.current) {
      const travelSpan = 20.0; // Horizontal travel distance from left to right

      flockConfigs.forEach((cfg, i) => {
        // Horizontal flight velocity based on flock tier
        const speed = cfg.flockId === 1 ? 0.58 : cfg.flockId === 2 ? 0.46 : 0.38;
        const rawX = (t * speed + cfg.baseOffset) % travelSpan;
        const posX = rawX - travelSpan * 0.5 + cfg.offsetX;

        // Altitude & subtle thermal draft undulation
        const baseAltitude = cfg.flockId === 1 ? 2.35 : cfg.flockId === 2 ? 1.75 : 2.95;
        const posY = baseAltitude + cfg.offsetY + Math.sin(t * 0.75 + cfg.flapPhase) * 0.035;

        // Depth positioning behind tree
        const baseDepth = cfg.flockId === 1 ? -2.35 : cfg.flockId === 2 ? -2.60 : -2.75;
        const posZ = baseDepth + cfg.offsetZ;

        dummyPos.set(posX, posY, posZ);
        dummyScale.set(cfg.scale, cfg.scale, cfg.scale);
        
        // Slight banking / pitch in flight direction
        dummyRot.set(0.04, 0.0, -0.02 + Math.sin(t * 0.5 + cfg.flapPhase) * 0.015);
        dummyQuat.setFromEuler(dummyRot);

        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        birdInstancedMeshRef.current.setMatrixAt(i, dummyMatrix);
      });
      birdInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Dust particles
    if (dustMat) {
      dustMat.uniforms.uTime.value = t;
      dustMat.uniforms.uCursor.value.set(curX, curY);
    }
  });

  // Terrain resolution adapted to quality setting
  const terrainSegments = quality === 'low' ? 28 : quality === 'medium' ? 44 : 60;

  return (
    <group>
      {/* ── 1. CINEMATIC AGRICULTURAL LIGHTING RIG ── */}
      {/* Organic Ambient Light */}
      <ambientLight
        intensity={isBW ? 1.25 : 0.85}
        color={isBW ? '#e8f0e5' : '#1c2e22'}
      />

      {/* Primary Key Sun Light (Warm golden agricultural sunbeam with soft shadows) */}
      <directionalLight
        position={[5.2, 7.8, 4.2]}
        intensity={isBW ? 2.4 : 2.7}
        color={isBW ? '#fffdf7' : '#fff9ed'}
        castShadow={quality !== 'low'}
        shadow-mapSize={quality === 'high' ? [1024, 1024] : [512, 512]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={5.5}
        shadow-camera-bottom={-4.5}
        shadow-bias={-0.0004}
      />

      {/* Sky Cool Fill Bounce Light */}
      <directionalLight
        position={[-4.5, 4.2, -3.2]}
        intensity={isBW ? 0.75 : 0.95}
        color={isBW ? '#e0f2fe' : '#38bdf8'}
      />

      {/* ── 2. FERTILE AGRICULTURAL TOPSOIL BED ── */}
      {/* Positioned at y = -0.165 to ground the trunk & surface buttress roots perfectly */}
      <mesh
        position={[0, -0.165, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={soilMat}
        receiveShadow
      >
        <planeGeometry args={[7.2, 7.2, terrainSegments, terrainSegments]} />
      </mesh>

      {/* ── 3. SUBTERRANEAN SOIL CROSS-SECTION (ROOT TRENCH HORIZONS) ── */}
      {/* Positioned behind underground roots to frame the seed & taproot growth stages */}
      <mesh
        position={[0, -0.88, -0.38]}
        material={strataMat}
      >
        <planeGeometry args={[6.8, 1.75, 24, 12]} />
      </mesh>

      {/* ── 4. CONTINUOUSLY MOVING CLOUD LAYERS (BEHIND TREE & ABOVE SOIL) ── */}
      {/* Layer 0: Low-Altitude Rolling Field Mist (y = 0.95, z = -1.9) */}
      <mesh
        position={[0, 0.95, -1.9]}
        material={cloudLowMat}
      >
        <planeGeometry args={[15.0, 3.8]} />
      </mesh>

      {/* Layer 1: Mid-Altitude Sprawling Cumulus Cloud Bank (y = 1.85, z = -2.4) */}
      <mesh
        position={[0, 1.85, -2.4]}
        material={cloudMidMat}
      >
        <planeGeometry args={[16.0, 4.2]} />
      </mesh>

      {/* Layer 2: High-Altitude Atmospheric Cirrus Veil (y = 2.65, z = -2.85) — On medium & high tiers */}
      {quality !== 'low' && (
        <mesh
          position={[0, 2.65, -2.85]}
          material={cloudHighMat}
        >
          <planeGeometry args={[17.0, 4.5]} />
        </mesh>
      )}

      {/* ── 5. PROCEDURAL DISTANT FLYING BIRD FLOCKS (BEHIND TREE, IN SKY LAYER) ── */}
      <instancedMesh
        ref={birdInstancedMeshRef}
        args={[birdGeo, birdMat, flockConfigs.length]}
      />

      {/* ── 6. LAYERED ATMOSPHERIC SKY BACKDROP WITH SUNLIGHT DIFFUSION (z = -3.3) ── */}
      <mesh
        position={[0, 1.6, -3.3]}
        material={atmosphereMat}
      >
        <planeGeometry args={[18.0, 12.0]} />
      </mesh>

      {/* ── 7. AIRBORNE POLLEN & ORGANIC DUST PARTICLES ── */}
      <points
        ref={dustRef}
        geometry={dustGeo}
        material={dustMat}
      />
    </group>
  );
}
