import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AerialRoots Component — Characteristic Banyan Prop Root & Pillar System (*Ficus benghalensis*)
 * Botanical Principles:
 * - Slender hanging aerial roots emerge from the underside of major horizontal boughs (scroll ~0.48 to 0.74)
 * - Dangle downward with organic waviness, swaying gently in ambient air currents
 * - Upon reaching the soil plane (y ~ -0.18), anchor firmly and dynamically thicken into stout supporting prop pillars
 * - Multi-tiered distribution:
 *   Tier 1: Heavy Primary Prop Pillars (supporting massive horizontal boughs)
 *   Tier 2: Mid-canopy Descending Prop Roots
 *   Tier 3: Braided / Anastomosing Hanging Pairs
 *   Tier 4: Slender Dangling Outer Tendrils
 * - 100% Reversible video-scrubbing behavior
 */

const AERIAL_ROOT_VERTEX_SHADER = /* glsl */`
  attribute float aProg;          // 0.0 at branch junction, 1.0 at ground contact
  attribute float aStartProgress; // When this aerial root begins emerging (0.48 to 0.72)
  attribute float aLandProgress;  // When root tip reaches soil plane (0.64 to 0.84)
  attribute float aBaseRadius;
  attribute float aThickMultiplier;
  attribute float aWaviness;
  
  uniform float uScrollProgress;
  uniform float uTime;
  uniform vec2 uCursor;

  varying vec2 vUv;
  varying float vGrowth;
  varying float vProg;
  varying float vIsGrounded;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vProg = aProg;

    // Growth progression from limb to ground [0.0 to 1.0]
    float rawGrowth = (uScrollProgress - aStartProgress) / (aLandProgress - aStartProgress);
    float rootGrowth = clamp(rawGrowth, 0.0, 1.0);
    rootGrowth = smoothstep(0.0, 1.0, rootGrowth);
    vGrowth = rootGrowth;

    // Extrude downward along curve path
    float localExtrude = smoothstep(aProg - 0.065, aProg, rootGrowth);

    // Thickening phase: Once grounded, expand into a sturdy column-like prop pillar
    float groundPhase = clamp((uScrollProgress - aLandProgress) / 0.16, 0.0, 1.0);
    vIsGrounded = groundPhase;
    float columnThick = mix(1.0, aThickMultiplier, groundPhase);

    // ── BOTANICAL ROOT PROFILE & GROUND FLARE ──
    // Flared base root where prop pillar enters soil (aProg > 0.82)
    float groundFlare = smoothstep(0.75, 1.0, aProg) * 0.45 * groundPhase;
    // Slender tendril during descent, uniform columnar pillar after grounding
    float tendrilTaper = (1.0 - aProg * 0.40) * localExtrude;
    float currentRadius = aBaseRadius * columnThick * mix(tendrilTaper, 1.0 + groundFlare, groundPhase * 0.75);

    // ── NATURAL PENDULUM SWAY ──
    // Unanchored hanging roots sway freely with air currents; anchored prop pillars are rigid
    float swayFreedom = (1.0 - groundPhase * 0.88) * aProg * (0.042 * aWaviness) * rootGrowth;
    float swayX = sin(uTime * 1.35 + position.y * 3.0) * swayFreedom + (uCursor.x * swayFreedom * 0.85);
    float swayZ = cos(uTime * 1.15 + position.y * 2.6) * swayFreedom + (uCursor.y * swayFreedom * 0.85);

    vec3 transformed = position;
    transformed.x += swayX;
    transformed.z += swayZ;

    // Expand vertex radius along normal
    transformed += normal * (currentRadius - aBaseRadius);

    vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const AERIAL_ROOT_FRAGMENT_SHADER = /* glsl */`
  uniform float uScrollProgress;
  uniform vec3 uBarkDeep;
  uniform vec3 uBarkDark;
  uniform vec3 uBarkMid;
  uniform vec3 uBarkWarm;
  uniform vec3 uBarkGolden;
  uniform vec3 uBarkSunlit;
  uniform vec3 uTipColor;
  uniform vec3 uSoilMoss;
  uniform float uTime;

  varying vec2 vUv;
  varying float vGrowth;
  varying float vProg;
  varying float vIsGrounded;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    if (vGrowth <= 0.002 || vProg > vGrowth + 0.02) {
      discard;
    }

    // 1. Longitudinal prop root bark striations
    float grain = sin(vUv.x * 32.0 + sin(vUv.y * 20.0) * 0.5) * 0.12;
    float barkTexture = clamp(0.50 + grain, 0.0, 1.0);
    float creviceAO = smoothstep(-0.08, 0.08, grain);

    // 2. Multi-toned warm golden-brown wood
    vec3 shadowTone = mix(uBarkDeep, uBarkDark, creviceAO);
    vec3 midTone = mix(uBarkMid, uBarkWarm, pow(barkTexture, 1.4));
    vec3 highlightTone = mix(uBarkGolden, uBarkSunlit, pow(barkTexture, 2.6));

    vec3 woodBase = mix(shadowTone, midTone, smoothstep(0.12, 0.58, barkTexture));
    woodBase = mix(woodBase, highlightTone, smoothstep(0.48, 0.92, barkTexture));

    // 3. Directional sun illumination
    vec3 sunDir = normalize(vec3(0.55, 0.85, 0.40));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float NdotL = dot(vWorldNormal, sunDir);
    float diffuse = clamp(NdotL * 0.55 + 0.45, 0.0, 1.0);

    vec3 litWood = mix(woodBase * (0.65 + 0.35 * creviceAO), woodBase * 1.15 + uBarkSunlit * 0.18, diffuse);

    // Specular highlight
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(vWorldNormal, halfDir));
    float specular = pow(NdotH, 18.0) * 0.14 * (1.0 - creviceAO * 0.6);
    litWood += uBarkSunlit * specular;

    // Rim highlight
    float rim = pow(1.0 - max(0.0, dot(vWorldNormal, viewDir)), 3.0) * 0.10;
    litWood += uBarkGolden * rim;

    // 4. Growing root tip color transition during air descent
    vec3 col = mix(litWood, uTipColor, (1.0 - vIsGrounded) * smoothstep(0.65, 1.0, vProg) * 0.55);
    
    // 5. Basal Moss & Soil patina near ground contact (y ~ -0.18)
    if (vProg > 0.68) {
      float contact = smoothstep(0.68, 1.0, vProg) * vIsGrounded;
      col = mix(col, uSoilMoss, contact * 0.42);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Helper to construct organic hanging aerial root curves
function createAerialRootCurve(branchLimbPt, groundPt, segments = 20, waviness = 0.04) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Straight vertical drop with organic hanging waviness
    const x = THREE.MathUtils.lerp(branchLimbPt.x, groundPt.x, t) + Math.sin(i * 1.9 + branchLimbPt.x * 5.0) * waviness * (1.0 - t * 0.45);
    const y = THREE.MathUtils.lerp(branchLimbPt.y, groundPt.y, t);
    const z = THREE.MathUtils.lerp(branchLimbPt.z, groundPt.z, t) + Math.cos(i * 2.3 + branchLimbPt.z * 5.0) * waviness * (1.0 - t * 0.45);
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points);
}

export default function AerialRoots({ progressRef, cursorRef, quality = 'high' }) {
  const groupRef = useRef();

  const { aerialGeometries, aerialMaterial } = useMemo(() => {
    // Botanical anchor positions hanging from major horizontal Banyan limbs down to soil plane (y = -0.18)
    const aerialConfigs = [
      // ── TIER 1: PRIMARY HEAVY PROP PILLARS (Major Supporting Columns) ──
      {
        limbPt: new THREE.Vector3(-0.92, 1.46, 0.25),
        groundPt: new THREE.Vector3(-1.05, -0.18, 0.32),
        startProg: 0.48,
        landProg: 0.64,
        radius: 0.028,
        thickMult: 2.6, // Stout secondary trunk pillar
        waviness: 0.035,
      },
      {
        limbPt: new THREE.Vector3(0.88, 1.40, -0.22),
        groundPt: new THREE.Vector3(1.02, -0.18, -0.28),
        startProg: 0.52,
        landProg: 0.68,
        radius: 0.026,
        thickMult: 2.4,
        waviness: 0.035,
      },
      {
        limbPt: new THREE.Vector3(-0.58, 1.72, -0.50),
        groundPt: new THREE.Vector3(-0.70, -0.18, -0.58),
        startProg: 0.56,
        landProg: 0.72,
        radius: 0.024,
        thickMult: 2.2,
        waviness: 0.038,
      },
      {
        limbPt: new THREE.Vector3(0.62, 1.65, 0.45),
        groundPt: new THREE.Vector3(0.74, -0.18, 0.52),
        startProg: 0.58,
        landProg: 0.74,
        radius: 0.023,
        thickMult: 2.1,
        waviness: 0.038,
      },

      // ── TIER 2: MID-CANOPY DESCENDING PROP ROOTS ──
      {
        limbPt: new THREE.Vector3(-1.35, 1.35, 0.18),
        groundPt: new THREE.Vector3(-1.52, -0.18, 0.22),
        startProg: 0.62,
        landProg: 0.78,
        radius: 0.020,
        thickMult: 1.8,
        waviness: 0.042,
      },
      {
        limbPt: new THREE.Vector3(1.30, 1.32, 0.15),
        groundPt: new THREE.Vector3(1.48, -0.18, 0.18),
        startProg: 0.64,
        landProg: 0.80,
        radius: 0.019,
        thickMult: 1.8,
        waviness: 0.042,
      },
      {
        limbPt: new THREE.Vector3(-0.35, 1.85, 0.65),
        groundPt: new THREE.Vector3(-0.45, -0.18, 0.75),
        startProg: 0.66,
        landProg: 0.82,
        radius: 0.018,
        thickMult: 1.7,
        waviness: 0.045,
      },
      {
        limbPt: new THREE.Vector3(0.38, 1.80, -0.62),
        groundPt: new THREE.Vector3(0.48, -0.18, -0.72),
        startProg: 0.67,
        landProg: 0.82,
        radius: 0.018,
        thickMult: 1.7,
        waviness: 0.045,
      },

      // ── TIER 3: BRAIDED / ANASTOMOSING PAIRS ──
      {
        limbPt: new THREE.Vector3(-0.85, 1.50, 0.32),
        groundPt: new THREE.Vector3(-0.98, -0.18, 0.38),
        startProg: 0.54,
        landProg: 0.70,
        radius: 0.016,
        thickMult: 1.9,
        waviness: 0.055,
      },
      {
        limbPt: new THREE.Vector3(0.80, 1.45, -0.15),
        groundPt: new THREE.Vector3(0.95, -0.18, -0.20),
        startProg: 0.58,
        landProg: 0.73,
        radius: 0.016,
        thickMult: 1.8,
        waviness: 0.055,
      },

      // ── TIER 4: SLENDER DANGLING TENDRILS (Outer Canopy) ──
      {
        limbPt: new THREE.Vector3(-1.65, 1.25, -0.22),
        groundPt: new THREE.Vector3(-1.80, -0.18, -0.25),
        startProg: 0.70,
        landProg: 0.86,
        radius: 0.014,
        thickMult: 1.4,
        waviness: 0.065,
      },
      {
        limbPt: new THREE.Vector3(1.60, 1.22, 0.28),
        groundPt: new THREE.Vector3(1.75, -0.18, 0.32),
        startProg: 0.72,
        landProg: 0.87,
        radius: 0.014,
        thickMult: 1.4,
        waviness: 0.065,
      },
      {
        limbPt: new THREE.Vector3(-0.20, 2.05, -0.85),
        groundPt: new THREE.Vector3(-0.28, -0.18, -0.95),
        startProg: 0.74,
        landProg: 0.88,
        radius: 0.013,
        thickMult: 1.3,
        waviness: 0.070,
      },
      {
        limbPt: new THREE.Vector3(0.25, 2.00, 0.85),
        groundPt: new THREE.Vector3(0.32, -0.18, 0.95),
        startProg: 0.75,
        landProg: 0.89,
        radius: 0.013,
        thickMult: 1.3,
        waviness: 0.070,
      },
    ];

    // Mobile / Low tier uses fewer roots for performance
    const activeConfigs = quality === 'low' ? aerialConfigs.slice(0, 4) : quality === 'medium' ? aerialConfigs.slice(0, 8) : aerialConfigs;

    const geometries = [];
    const radialSegments = quality === 'low' ? 6 : 8;
    const tubularSegments = quality === 'low' ? 18 : 28;

    activeConfigs.forEach(({ limbPt, groundPt, startProg, landProg, radius, thickMult, waviness }) => {
      const curve = createAerialRootCurve(limbPt, groundPt, tubularSegments, waviness);
      const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
      const pos = tubeGeo.attributes.position;
      const count = pos.count;

      const aProg = new Float32Array(count);
      const aStartProgress = new Float32Array(count);
      const aLandProgress = new Float32Array(count);
      const aBaseRadius = new Float32Array(count);
      const aThickMultiplier = new Float32Array(count);
      const aWaviness = new Float32Array(count);

      const rings = tubularSegments + 1;
      const vertsPerRing = radialSegments + 1;

      for (let ring = 0; ring < rings; ring++) {
        const prog = ring / (rings - 1);
        for (let v = 0; v < vertsPerRing; v++) {
          const idx = ring * vertsPerRing + v;
          if (idx < count) {
            aProg[idx] = prog;
            aStartProgress[idx] = startProg;
            aLandProgress[idx] = landProg;
            aBaseRadius[idx] = radius;
            aThickMultiplier[idx] = thickMult;
            aWaviness[idx] = waviness;
          }
        }
      }

      tubeGeo.setAttribute('aProg', new THREE.BufferAttribute(aProg, 1));
      tubeGeo.setAttribute('aStartProgress', new THREE.BufferAttribute(aStartProgress, 1));
      tubeGeo.setAttribute('aLandProgress', new THREE.BufferAttribute(aLandProgress, 1));
      tubeGeo.setAttribute('aBaseRadius', new THREE.BufferAttribute(aBaseRadius, 1));
      tubeGeo.setAttribute('aThickMultiplier', new THREE.BufferAttribute(aThickMultiplier, 1));
      tubeGeo.setAttribute('aWaviness', new THREE.BufferAttribute(aWaviness, 1));

      geometries.push(tubeGeo);
    });

    const mat = new THREE.ShaderMaterial({
      vertexShader: AERIAL_ROOT_VERTEX_SHADER,
      fragmentShader: AERIAL_ROOT_FRAGMENT_SHADER,
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uBarkDeep: { value: new THREE.Color('#14110e') },     // Deep fissure shadow
        uBarkDark: { value: new THREE.Color('#34261c') },     // Sub-bark raw umber
        uBarkMid: { value: new THREE.Color('#554c44') },      // Weathered stone gray-brown
        uBarkWarm: { value: new THREE.Color('#6e665d') },     // Aged matte ash-umber
        uBarkGolden: { value: new THREE.Color('#8e867c') },   // Cool weathered dry bark gray
        uBarkSunlit: { value: new THREE.Color('#b0a89d') },   // Sunlit dry ash-stone crest
        uTipColor: { value: new THREE.Color('#5c4a3d') },     // Tender descending root tip
        uSoilMoss: { value: new THREE.Color('#3d5c2a') },     // Basal moss & soil patina
      },
      side: THREE.DoubleSide,
    });

    return { aerialGeometries: geometries, aerialMaterial: mat };
  }, [quality]);

  useFrame((state) => {
    if (!aerialMaterial) return;

    const p = progressRef.current || 0;
    aerialMaterial.uniforms.uScrollProgress.value = p;
    aerialMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;
    aerialMaterial.uniforms.uCursor.value.set(curX, curY);

    if (groupRef.current) {
      groupRef.current.visible = p >= 0.46;
    }
  });

  return (
    <group ref={groupRef}>
      {aerialGeometries.map((geo, idx) => (
        <mesh
          key={idx}
          geometry={geo}
          material={aerialMaterial}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
