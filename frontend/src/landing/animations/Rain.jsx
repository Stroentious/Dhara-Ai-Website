import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Rain Component — Realistic Cinematic Rain Particle System
 * 
 * Scroll Timing:
 * - Begins at 0% scroll (~0.38 intensity gentle rain)
 * - Increases gradually in intensity from 0% -> 16% scroll (up to 1.0 full rain)
 * - Smoothly fades out completely between 16% -> 20% scroll
 * - Exactly at 20% scroll and beyond: 100% invisible (visible = false, 0 GPU draw overhead)
 * 
 * Realism & Depth:
 * - High-speed GPU particle extrusion with natural motion blur falloff
 * - Foreground drops slightly larger, faster, and longer
 * - Midground & background drops finer, softer, and slower
 * - Subtle natural wind slant (2.5 degrees)
 * - 60 FPS performance across all devices via single buffer geometry and GPU vertex math
 */

const RAIN_VERT = /* glsl */`
  attribute vec3 aCorner;     // (-1/1 width, 0/1 length)
  attribute vec3 aSpawnPos;   // (x, y, z) base volume spawn position
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

    // Continuous falling motion computed entirely on the GPU
    float fallDist = uTime * aSpeed;
    float y = mod(aSpawnPos.y - fallDist - uYMin, uYSpan) + uYMin;

    // Subtle natural wind drift along X
    float x = aSpawnPos.x + (uYSpan - (y - uYMin)) * uWindSlant;
    float z = aSpawnPos.z;

    vec3 dropPos = vec3(x, y, z);

    // Billboarding: Orient streak quad toward camera
    vec3 toCam = normalize(cameraPosition - dropPos);
    vec3 upDir = normalize(vec3(-uWindSlant, 1.0, 0.0)); // aligned with fall vector
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

const RAIN_FRAG = /* glsl */`
  uniform vec3 uRainColor;

  varying float vDropAlpha;
  varying vec2 vUv;

  void main() {
    if (vDropAlpha <= 0.002) discard;

    // Tapered streak: denser at the falling head (bottom), soft fading tail (top)
    float lenFade = smoothstep(1.0, 0.06, vUv.y);
    
    // Soft horizontal feathering
    float edgeDist = abs(vUv.x - 0.5) * 2.0;
    float edgeFeather = 1.0 - edgeDist * edgeDist;

    float streakMask = lenFade * edgeFeather;
    if (streakMask <= 0.01) discard;

    float alpha = streakMask * vDropAlpha;
    gl_FragColor = vec4(uRainColor, alpha);
  }
`;

export default function Rain({ progressRef, quality = 'high', isBW = false }) {
  const meshRef = useRef();

  // Scale drop count gracefully to hardware tier
  const dropCount = quality === 'low' ? 700 : quality === 'medium' ? 1200 : 1800;

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
      // 3 Depth Tiers: 0 = Background, 1 = Midground, 2 = Foreground
      const depthRand = Math.random();
      let depthZ, baseSpeed, baseLength, baseWidth, baseAlpha;

      if (depthRand < 0.35) {
        // Background: finer, softer, slower drops
        depthZ = -1.4 + Math.random() * 1.1; // -1.4 to -0.3
        baseSpeed = 7.2 + Math.random() * 2.4;
        baseLength = 0.14 + Math.random() * 0.08;
        baseWidth = 0.0024;
        baseAlpha = 0.28 + Math.random() * 0.18;
      } else if (depthRand < 0.75) {
        // Midground: balanced natural raindrops
        depthZ = -0.3 + Math.random() * 1.2; // -0.3 to 0.9
        baseSpeed = 9.8 + Math.random() * 3.2;
        baseLength = 0.22 + Math.random() * 0.11;
        baseWidth = 0.0036;
        baseAlpha = 0.45 + Math.random() * 0.25;
      } else {
        // Foreground: slightly larger, faster, and longer streaks
        depthZ = 0.9 + Math.random() * 1.0;  // 0.9 to 1.9
        baseSpeed = 13.5 + Math.random() * 4.0;
        baseLength = 0.32 + Math.random() * 0.14;
        baseWidth = 0.0048;
        baseAlpha = 0.58 + Math.random() * 0.28;
      }

      // Spread spawn across scene envelope
      const spawnX = (Math.random() - 0.5) * 8.2;
      const spawnY = -0.35 + Math.random() * 3.85;

      const vBase = i * 4;
      const iBase = i * 6;

      // 4 corners of the streak quad
      const quadCorners = [
        [-1, 0, 0],
        [ 1, 0, 0],
        [-1, 1, 0],
        [ 1, 1, 0],
      ];

      for (let c = 0; c < 4; c++) {
        const vIdx = vBase + c;
        // Position initialized to 0 (GPU positions via aSpawnPos & aCorner)
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

      // Two triangles: (0, 1, 2) and (2, 1, 3)
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
      vertexShader: RAIN_VERT,
      fragmentShader: RAIN_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.38 },
        uYMin: { value: -0.35 },
        uYSpan: { value: 3.85 },
        uWindSlant: { value: 0.042 }, // Subtle ~2.4 degree natural wind slant
        uRainColor: { value: isBW ? new THREE.Color('#93c5fd') : new THREE.Color('#dbeafe') },
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

    // Hard cutoff: above 20% scroll, no rain remains visible (zero GPU draw overhead)
    if (p >= 0.20) {
      if (meshRef.current && meshRef.current.visible) {
        meshRef.current.visible = false;
      }
      return;
    }

    if (meshRef.current && !meshRef.current.visible) {
      meshRef.current.visible = true;
    }

    // Smooth intensity progression:
    // 0.0 -> 0.16: Rain begins at ~0.38 and builds up gradually to 1.0 (heavy rain)
    // 0.16 -> 0.20: Smoothly fades completely out to 0.0
    let intensity = 0.0;
    if (p <= 0.16) {
      const t = p / 0.16;
      intensity = THREE.MathUtils.lerp(0.38, 1.0, t);
    } else {
      const t = (p - 0.16) / 0.04;
      intensity = 1.0 - THREE.MathUtils.smoothstep(t, 0.0, 1.0);
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
