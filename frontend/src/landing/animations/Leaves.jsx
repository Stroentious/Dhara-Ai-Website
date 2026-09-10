import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Leaves Component — Real Botanical 3D Banyan Leaf Canopy (*Ficus benghalensis*)
 * 
 * Botanical & Realism Specifications:
 * - Real 3D Ovate Leaf Geometry: Broad blade surface with pointed apex drip-tip,
 *   narrow petiole base, central midrib V-fold, lateral camber wings, and longitudinal sag.
 * - Organic Blade Margins: Subtle undulating crenulation along edges to eliminate flat/paper appearance.
 * - Dense 8-Leaf Compound Cluster: 8 distinct broad overlapping leaves per spray twig
 *   arranged in natural alternate phyllotaxis with organic outward pitch, yaw, and roll.
 * - Multi-Lobed Irregular Canopy Architecture:
 *   Azimuthal harmonics break the spherical "tree-ball" into sprawling boughs and billowy foliage pads.
 *   Natural canopy windows and skylight valleys keep the internal wooden branch scaffold visible.
 * - Multi-Tier Volumetric Canopy (Up to 320 clusters on High):
 *   Tier 1: Lower Scaffold Foliage Pads (y ~ 1.25m to 1.75m)
 *   Tier 2: Broad Mid-Canopy Spreading Mantle (y ~ 1.65m to 2.45m, radius up to 2.6m)
 *   Tier 3: Upper Canopy Dense Foliage Lobes (y ~ 2.25m to 2.95m)
 *   Tier 4: Broad Umbrella Crown Crest (y ~ 2.75m to 3.45m)
 * - Grounded Earthy Botanical Palette: Deep interior shadow (#0b1a0e) -> shaded foliage (#14361a)
 *   -> mature waxy banyan green (#225327) -> fresh daylight foliage (#3a753d) -> sunlit crest (#5b934a).
 *   (Zero neon green, plastic, or cartoon glow).
 * - Subsurface Light Transmission (SSS) & Waxy Cuticle Specular Reflection.
 * - 100% Reversible scroll growth timeline.
 */

const LEAF_VERTEX_SHADER = /* glsl */`
  attribute float aStartProgress; // When this specific cluster starts emerging (0.44 to 0.88)
  attribute float aPhase;         // Natural breeze frequency offset
  attribute float aSizeScale;     // Clump size variation (0.75x to 1.45x)
  attribute vec3 aBaseRotation;   // Outward orientation [pitch, yaw, roll]
  attribute float aTier;          // 1.0 = Lower branch pads, 2.0 = Mid body, 3.0 = Upper canopy, 4.0 = Crown dome
  attribute float aLeafIndex;     // Index of leaf within cluster (0 to 7)
  attribute vec3 aLeafLocalPos;   // Leaf offset relative to cluster node
  attribute float aColorJitter;   // Natural per-cluster organic hue shift

  uniform float uScrollProgress;
  uniform float uTime;
  uniform vec2 uCursor;

  varying vec2 vUv;
  varying float vLeafGrowth;
  varying float vSunlight;
  varying float vTier;
  varying float vColorJitter;
  varying float vClumpDepth;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      c, 0.0, s,
      0.0, 1.0, 0.0,
      -s, 0.0, c
    );
  }

  mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, -s,
      0.0, s, c
    );
  }

  mat3 rotateZ(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      c, -s, 0.0,
      s, c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  void main() {
    vUv = uv;
    vTier = aTier;
    vColorJitter = aColorJitter;

    // ── 1. INDIVIDUAL CLUSTER GROWTH TIMELINE ──
    float rawProgress = (uScrollProgress - aStartProgress) / 0.16;
    float leafGrowth = clamp(rawProgress, 0.0, 1.0);
    leafGrowth = smoothstep(0.0, 1.0, leafGrowth);
    vLeafGrowth = leafGrowth;

    vec3 p = position;

    if (leafGrowth <= 0.001) {
      p = vec3(0.0);
    } else {
      // ── 2. EXPANSION FROM CLUSTER TWIG ORIGIN ──
      p += aLeafLocalPos * (0.35 + 0.65 * leafGrowth);
      p *= aSizeScale * leafGrowth;
    }

    // ── 3. GENTLE NATURAL ENVIRONMENTAL BREEZE ──
    float breezeMain = sin(uTime * 0.65 + aPhase) * 0.020;
    float breezeLeaf = sin(uTime * 1.15 + aPhase * 1.4 + aLeafIndex * 0.6) * 0.008;
    float totalBreeze = breezeMain + breezeLeaf;

    // Cursor interactive air deflection
    vec3 worldOrigin = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float cursorDist = length(worldOrigin.xy - uCursor * 2.2);
    float cursorWind = max(0.0, 1.0 - cursorDist * 0.45) * 0.06;
    totalBreeze += sin(uTime * 2.2 + aPhase) * cursorWind;

    // Rotate the cluster as a solid botanical unit
    mat3 rotMat = rotateY(aBaseRotation.y + totalBreeze) * 
                  rotateX(aBaseRotation.x + totalBreeze * 0.6) * 
                  rotateZ(aBaseRotation.z + totalBreeze * 0.4);
    p = rotMat * p;

    // ── 4. CANOPY ILLUMINATION PARAMETERS ──
    vSunlight = clamp((worldOrigin.y - 1.20) / 1.95, 0.0, 1.0);
    float radialDist = length(worldOrigin.xz);
    vClumpDepth = clamp(radialDist / 2.30, 0.0, 1.0);

    vec4 worldPos = instanceMatrix * vec4(p, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize((instanceMatrix * vec4(rotMat * normal, 0.0)).xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const LEAF_FRAGMENT_SHADER = /* glsl */`
  uniform float uScrollProgress;
  uniform vec3 uDeepShadowColor; // Deep interior shaded foliage (#0b1a0e)
  uniform vec3 uUnderstoryColor; // Shaded inner banyan leaves (#14361a)
  uniform vec3 uMatureColor;     // Natural rich banyan green (#225327)
  uniform vec3 uOuterColor;      // Fresh daylight foliage (#3a753d)
  uniform vec3 uSunHighlight;    // Gentle warm sunlit highlight (#5b934a)

  varying vec2 vUv;
  varying float vLeafGrowth;
  varying float vSunlight;
  varying float vTier;
  varying float vColorJitter;
  varying float vClumpDepth;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  // Analytical bump normal for botanical veins
  vec3 computeLeafBumpedNormal(vec3 surfNorm, vec3 surfPos, float height, float bumpScale) {
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
    if (vLeafGrowth <= 0.002) {
      discard;
    }

    // ── 1. BOTANICAL VENATION RELIEF & MESOPHYLL PILLOWING ──
    float midribDist = abs(vUv.x - 0.5);
    float midribBump = exp(-midribDist * 32.0) * (1.0 - vUv.y * 0.45);

    // Arcing lateral pinnate veins
    float latPhase = vUv.y * 14.0 + (1.0 - midribDist * 1.8) * 0.75;
    float latVeins = pow(abs(sin(latPhase * 3.14159)), 16.0) * (1.0 - midribDist * 0.9);
    float veinHeight = midribBump * 0.70 + latVeins * 0.30;

    // Normal perturbation
    vec3 bumpedNormal = computeLeafBumpedNormal(vWorldNormal, vWorldPos, veinHeight, 0.026);

    // ── 2. SUNLIGHT & LIGHTING RESPONSE ──
    vec3 sunDir = normalize(vec3(0.55, 0.85, 0.40));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float NdotL = dot(bumpedNormal, sunDir);
    float frontDiffuse = clamp(NdotL * 0.58 + 0.42, 0.0, 1.0);

    // Subsurface Scattering (SSS): Soft natural translucent green transmission when backlit
    float backScatter = max(0.0, dot(-bumpedNormal, sunDir));
    float sss = pow(backScatter, 2.4) * 0.44 * (1.0 - midribBump * 0.5);

    // Ambient Occlusion in interior canopy layers
    float canopyAO = clamp(vClumpDepth * 0.48 + vSunlight * 0.42 + 0.18, 0.0, 1.0);
    canopyAO *= clamp(bumpedNormal.y * 0.28 + 0.72, 0.0, 1.0);

    // ── 3. BOTANICAL COLOR PALETTE COMPOSITION ──
    vec3 deepLayer = mix(uDeepShadowColor, uUnderstoryColor, canopyAO);
    vec3 midLayer = mix(uUnderstoryColor, uMatureColor, vClumpDepth * 0.55 + vSunlight * 0.45);
    vec3 sunLayer = mix(uMatureColor, uOuterColor, vSunlight);
    vec3 crownLayer = mix(uOuterColor, uSunHighlight, smoothstep(0.60, 1.0, vSunlight));

    vec3 baseColor;
    if (vSunlight < 0.35) {
      baseColor = mix(deepLayer, midLayer, vSunlight / 0.35);
    } else if (vSunlight < 0.75) {
      baseColor = mix(midLayer, sunLayer, (vSunlight - 0.35) / 0.40);
    } else {
      baseColor = mix(sunLayer, crownLayer, (vSunlight - 0.75) / 0.25);
    }

    // Apply subtle per-cluster organic hue shift
    baseColor += vec3(vColorJitter * 0.020, vColorJitter * 0.035, vColorJitter * 0.010);

    // Midrib vascular paler green highlight
    vec3 midribCol = mix(baseColor, vec3(0.42, 0.68, 0.30), 0.30);
    baseColor = mix(baseColor, midribCol, clamp(midribBump * 1.4, 0.0, 1.0));

    // Combine diffuse & natural SSS
    vec3 litColor = baseColor * (frontDiffuse * canopyAO + 0.16);
    vec3 sssColor = vec3(0.36, 0.58, 0.20) * sss;
    vec3 finalColor = litColor + sssColor;

    // ── 4. WAXY CUTICLE SPECULAR HIGHLIGHT ──
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(bumpedNormal, halfDir));
    float specular = pow(NdotH, 28.0) * 0.22 * (1.0 - veinHeight * 0.45);
    finalColor += vec3(0.92, 0.96, 0.90) * specular;

    // Subtle grazing rim light for depth separation
    float rim = pow(1.0 - max(0.0, dot(bumpedNormal, viewDir)), 3.5) * 0.10 * vSunlight;
    finalColor += uSunHighlight * rim;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Helper: Real 3D Ovate Leaf Blade with pointed apex drip-tip, petiole taper, lateral camber, and undulating margins
function createBroadOvateLeafGeometry(width = 0.16, length = 0.28, segmentsW = 10, segmentsL = 16) {
  const geom = new THREE.PlaneGeometry(width, length, segmentsW, segmentsL);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Normalize coordinates: Y from 0.0 (petiole) to 1.0 (drip-tip)
    const normY = (v.y + length * 0.5) / length;
    const normX = v.x / (width * 0.5); // -1.0 to 1.0

    // Ovate leaf silhouette: slender petiole base, broad belly at 40%, acute drip-tip at apex
    let widthProfile;
    if (normY < 0.14) {
      widthProfile = Math.sin((normY / 0.14) * Math.PI * 0.5) * 0.50 + 0.14;
    } else if (normY < 0.44) {
      const t = (normY - 0.14) / 0.30;
      widthProfile = 0.64 + Math.sin(t * Math.PI * 0.5) * 0.38;
    } else {
      const t = (normY - 0.44) / 0.56;
      widthProfile = 1.02 * (1.0 - Math.pow(t, 1.40)) + 0.02;
    }

    // Natural undulating margin wave along blade edges (eliminates cardboard/paper look)
    const marginWave = Math.sin(normY * 20.0) * 0.045 * (1.0 - normY) * Math.sin(normY * Math.PI);
    v.x *= (widthProfile + marginWave);

    // 3D Botanical Curvature:
    // 1. Central midrib axial crease (sharp V-groove along Y axis)
    const midribFold = -Math.abs(normX) * 0.018 * (1.0 - Math.pow(normY - 0.5, 2.0));
    // 2. Transverse lateral camber (leaf halves arch up and roll towards margin)
    const lateralCamber = (1.0 - Math.pow(normX, 2.0)) * 0.016 * Math.sin(normY * Math.PI * 0.9);
    // 3. Longitudinal arch (gentle upward emergence then downward drip-tip sag)
    const longitudinalArch = (normY * 0.010) - Math.pow(normY, 1.85) * 0.046;
    // 4. Subtle natural blade twist
    const bladeTwist = normX * Math.sin(normY * Math.PI) * 0.007;

    v.z += midribFold + lateralCamber + longitudinalArch + bladeTwist;
    v.y += length * 0.48; // Petiole sits at node origin (0, 0, 0)

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

// Helper: Dense 8-Leaf Compound Cluster Geometry (Fuller & Denser Foliage Spray with Natural Alternate Phyllotaxis)
function createDenseBanyanFoliageCluster() {
  const baseLeafGeo = createBroadOvateLeafGeometry(0.16, 0.28, 10, 16);
  const geometries = [];

  const leafConfigs = [
    // 1. Terminal Apex Top Leaf (Pioneering shoot leader)
    {
      pos: [0, 0.16, 0],
      pitch: THREE.MathUtils.degToRad(14),
      yaw: 0,
      roll: 0,
      scale: 1.22,
    },
    // 2. Upper-Right Lateral Leaf
    {
      pos: [0.080, 0.11, 0.042],
      pitch: THREE.MathUtils.degToRad(24),
      yaw: THREE.MathUtils.degToRad(50),
      roll: THREE.MathUtils.degToRad(-14),
      scale: 1.10,
    },
    // 3. Upper-Left Lateral Leaf
    {
      pos: [-0.080, 0.10, 0.038],
      pitch: THREE.MathUtils.degToRad(26),
      yaw: THREE.MathUtils.degToRad(-54),
      roll: THREE.MathUtils.degToRad(16),
      scale: 1.08,
    },
    // 4. Mid-Right Lateral Spreader Leaf
    {
      pos: [0.102, 0.04, -0.024],
      pitch: THREE.MathUtils.degToRad(34),
      yaw: THREE.MathUtils.degToRad(98),
      roll: THREE.MathUtils.degToRad(-20),
      scale: 1.04,
    },
    // 5. Mid-Left Lateral Spreader Leaf
    {
      pos: [-0.098, 0.03, -0.028],
      pitch: THREE.MathUtils.degToRad(32),
      yaw: THREE.MathUtils.degToRad(-102),
      roll: THREE.MathUtils.degToRad(22),
      scale: 1.02,
    },
    // 6. Rear-Right Canopy Infill Leaf
    {
      pos: [0.065, 0.02, -0.070],
      pitch: THREE.MathUtils.degToRad(42),
      yaw: THREE.MathUtils.degToRad(148),
      roll: THREE.MathUtils.degToRad(-16),
      scale: 0.96,
    },
    // 7. Rear-Left Canopy Infill Leaf
    {
      pos: [-0.065, 0.01, -0.075],
      pitch: THREE.MathUtils.degToRad(40),
      yaw: THREE.MathUtils.degToRad(-152),
      roll: THREE.MathUtils.degToRad(18),
      scale: 0.94,
    },
    // 8. Basal Underbelly Drop Leaf (Drooping down to frame lower branch)
    {
      pos: [0, -0.05, 0.065],
      pitch: THREE.MathUtils.degToRad(52),
      yaw: THREE.MathUtils.degToRad(180),
      roll: THREE.MathUtils.degToRad(8),
      scale: 0.90,
    },
  ];

  leafConfigs.forEach((cfg, k) => {
    const leaf = baseLeafGeo.clone();
    leaf.scale(cfg.scale, cfg.scale, cfg.scale);
    leaf.rotateX(cfg.pitch);
    leaf.rotateZ(cfg.roll);
    leaf.rotateY(cfg.yaw);
    leaf.translate(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

    const count = leaf.attributes.position.count;
    const aLeafIndex = new Float32Array(count).fill(k);
    const aLeafLocalPos = new Float32Array(count * 3);
    for (let j = 0; j < count; j++) {
      aLeafLocalPos[j * 3 + 0] = cfg.pos[0];
      aLeafLocalPos[j * 3 + 1] = cfg.pos[1];
      aLeafLocalPos[j * 3 + 2] = cfg.pos[2];
    }

    leaf.setAttribute('aLeafIndex', new THREE.BufferAttribute(aLeafIndex, 1));
    leaf.setAttribute('aLeafLocalPos', new THREE.BufferAttribute(aLeafLocalPos, 3));
    geometries.push(leaf);
  });

  // Merge geometries into single optimized compound cluster geometry
  let totalVerts = 0;
  let totalIndices = 0;
  geometries.forEach(g => {
    totalVerts += g.attributes.position.count;
    totalIndices += g.index.count;
  });

  const mergedPos = new Float32Array(totalVerts * 3);
  const mergedUvs = new Float32Array(totalVerts * 2);
  const mergedNorms = new Float32Array(totalVerts * 3);
  const mergedLeafIdx = new Float32Array(totalVerts);
  const mergedLeafLocPos = new Float32Array(totalVerts * 3);
  const mergedIndices = new Uint32Array(totalIndices);

  let vOffset = 0;
  let iOffset = 0;

  geometries.forEach(g => {
    const p = g.attributes.position.array;
    const u = g.attributes.uv.array;
    const n = g.attributes.normal.array;
    const li = g.attributes.aLeafIndex.array;
    const lp = g.attributes.aLeafLocalPos.array;
    const ind = g.index.array;
    const count = g.attributes.position.count;

    mergedPos.set(p, vOffset * 3);
    mergedUvs.set(u, vOffset * 2);
    mergedNorms.set(n, vOffset * 3);
    mergedLeafIdx.set(li, vOffset);
    mergedLeafLocPos.set(lp, vOffset * 3);

    for (let k = 0; k < ind.length; k++) {
      mergedIndices[iOffset + k] = ind[k] + vOffset;
    }

    vOffset += count;
    iOffset += ind.length;
  });

  const compoundGeo = new THREE.BufferGeometry();
  compoundGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  compoundGeo.setAttribute('uv', new THREE.BufferAttribute(mergedUvs, 2));
  compoundGeo.setAttribute('normal', new THREE.BufferAttribute(mergedNorms, 3));
  compoundGeo.setAttribute('aLeafIndex', new THREE.BufferAttribute(mergedLeafIdx, 1));
  compoundGeo.setAttribute('aLeafLocalPos', new THREE.BufferAttribute(mergedLeafLocPos, 3));
  compoundGeo.setIndex(new THREE.BufferAttribute(mergedIndices, 1));

  return compoundGeo;
}

/**
 * Pure helper to compute consistent 3D position and growth properties for cluster `i`
 * Breaks the spherical tree-ball into organic sprawling boughs with natural canopy gaps.
 */
function getClusterTransform(i, clusterCount) {
  const norm = i / clusterCount;
  const phi = 2.399963229728653; // Golden angle
  const baseAngle = (i * phi) + ((i % 7) * 0.14);

  // Multi-frequency azimuthal harmonics to generate organic irregular bough lobes
  const lobeHarmonics = 
    Math.sin(baseAngle * 3.0 + 0.4) * 0.26 + 
    Math.cos(baseAngle * 2.0 - 0.7) * 0.16 + 
    Math.sin(baseAngle * 5.0 + 1.2) * 0.08;

  // Natural canopy windows & light gaps (leaving pockets where wooden branches are visible)
  const windowFactor = Math.cos(baseAngle * 4.0 + 1.4);
  const isWindow = windowFactor > 0.65;
  const windowRadialMod = isWindow ? -0.22 : 0.0;

  let height, radius, startProg, tier, baseScale;

  if (norm < 0.15) {
    // Tier 1: Lower Scaffold Foliage Pads (y ~ 1.25m to 1.75m)
    const t = norm / 0.15;
    height = 1.25 + (t * 0.48);
    const baseR = 0.90 + (Math.sin(t * Math.PI) * 1.10) + ((i % 5) * 0.06);
    radius = baseR * (1.0 + lobeHarmonics * 0.9) + windowRadialMod;
    startProg = 0.44 + (t * 0.14) + (Math.sin(i * 3.1) * 0.02);
    tier = 1.0;
    baseScale = 0.98;
  } else if (norm < 0.50) {
    // Tier 2: Broad Mid-Canopy Spreading Mantle (y ~ 1.65m to 2.45m, radius up to 2.6m)
    const t = (norm - 0.15) / 0.35;
    height = 1.65 + (t * 0.75);
    const baseR = 1.10 + (Math.sin(t * Math.PI * 0.92) * 1.50) + ((i % 4) * 0.08);
    radius = baseR * (1.0 + lobeHarmonics * 1.1) + windowRadialMod;
    startProg = 0.50 + (t * 0.16) + (Math.sin(i * 2.7) * 0.02);
    tier = 2.0;
    baseScale = 1.12;
  } else if (norm < 0.82) {
    // Tier 3: Upper Canopy Dense Foliage Lobes (y ~ 2.25m to 2.95m, thick & billowing)
    const t = (norm - 0.50) / 0.32;
    height = 2.25 + (t * 0.70);
    const baseR = 1.00 + (Math.sin(t * Math.PI * 0.88) * 1.30) + ((i % 3) * 0.09);
    radius = baseR * (1.0 + lobeHarmonics * 0.95) + windowRadialMod;
    startProg = 0.58 + (t * 0.16) + (Math.sin(i * 4.1) * 0.02);
    tier = 3.0;
    baseScale = 1.16;
  } else {
    // Tier 4: Broad Umbrella Crown Crest (y ~ 2.75m to 3.45m, wide & organic)
    const t = (norm - 0.82) / 0.18;
    height = 2.75 + (Math.pow(t, 0.75) * 0.68);
    const baseR = (1.0 - t * 0.30) * (1.40 + Math.sin(i * 3.1) * 0.35);
    radius = baseR * (1.0 + lobeHarmonics * 0.7);
    startProg = 0.66 + (t * 0.15) + (Math.sin(i * 1.9) * 0.02);
    tier = 4.0;
    baseScale = 1.06;
  }

  const x = Math.cos(baseAngle) * radius;
  const z = Math.sin(baseAngle) * radius;
  const y = height + (Math.sin(i * 3.7) * 0.14) + (lobeHarmonics * 0.08);

  // Natural outward pitch and roll towards sunlight
  const outwardDir = new THREE.Vector2(x, z).normalize();
  const yawAngle = Math.atan2(outwardDir.x, outwardDir.y);
  const pitchAngle = THREE.MathUtils.degToRad(-14 + (tier * 7.5) + (Math.sin(i * 2.1) * 11));
  const rollAngle = THREE.MathUtils.degToRad(Math.sin(i * 5.4) * 16);

  return {
    pos: [x, y, z],
    rot: [pitchAngle, yawAngle, rollAngle],
    startProg: Math.min(0.88, Math.max(0.44, startProg)),
    tier,
    baseScale,
    phase: (i * 1.25) + ((i % 5) * 0.8),
    sizeScale: baseScale * (0.86 + Math.sin(i * 4.3) * 0.20 + ((i % 4) * 0.08)),
    colorJitter: (Math.sin(i * 7.1) + Math.cos(i * 3.3)) * 0.5,
  };
}

export default function Leaves({ progressRef, cursorRef, quality = 'high' }) {
  const instancedMeshRef = useRef();

  // Dense, organic canopy clustering (120 for low, 220 for medium, 320 for high)
  const clusterCount = quality === 'low' ? 120 : quality === 'medium' ? 220 : 320;
  const clusterGeo = useMemo(() => createDenseBanyanFoliageCluster(), []);

  const { customGeo, leafMaterial } = useMemo(() => {
    const geo = clusterGeo.clone();

    const aStartProgress = new Float32Array(clusterCount);
    const aPhase = new Float32Array(clusterCount);
    const aSizeScale = new Float32Array(clusterCount);
    const aBaseRotation = new Float32Array(clusterCount * 3);
    const aTier = new Float32Array(clusterCount);
    const aColorJitter = new Float32Array(clusterCount);

    for (let i = 0; i < clusterCount; i++) {
      const data = getClusterTransform(i, clusterCount);

      aStartProgress[i] = data.startProg;
      aPhase[i] = data.phase;
      aSizeScale[i] = data.sizeScale;
      aTier[i] = data.tier;
      aColorJitter[i] = data.colorJitter;

      aBaseRotation[i * 3 + 0] = data.rot[0];
      aBaseRotation[i * 3 + 1] = data.rot[1];
      aBaseRotation[i * 3 + 2] = data.rot[2];
    }

    geo.setAttribute('aStartProgress', new THREE.InstancedBufferAttribute(aStartProgress, 1));
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
    geo.setAttribute('aSizeScale', new THREE.InstancedBufferAttribute(aSizeScale, 1));
    geo.setAttribute('aTier', new THREE.InstancedBufferAttribute(aTier, 1));
    geo.setAttribute('aColorJitter', new THREE.InstancedBufferAttribute(aColorJitter, 1));
    geo.setAttribute('aBaseRotation', new THREE.InstancedBufferAttribute(aBaseRotation, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: LEAF_VERTEX_SHADER,
      fragmentShader: LEAF_FRAGMENT_SHADER,
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        // Authentic Earthy Botanical Palette (No neon, plastic, or cartoon tones)
        uDeepShadowColor: { value: new THREE.Color('#0b1a0e') }, // Deep interior shaded foliage
        uUnderstoryColor: { value: new THREE.Color('#14361a') }, // Shaded inner banyan leaves
        uMatureColor:     { value: new THREE.Color('#225327') }, // Natural rich banyan green
        uOuterColor:      { value: new THREE.Color('#3a753d') }, // Fresh daylight foliage
        uSunHighlight:    { value: new THREE.Color('#5b934a') }, // Gentle warm sunlit highlight
      },
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    return { customGeo: geo, leafMaterial: mat };
  }, [clusterCount, clusterGeo]);

  useFrame((state) => {
    if (!instancedMeshRef.current || !leafMaterial) return;

    const p = progressRef.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;

    leafMaterial.uniforms.uScrollProgress.value = p;
    leafMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    leafMaterial.uniforms.uCursor.value.set(curX, curY);

    // Populate instance matrices on mount using getClusterTransform
    if (!instancedMeshRef.current.__initialized) {
      const dummy = new THREE.Object3D();

      for (let i = 0; i < clusterCount; i++) {
        const data = getClusterTransform(i, clusterCount);
        dummy.position.set(data.pos[0], data.pos[1], data.pos[2]);
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      instancedMeshRef.current.__initialized = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[customGeo, leafMaterial, clusterCount]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}
