import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Branches Component — Botanical Sprawling Banyan Branching Architecture (*Ficus benghalensis*)
 * 
 * Botanical Principles:
 * - Broad horizontal spreading boughs characteristic of Banyan (often extending wider than tree height)
 * - 4-Tiered branch hierarchy:
 *   Tier 1: Lower primary scaffold boughs (with characteristic S-curve dip & rise)
 *   Tier 2: Mid-canopy scaffold boughs
 *   Tier 3: Upper forks & scaffold spreaders
 *   Tier 4: Tertiary terminal twigs
 * - GPU-extrusion shader with branch tapering, shoulder flare, longitudinal bark grain,
 *   bump normal perturbation, and ambient wind elasticity.
 * - 100% Reversible video-scrubbing behavior.
 */

const BRANCH_VERTEX_SHADER = /* glsl */`
  attribute float aProg;          // 0.0 at branch base junction, 1.0 at branch tip
  attribute float aStartProgress; // When this specific branch begins growing (0.28 to 0.78)
  attribute float aGrowDuration;  // Progress span to reach full branch length
  attribute float aBaseRadius;
  attribute float aTier;          // 1.0 = Primary bough, 2.0 = Mid bough, 3.0 = Secondary fork, 4.0 = Tertiary twig
  
  uniform float uScrollProgress;  // Overall 0.0 to 1.0
  uniform float uTime;
  uniform vec2 uCursor;

  varying vec2 vUv;
  varying float vGrowth;
  varying float vProg;
  varying float vTier;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vProg = aProg;
    vTier = aTier;

    // Calculate individual branch growth [0.0 to 1.0]
    float rawGrowth = (uScrollProgress - aStartProgress) / aGrowDuration;
    float branchGrow = clamp(rawGrowth, 0.0, 1.0);
    branchGrow = smoothstep(0.0, 1.0, branchGrow);
    vGrowth = branchGrow;

    // Extrude along spline length smoothly
    float localExtrude = smoothstep(aProg - 0.065, aProg, branchGrow);

    // ── BOTANICAL BRANCH TAPERING & SHOULDER COLLAR FLARE ──
    // Organic branch collar flare merging smoothly into trunk junction (aProg < 0.22)
    float junctionFlare = pow(max(0.0, 1.0 - aProg * 4.5), 2.2) * 0.52;
    // Organic non-linear taper toward smaller terminal twigs
    float taper = (pow(max(0.02, 1.0 - aProg * 0.82), 1.15) + junctionFlare);
    // Subtle organic wood fiber waviness
    float branchKnots = sin(aProg * 18.0 + aTier * 2.8) * 0.0032 * (1.0 - aProg * 0.5);
    float currentRadius = (aBaseRadius * taper + branchKnots) * localExtrude;

    // ── NATURAL WIND SWAY WITH TIER-BASED ELASTICITY ──
    float tierFreq = 1.0 + (aTier * 0.45);
    float tierAmp = (aProg * 0.038 + (aTier * 0.012)) * branchGrow;
    float windX = sin(uTime * 1.2 * tierFreq + position.y * 2.6 + aTier) * tierAmp + (uCursor.x * tierAmp * 1.2);
    float windZ = cos(uTime * 1.05 * tierFreq + position.y * 2.2 + aTier) * tierAmp + (uCursor.y * tierAmp * 1.2);

    vec3 transformed = position;
    transformed.x += windX;
    transformed.z += windZ;

    // Expand vertex radius along normal
    transformed += normal * (currentRadius - aBaseRadius);

    vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const BRANCH_FRAGMENT_SHADER = /* glsl */`
  uniform float uScrollProgress;
  uniform vec3 uBarkDeep;
  uniform vec3 uBarkDark;
  uniform vec3 uBarkMid;
  uniform vec3 uBarkWarm;
  uniform vec3 uBarkGolden;
  uniform vec3 uBarkSunlit;
  uniform vec3 uTipColor;
  uniform float uTime;

  varying vec2 vUv;
  varying float vGrowth;
  varying float vProg;
  varying float vTier;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  // Bump mapping helper for physical surface normal perturbation
  vec3 computeBranchBumpedNormal(vec3 surfNorm, vec3 surfPos, float height, float bumpScale) {
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
    if (vGrowth <= 0.002 || vProg > vGrowth + 0.025) {
      discard;
    }

    // ── 1. PROCEDURAL LONGITUDINAL BARK FIBERS & SUBTLE FISSURES ──
    float grain = sin(vUv.x * 42.0 + sin(vUv.y * 24.0) * 0.8) * 0.5 + 0.5;
    float fineFibers = sin(vUv.x * 120.0 + vUv.y * 45.0) * 0.12;
    float barkHeight = pow(grain, 1.8) * 0.65 + fineFibers;

    // Normal perturbation with enhanced physical relief
    vec3 bumpedNormal = computeBranchBumpedNormal(vWorldNormal, vWorldPos, barkHeight, 0.048);

    // ── 2. DIRECTIONAL SUN & AMBIENT SCENE ILLUMINATION ──
    vec3 sunDir = normalize(vec3(0.55, 0.85, 0.40));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float NdotL = dot(bumpedNormal, sunDir);
    float diffuse = clamp((NdotL + 0.35) / 1.35, 0.0, 1.0);

    // Ambient cavity occlusion in branch underbellies
    float creviceAO = clamp(grain * 0.70 + 0.30, 0.0, 1.0);
    creviceAO *= clamp(bumpedNormal.y * 0.28 + 0.72, 0.0, 1.0);

    // Ambient ground bounce from soil below
    float groundBounce = max(0.0, -bumpedNormal.y) * 0.15;
    vec3 groundBounceColor = vec3(0.35, 0.22, 0.12) * groundBounce;

    // Sky fill from above
    float skyFill = max(0.0, bumpedNormal.y) * 0.12;
    vec3 skyFillColor = vec3(0.70, 0.82, 0.95) * skyFill;

    // ── 3. RICH WARM EARTHY BARK COLOR COMPOSITION ──
    vec3 shadowTone = mix(uBarkDeep, uBarkDark, creviceAO);
    vec3 midTone = mix(uBarkMid, uBarkWarm, diffuse);
    vec3 crestTone = mix(uBarkGolden, uBarkSunlit, smoothstep(0.4, 0.9, diffuse));

    vec3 woodColor = mix(shadowTone, midTone, clamp(diffuse * 1.35, 0.0, 1.0));
    woodColor = mix(woodColor, crestTone, smoothstep(0.55, 1.0, diffuse) * 0.42);

    vec3 litWood = woodColor * (diffuse * 0.80 + 0.20) * creviceAO + groundBounceColor + skyFillColor;
    litWood += uBarkSunlit * max(0.0, NdotL) * 0.20;

    // Natural matte wood specular highlight on dry bark curve
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(bumpedNormal, halfDir));
    float specular = pow(NdotH, 18.0) * 0.10 * (1.0 - (1.0 - creviceAO) * 0.6);
    litWood += vec3(0.96, 0.92, 0.86) * specular;

    // Rim light for depth separation against foliage and sky
    float rim = pow(1.0 - max(0.0, dot(bumpedNormal, viewDir)), 3.2) * 0.10;
    litWood += uBarkSunlit * rim;

    // ── 4. NATURAL WOODEN BRANCH COMPOSITION (Brown wood throughout growth) ──
    vec3 finalCol = litWood;

    gl_FragColor = vec4(finalCol, 1.0);
  }
`;

// Helper to construct organic sprawling Banyan branch curves with authentic S-curve dip and phototropic rise
function createBanyanBranchCurve(startPt, outAngle, elevateAngle, length, segments = 18, horizontalBias = 0.88, dipAmount = 0.08) {
  const points = [startPt.clone()];
  const step = length / segments;

  const cosElev = Math.cos(elevateAngle);
  const sinElev = Math.sin(elevateAngle);
  const cosOut = Math.cos(outAngle);
  const sinOut = Math.sin(outAngle);

  // Direction with strong horizontal sprawl bias
  const baseDir = new THREE.Vector3(
    cosOut * cosElev * horizontalBias,
    sinElev,
    sinOut * cosElev * horizontalBias
  ).normalize();

  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    // Banyan S-curve: Outward reach -> slight self-weight gravity dip in mid-span -> upward phototropic curve at foliage tips
    const gravityDip = -Math.sin(t * Math.PI) * (dipAmount * length);
    const tipLift = Math.pow(t, 2.2) * (0.14 * length);
    const wander = Math.sin(i * 1.7 + outAngle * 2.5) * (0.04 * length);

    const pt = new THREE.Vector3(
      startPt.x + baseDir.x * (step * i) + Math.cos(outAngle + Math.PI * 0.5) * wander,
      startPt.y + baseDir.y * (step * i) + gravityDip + tipLift,
      startPt.z + baseDir.z * (step * i) + Math.sin(outAngle + Math.PI * 0.5) * wander
    );
    points.push(pt);
  }

  return new THREE.CatmullRomCurve3(points);
}

export default function Branches({ progressRef, cursorRef, quality = 'high' }) {
  const groupRef = useRef();

  const { branchGeometries, branchMaterial } = useMemo(() => {
    const branchCurves = [];
    const phi = 2.399963229728653; // Golden angle for natural radial distribution

    // ── TIER 1: FIRST MAJOR LOWER SCAFFOLD BOUGHS (Emerge at y ~ 1.15 to 1.55) ──
    const lowerCount = quality === 'low' ? 6 : quality === 'medium' ? 9 : 12;
    const primaryBoughs = [];

    for (let i = 0; i < lowerCount; i++) {
      const norm = i / (lowerCount - 1);
      const trunkY = 1.15 + (norm * 0.40);
      const startPt = new THREE.Vector3(
        (i % 2 === 0 ? 0.045 : -0.045) * Math.sin(trunkY * 2.0),
        trunkY,
        (i % 3 === 0 ? 0.045 : -0.038) * Math.cos(trunkY * 2.0)
      );
      const angle = (i * phi) + 0.35;
      const elevate = THREE.MathUtils.degToRad(12 + (Math.sin(i * 1.8) * 10));
      const length = 1.35 + ((1.0 - norm * 0.20) * 0.95) + ((i % 3) * 0.16);
      const startProg = 0.44 + (norm * 0.14);
      const radius = 0.065 * (1.0 - norm * 0.25);

      const parentCurve = createBanyanBranchCurve(startPt, angle, elevate, length, 20, 0.94, 0.09);
      branchCurves.push({
        curve: parentCurve,
        radius,
        startProg,
        duration: 0.18,
        tier: 1.0,
      });

      primaryBoughs.push({ curve: parentCurve, angle, elevate, length, startProg, radius });
    }

    // ── TIER 2: MID-CANOPY SPRAWLING SCAFFOLD BOUGHS (Emerge at y ~ 1.55 to 2.05) ──
    const midCount = quality === 'low' ? 8 : quality === 'medium' ? 12 : 16;
    const midBoughs = [];

    for (let i = 0; i < midCount; i++) {
      const norm = i / (midCount - 1);
      const trunkY = 1.55 + (norm * 0.50);
      const startPt = new THREE.Vector3(
        (i % 2 === 0 ? -0.035 : 0.035) * Math.sin(trunkY * 2.5),
        trunkY,
        (i % 3 === 0 ? 0.038 : -0.032) * Math.cos(trunkY * 2.5)
      );
      const angle = ((i + 0.5) * phi) + 1.15;
      const elevate = THREE.MathUtils.degToRad(18 + (Math.sin(i * 2.2) * 12));
      const length = 1.20 + ((1.0 - norm * 0.25) * 0.85) + ((i % 2) * 0.16);
      const startProg = 0.50 + (norm * 0.16);
      const radius = 0.048 * (1.0 - norm * 0.28);

      const parentCurve = createBanyanBranchCurve(startPt, angle, elevate, length, 18, 0.90, 0.07);
      branchCurves.push({
        curve: parentCurve,
        radius,
        startProg,
        duration: 0.16,
        tier: 2.0,
      });

      midBoughs.push({ curve: parentCurve, angle, elevate, length, startProg, radius });
    }

    // ── TIER 3: UPPER CROWN FORKS & SCAFFOLD SPREADERS (Emerge at y ~ 2.05 to 2.55) ──
    const upperCount = quality === 'low' ? 8 : quality === 'medium' ? 14 : 18;
    for (let i = 0; i < upperCount; i++) {
      const norm = i / (upperCount - 1);
      const trunkY = 2.05 + (norm * 0.48);
      const startPt = new THREE.Vector3(
        (i % 2 === 0 ? 0.025 : -0.025) * Math.sin(trunkY * 3.0),
        trunkY,
        (i % 3 === 0 ? -0.028 : 0.024) * Math.cos(trunkY * 3.0)
      );
      const angle = (i * phi) + 2.40;
      const elevate = THREE.MathUtils.degToRad(24 + (Math.sin(i * 1.5) * 14));
      const length = 0.95 + ((1.0 - norm * 0.20) * 0.65);
      const startProg = 0.58 + (norm * 0.16);
      const radius = 0.036 * (1.0 - norm * 0.28);

      const upperCurve = createBanyanBranchCurve(startPt, angle, elevate, length, 16, 0.86, 0.05);
      branchCurves.push({
        curve: upperCurve,
        radius,
        startProg,
        duration: 0.14,
        tier: 3.0,
      });
    }

    // ── TIER 4: SECONDARY & TERTIARY FORKING OFFSHOOTS ──
    const allParentBoughs = [...primaryBoughs, ...midBoughs];
    allParentBoughs.forEach((parent, pIdx) => {
      const offshootCount = quality === 'low' ? 2 : quality === 'medium' ? 3 : 4;
      for (let s = 0; s < offshootCount; s++) {
        const attachT = 0.35 + (s * 0.22);
        const attachPt = parent.curve.getPoint(attachT);

        const forkSign = (pIdx + s) % 2 === 0 ? 1 : -1;
        const forkAngle = parent.angle + (forkSign * (0.60 + s * 0.22));
        const forkElev = parent.elevate + THREE.MathUtils.degToRad(10 + s * 7);
        const forkLen = parent.length * (0.45 - s * 0.06);
        const forkStartProg = parent.startProg + (attachT * 0.09);
        const forkRadius = parent.radius * 0.65;

        const forkCurve = createBanyanBranchCurve(attachPt, forkAngle, forkElev, forkLen, 14, 0.84, 0.04);
        branchCurves.push({
          curve: forkCurve,
          radius: forkRadius,
          startProg: forkStartProg,
          duration: 0.12,
          tier: 4.0,
        });
      }
    });

    // Build merged geometry buffers
    const geometries = [];
    const tubularSegments = quality === 'low' ? 14 : 20;
    const radialSegments = quality === 'low' ? 6 : 8;

    branchCurves.forEach(({ curve, radius, startProg, duration, tier }) => {
      const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
      const count = tubeGeo.attributes.position.count;

      const aProg = new Float32Array(count);
      const aStartProgress = new Float32Array(count);
      const aGrowDuration = new Float32Array(count);
      const aBaseRadius = new Float32Array(count);
      const aTier = new Float32Array(count);

      const vertsPerRing = radialSegments + 1;
      const rings = tubularSegments + 1;

      for (let ring = 0; ring < rings; ring++) {
        const prog = ring / (rings - 1);
        for (let v = 0; v < vertsPerRing; v++) {
          const idx = ring * vertsPerRing + v;
          if (idx < count) {
            aProg[idx] = prog;
            aStartProgress[idx] = startProg;
            aGrowDuration[idx] = duration;
            aBaseRadius[idx] = radius;
            aTier[idx] = tier;
          }
        }
      }

      tubeGeo.setAttribute('aProg', new THREE.BufferAttribute(aProg, 1));
      tubeGeo.setAttribute('aStartProgress', new THREE.BufferAttribute(aStartProgress, 1));
      tubeGeo.setAttribute('aGrowDuration', new THREE.BufferAttribute(aGrowDuration, 1));
      tubeGeo.setAttribute('aBaseRadius', new THREE.BufferAttribute(aBaseRadius, 1));
      tubeGeo.setAttribute('aTier', new THREE.BufferAttribute(aTier, 1));

      geometries.push(tubeGeo);
    });

    const mat = new THREE.ShaderMaterial({
      vertexShader: BRANCH_VERTEX_SHADER,
      fragmentShader: BRANCH_FRAGMENT_SHADER,
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        // Rich Earthy Natural Wood & Bark Palette
        uBarkDeep: { value: new THREE.Color('#160d08') },
        uBarkDark: { value: new THREE.Color('#2c1b12') },
        uBarkMid: { value: new THREE.Color('#4e3524') },
        uBarkWarm: { value: new THREE.Color('#6d4a32') },
        uBarkGolden: { value: new THREE.Color('#8c6343') },
        uBarkSunlit: { value: new THREE.Color('#b58c67') },
        uTipColor: { value: new THREE.Color('#7c5539') },
      },
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    return { branchGeometries: geometries, branchMaterial: mat };
  }, [quality]);

  useFrame((state) => {
    if (!branchMaterial) return;

    const p = progressRef.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;

    branchMaterial.uniforms.uScrollProgress.value = p;
    branchMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    branchMaterial.uniforms.uCursor.value.set(curX, curY);
  });

  return (
    <group ref={groupRef}>
      {branchGeometries.map((geo, index) => (
        <mesh
          key={index}
          geometry={geo}
          material={branchMaterial}
          castShadow
          receiveShadow
          frustumCulled={false}
        />
      ))}
    </group>
  );
}
