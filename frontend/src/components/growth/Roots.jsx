import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Roots Component — Organic Grounded Surface Buttress & Subterranean Root Network (*Ficus benghalensis*)
 * Botanical Principles:
 * - Exposed Surface Buttress Roots: Sprawling surface roots radiating across soil plane before diving underground
 * - Subterranean Pioneer Taproot: Deep tortuous taproot penetrating nutrient zone (-2.5m depth)
 * - Lateral Radiating Roots: Multi-tiered feeder roots expanding in golden-ratio radial distribution
 * - GPU-driven continuous extrusion shader with weathered root bark & upward bioluminescent nutrient waves
 * - Timeline: 16% to 65% (Pioneers early anchor stability as tree shoot emerges and trunk matures)
 * - 100% Reversible video-scrubbing behavior
 */

const ROOT_VERTEX_SHADER = /* glsl */`
  attribute float aProgress;      // 0.0 at trunk collar, 1.0 at root tip
  attribute float aBaseRadius;
  attribute float aBranchDelay;   // Individual root emergence threshold (0.16 to 0.38)
  attribute float aIsSurface;     // 1.0 = Exposed surface root, 0.0 = Subterranean root
  
  uniform float uScrollProgress;  // Overall timeline 0.0 to 1.0
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vDepth;
  varying float vPulse;
  varying float vRootGrowth;
  varying float vIsSurface;

  void main() {
    vUv = uv;
    vDepth = position.y;
    vIsSurface = aIsSurface;

    // Calculate individual root growth fraction [0.0, 1.0]
    float rawGrowth = (uScrollProgress - aBranchDelay) / 0.26;
    float rootGrowth = clamp(rawGrowth, 0.0, 1.0);
    rootGrowth = smoothstep(0.0, 1.0, rootGrowth);
    vRootGrowth = rootGrowth;

    // Extrude along spline length according to individual growth
    float localExtrude = smoothstep(aProgress - 0.06, aProgress, rootGrowth);
    
    // ── BOTANICAL ROOT TAPER ──
    // Surface roots are thicker and flatter; subterranean roots taper to fine tips
    float taper = mix(1.0 - aProgress * 0.78, 1.0 - aProgress * 0.55, aIsSurface) * localExtrude;
    
    // Subtle subterranean biological movement
    vec3 transformed = position;
    if (aProgress > 0.0) {
      float flex = sin(uTime * 0.45 + aProgress * 8.0) * (0.010 * (1.0 - aIsSurface * 0.5)) * localExtrude;
      float flexZ = cos(uTime * 0.38 + aProgress * 7.0) * (0.010 * (1.0 - aIsSurface * 0.5)) * localExtrude;
      transformed.x += flex;
      transformed.z += flexZ;
    }

    // Expand vertex along normal
    transformed += normal * (aBaseRadius * taper - aBaseRadius);

    // Upward bio-luminescent nutrient wave
    vPulse = sin(-uTime * 2.8 + aProgress * 16.0) * 0.5 + 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const ROOT_FRAGMENT_SHADER = /* glsl */`
  uniform float uScrollProgress;
  uniform vec3 uColorBark;
  uniform vec3 uColorNutrient;
  uniform vec3 uColorMoss;
  uniform float uTime;

  varying vec2 vUv;
  varying float vDepth;
  varying float vPulse;
  varying float vRootGrowth;
  varying float vIsSurface;

  void main() {
    if (vRootGrowth <= 0.002) discard;

    // 1. Earthy subterranean bark color with organic depth gradient
    float depthGrad = clamp(-vDepth * 0.55, 0.0, 1.0);
    vec3 col = mix(uColorBark * 1.18, uColorBark * 0.75, depthGrad);
    
    // 2. Surface roots have moss patina
    if (vIsSurface > 0.5) {
      col = mix(col, uColorMoss, 0.28);
    }

    // 3. Procedural bark micro-striations
    float grain = sin(vUv.x * 24.0) * 0.06;
    col *= (0.94 + grain);

    // 4. Nutrient bio-luminescence pulse traveling up to shoot
    vec3 nutrientGlow = uColorNutrient * vPulse * 0.60 * (1.0 - depthGrad * 0.35);
    col += nutrientGlow;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Helper to generate natural tortuous root splines
function createSubterraneanRootCurve(startPt, dir, length, segments = 18, tortuosity = 0.35, isSurface = false) {
  const points = [startPt.clone()];
  let current = startPt.clone();
  const step = length / segments;

  for (let i = 1; i <= segments; i++) {
    const progressDir = dir.clone().normalize();
    const noiseX = Math.sin(i * 1.8 + startPt.x * 6.0) * tortuosity * step;
    const noiseZ = Math.cos(i * 2.4 + startPt.z * 6.0) * tortuosity * step;
    
    // Surface roots stay near ground plane (y: -0.18 to -0.08) for first half of length, then plunge down
    let spreadY;
    if (isSurface && i <= segments * 0.5) {
      spreadY = -step * 0.12; // Hug the ground surface
    } else {
      spreadY = -step * (0.80 + Math.sin(i * 0.8) * 0.15);
    }

    current.add(new THREE.Vector3(
      progressDir.x * step + noiseX,
      spreadY,
      progressDir.z * step + noiseZ
    ));
    points.push(current.clone());
  }
  return new THREE.CatmullRomCurve3(points);
}

export default function Roots({ progressRef, cursorRef, quality = 'high' }) {
  const groupRef = useRef();

  const { rootGeometries, rootMaterial } = useMemo(() => {
    const rootCurves = [];
    const phi = 2.399963229728653; // Golden angle
    const seedCollar = new THREE.Vector3(0, -0.19, 0);

    // ── 1. PRIMARY DEEP TAPROOT (Pioneers downward at scroll 16%) ──
    rootCurves.push({
      curve: createSubterraneanRootCurve(seedCollar, new THREE.Vector3(0.02, -1.0, 0.015), 2.5, 24, 0.20, false),
      radius: 0.052,
      branchDelay: 0.16,
      isSurface: 0.0,
    });

    // ── 2. EXPOSED SURFACE BUTTRESS ROOTS (Hug ground plane before plunging) ──
    const surfaceCount = quality === 'low' ? 3 : quality === 'medium' ? 5 : 7;
    for (let s = 0; s < surfaceCount; s++) {
      const angle = (s * phi * 1.2) + 0.2;
      const startPt = new THREE.Vector3(
        Math.cos(angle) * 0.055,
        -0.16,
        Math.sin(angle) * 0.055
      );
      const dir = new THREE.Vector3(
        Math.cos(angle) * 1.2,
        -0.35,
        Math.sin(angle) * 1.2
      );
      const length = 1.35 + ((s % 3) * 0.25);
      const radius = 0.044 - (s * 0.0015);
      const branchDelay = 0.18 + (s * 0.015);

      rootCurves.push({
        curve: createSubterraneanRootCurve(startPt, dir, length, 20, 0.32, true),
        radius,
        branchDelay,
        isSurface: 1.0,
      });
    }

    // ── 3. LATERAL SUBTERRANEAN RADIATING STRUCTURAL ROOTS ──
    const lateralCount = quality === 'low' ? 5 : quality === 'medium' ? 9 : 14;
    for (let i = 0; i < lateralCount; i++) {
      const angle = (i * phi) + 0.8;
      const radSpread = 0.70 + ((i % 3) * 0.24);
      const dir = new THREE.Vector3(
        Math.cos(angle) * radSpread,
        -0.78 - ((i % 4) * 0.16),
        Math.sin(angle) * radSpread
      );
      
      const startDepth = -0.19 - (i * 0.032);
      const startPt = new THREE.Vector3(
        Math.cos(angle) * 0.045,
        startDepth,
        Math.sin(angle) * 0.045
      );

      const length = 1.55 + ((i % 3) * 0.35);
      const radius = 0.035 - (i * 0.001);
      const branchDelay = 0.19 + (i * 0.012);

      rootCurves.push({
        curve: createSubterraneanRootCurve(startPt, dir, length, 18, 0.38, false),
        radius,
        branchDelay,
        isSurface: 0.0,
      });

      // ── 4. TERTIARY FEEDER ROOTLET SPLITS (Quality >= medium) ──
      if (quality !== 'low' && i % 2 === 0) {
        const parentCurve = rootCurves[rootCurves.length - 1].curve;
        const forkPt = parentCurve.getPoint(0.48);
        const subDir = new THREE.Vector3(
          Math.cos(angle + 0.75) * 0.85,
          -0.88,
          Math.sin(angle + 0.75) * 0.85
        );
        rootCurves.push({
          curve: createSubterraneanRootCurve(forkPt, subDir, 0.85, 12, 0.42, false),
          radius: radius * 0.55,
          branchDelay: branchDelay + 0.04,
          isSurface: 0.0,
        });
      }
    }

    const tubeGeometries = [];
    const radialSegments = quality === 'low' ? 6 : quality === 'medium' ? 8 : 9;

    rootCurves.forEach(({ curve, radius, branchDelay, isSurface }) => {
      const tubularSegments = quality === 'low' ? 18 : 28;
      const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
      const pos = tubeGeo.attributes.position;
      const count = pos.count;

      const aProgress = new Float32Array(count);
      const aBaseRadius = new Float32Array(count);
      const aBranchDelay = new Float32Array(count);
      const aIsSurface = new Float32Array(count);

      const rings = tubularSegments + 1;
      const vertsPerRing = radialSegments + 1;

      for (let ring = 0; ring < rings; ring++) {
        const prog = ring / (rings - 1);
        for (let v = 0; v < vertsPerRing; v++) {
          const idx = ring * vertsPerRing + v;
          if (idx < count) {
            aProgress[idx] = prog;
            aBaseRadius[idx] = radius;
            aBranchDelay[idx] = branchDelay;
            aIsSurface[idx] = isSurface;
          }
        }
      }

      tubeGeo.setAttribute('aProgress', new THREE.BufferAttribute(aProgress, 1));
      tubeGeo.setAttribute('aBaseRadius', new THREE.BufferAttribute(aBaseRadius, 1));
      tubeGeo.setAttribute('aBranchDelay', new THREE.BufferAttribute(aBranchDelay, 1));
      tubeGeo.setAttribute('aIsSurface', new THREE.BufferAttribute(aIsSurface, 1));
      tubeGeometries.push(tubeGeo);
    });

    const mat = new THREE.ShaderMaterial({
      vertexShader: ROOT_VERTEX_SHADER,
      fragmentShader: ROOT_FRAGMENT_SHADER,
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uColorBark: { value: new THREE.Color('#382214') },
        uColorNutrient: { value: new THREE.Color('#22c55e') },
        uColorMoss: { value: new THREE.Color('#15803d') },
      },
      side: THREE.DoubleSide,
    });

    return { rootGeometries: tubeGeometries, rootMaterial: mat };
  }, [quality]);

  useFrame((state) => {
    if (!rootMaterial) return;

    const p = progressRef.current || 0;
    rootMaterial.uniforms.uScrollProgress.value = p;
    rootMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (groupRef.current) {
      const curX = cursorRef?.current?.x || 0;
      groupRef.current.rotation.y = curX * 0.025;
      groupRef.current.visible = p >= 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {rootGeometries.map((geo, idx) => (
        <mesh
          key={idx}
          geometry={geo}
          material={rootMaterial}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
