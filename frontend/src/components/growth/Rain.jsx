import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Rain Component — Cinematic Realistic Agricultural Rain Particle System
 * 
 * Scroll Timing:
 * - Starts at exactly 0.0 (0% scroll)
 * - Gradually builds density from 0% -> 18% scroll (nurturing the soil and germinating seed)
 * - Smoothly fades out from 18% -> 30% scroll (completely gone by 30% scroll)
 * - At 30% scroll and beyond: visible = false (0 GPU overhead)
 * 
 * Visual Architecture:
 * - GPU vertex shader quad extrusion with camera-aligned billboarding
 * - 3 Depth Tiers (Background mist, Midground soil-level drops, Foreground streaks)
 * - Tapered drop profiles with natural motion-blur gradient
 * - Gentle natural wind slant (~2.5 degrees)
 * - Zero per-frame React state updates; runs at 60+ FPS on all devices
 */

const RAIN_VERTEX_SHADER = /* glsl */`
  attribute vec3 aCorner;     // (-1/1 width, 0/1 length)
  attribute vec3 aSpawnPos;   // Base spawn volume (x, y, z)
  attribute float aSpeed;
  attribute float aLength;
  attribute float aWidth;
  attribute float aAlphaMod;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uYMin;
  uniform float uYSpan;
  uniform float uWindSlant;

  varying float vDropAlpha;
  varying vec2 vUv;

  void main() {
    vUv = vec2(aCorner.x * 0.5 + 0.5, aCorner.y);

    // Continuous falling motion calculated purely on GPU
    float fallDist = uTime * aSpeed;
    float y = mod(aSpawnPos.y - fallDist - uYMin, uYSpan) + uYMin;

    // Natural wind slant along X axis
    float x = aSpawnPos.x + (uYSpan - (y - uYMin)) * uWindSlant;
    float z = aSpawnPos.z;

    vec3 dropPos = vec3(x, y, z);

    // Billboarding: Align streak normal toward camera along fall vector
    vec3 toCam = normalize(cameraPosition - dropPos);
    vec3 upDir = normalize(vec3(-uWindSlant, 1.0, 0.0));
    vec3 rightDir = normalize(cross(upDir, toCam));

    // Expand vertex along streak width and length
    vec3 pos = dropPos 
             + rightDir * (aCorner.x * aWidth * 0.5) 
             + upDir * (aCorner.y * aLength);

    vDropAlpha = aAlphaMod * uIntensity;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const RAIN_FRAGMENT_SHADER = /* glsl */`
  uniform vec3 uRainColor;

  varying float vDropAlpha;
  varying vec2 vUv;

  void main() {
    if (vDropAlpha <= 0.002) discard;

    // Tapered streak profile: denser head at bottom, soft fading tail at top
    float lenFade = smoothstep(1.0, 0.05, vUv.y);
    
    // Soft horizontal feathering to avoid rigid lines
    float edgeDist = abs(vUv.x - 0.5) * 2.0;
    float edgeFeather = 1.0 - edgeDist * edgeDist;

    float streakMask = lenFade * edgeFeather;
    if (streakMask <= 0.01) discard;

    float alpha = streakMask * vDropAlpha;
    gl_FragColor = vec4(uRainColor, alpha);
  }
`;

export default function Rain({ progressRef, quality = 'high', isBW = true }) {
  const meshRef = useRef();

  // Tiered particle count for smooth 60 FPS across devices
  const dropCount = quality === 'low' ? 800 : quality === 'medium' ? 1400 : 2000;

  const { rainGeo, rainMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertCount = dropCount * 4;
    const indexCount = dropCount * 6;

    const positions = new Float32Array(vertCount * 3);
    const corners = new Float32Array(vertCount * 3);
    const spawnPositions = new Float32Array(vertCount * 3);
    const speeds = new Float32Array(vertCount);
    const lengths = new Float32Array(vertCount);
    const widths = new Float32Array(vertCount);
    const alphaMods = new Float32Array(vertCount);
    const indices = new Uint32Array(indexCount);

    for (let i = 0; i < dropCount; i++) {
      // 3 Depth tiers: Background, Midground, Foreground
      const depthRand = Math.random();
      let depthZ, baseSpeed, baseLength, baseWidth, baseAlpha;

      if (depthRand < 0.35) {
        // Background: finer, softer, slower drops falling over landscape
        depthZ = -1.6 + Math.random() * 1.1; // -1.6 to -0.5
        baseSpeed = 7.5 + Math.random() * 2.5;
        baseLength = 0.13 + Math.random() * 0.07;
        baseWidth = 0.0022;
        baseAlpha = 0.26 + Math.random() * 0.16;
      } else if (depthRand < 0.78) {
        // Midground: balanced natural raindrops falling onto topsoil & seed
        depthZ = -0.5 + Math.random() * 1.2; // -0.5 to 0.7
        baseSpeed = 10.2 + Math.random() * 3.0;
        baseLength = 0.20 + Math.random() * 0.10;
        baseWidth = 0.0034;
        baseAlpha = 0.42 + Math.random() * 0.22;
      } else {
        // Foreground: longer, faster motion-blurred streaks
        depthZ = 0.7 + Math.random() * 1.1;  // 0.7 to 1.8
        baseSpeed = 14.0 + Math.random() * 3.8;
        baseLength = 0.30 + Math.random() * 0.14;
        baseWidth = 0.0044;
        baseAlpha = 0.54 + Math.random() * 0.26;
      }

      // Span across visible camera frustum
      const spawnX = (Math.random() - 0.5) * 8.5;
      const spawnY = -0.32 + Math.random() * 3.9;

      const vBase = i * 4;
      const iBase = i * 6;

      // 4 corners of streak quad
      const quadCorners = [
        [-1, 0, 0],
        [ 1, 0, 0],
        [-1, 1, 0],
        [ 1, 1, 0],
      ];

      for (let c = 0; c < 4; c++) {
        const vIdx = vBase + c;
        positions[vIdx * 3 + 0] = 0;
        positions[vIdx * 3 + 1] = 0;
        positions[vIdx * 3 + 2] = 0;

        corners[vIdx * 3 + 0] = quadCorners[c][0];
        corners[vIdx * 3 + 1] = quadCorners[c][1];
        corners[vIdx * 3 + 2] = quadCorners[c][2];

        spawnPositions[vIdx * 3 + 0] = spawnX;
        spawnPositions[vIdx * 3 + 1] = spawnY;
        spawnPositions[vIdx * 3 + 2] = depthZ;

        speeds[vIdx] = baseSpeed;
        lengths[vIdx] = baseLength;
        widths[vIdx] = baseWidth;
        alphaMods[vIdx] = baseAlpha;
      }

      // Indices for two triangles per quad
      indices[iBase + 0] = vBase + 0;
      indices[iBase + 1] = vBase + 1;
      indices[iBase + 2] = vBase + 2;
      indices[iBase + 3] = vBase + 2;
      indices[iBase + 4] = vBase + 1;
      indices[iBase + 5] = vBase + 3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aCorner', new THREE.BufferAttribute(corners, 3));
    geo.setAttribute('aSpawnPos', new THREE.BufferAttribute(spawnPositions, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aLength', new THREE.BufferAttribute(lengths, 1));
    geo.setAttribute('aWidth', new THREE.BufferAttribute(widths, 1));
    geo.setAttribute('aAlphaMod', new THREE.BufferAttribute(alphaMods, 1));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: RAIN_VERTEX_SHADER,
      fragmentShader: RAIN_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.35 },
        uYMin: { value: -0.32 },
        uYSpan: { value: 3.9 },
        uWindSlant: { value: 0.040 }, // Gentle natural wind slant
        uRainColor: { value: isBW ? new THREE.Color('#94a3b8') : new THREE.Color('#cce0ff') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });

    return { rainGeo: geo, rainMat: mat };
  }, [dropCount, isBW]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      if (rainGeo) rainGeo.dispose();
      if (rainMat) rainMat.dispose();
    };
  }, [rainGeo, rainMat]);

  useFrame((state) => {
    const p = progressRef?.current || 0;

    // Hard cutoff: exactly at 30% scroll and beyond, no rain is drawn (zero GPU cost)
    if (p >= 0.30) {
      if (meshRef.current && meshRef.current.visible) {
        meshRef.current.visible = false;
      }
      return;
    }

    if (meshRef.current && !meshRef.current.visible) {
      meshRef.current.visible = true;
    }

    // Smooth intensity progression:
    // 0.0 -> 0.18: Starts at 0.32 and smoothly increases to 1.0 peak density
    // 0.18 -> 0.30: Smoothly and gradually fades out from 1.0 to 0.0
    let intensity = 0.0;
    if (p <= 0.18) {
      const t = p / 0.18;
      intensity = THREE.MathUtils.lerp(0.32, 1.0, t);
    } else {
      const t = (p - 0.18) / 0.12;
      intensity = (1.0 - THREE.MathUtils.smoothstep(t, 0.0, 1.0));
    }

    if (rainMat) {
      rainMat.uniforms.uTime.value = state.clock.elapsedTime;
      rainMat.uniforms.uIntensity.value = intensity;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={rainGeo}
      material={rainMat}
      frustumCulled={false}
    />
  );
}
