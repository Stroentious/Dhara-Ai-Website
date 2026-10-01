import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Leaves Component — Real Botanical 3D Banyan Leaf Canopy (*Ficus benghalensis*)
 * 
 * Botanical & Density Specifications:
 * - Real 3D Ovate Leaf Geometry: Broad leaf blade surface with pointed apex drip-tip,
 *   narrow petiole base, central midrib fold, and longitudinal arch.
 * - Dense 8-Leaf Compound Cluster: 8 distinct broad overlapping leaves per cluster spray
 *   arranged in natural phyllotaxis with organic outward pitch and roll.
 * - Multi-Tier Volumetric Canopy (Up to 320 clusters on High):
 *   Tier 1: Lower Scaffold Foliage Pads (y ~ 1.25m to 1.70m)
 *   Tier 2: Broad Mid-Canopy Spreading Mantle (y ~ 1.65m to 2.35m, radius up to 2.4m)
 *   Tier 3: Upper Canopy Dense Foliage Lobes (y ~ 2.20m to 2.85m)
 *   Tier 4: Broad Umbrella Crown Dome Crest (y ~ 2.70m to 3.35m)
 * - Organic Silhouette: Billowing foliage pads with natural light gaps revealing structural boughs.
 * - Natural Color Grading: Deep understory green (#061a0b) -> shaded foliage (#0e3818)
 *   -> vibrant living banyan green (#1b6e31) -> fresh outer leaf (#3ea552) -> sunlit golden crest (#8ee22c).
 * - Subsurface Light Scattering (SSS) & Waxy Cuticle Specular Reflection.
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
    float breezeMain = sin(uTime * 0.65 + aPhase) * 0.022;
    float breezeLeaf = sin(uTime * 1.15 + aPhase * 1.4 + aLeafIndex * 0.6) * 0.010;
    float totalBreeze = breezeMain + breezeLeaf;

    // Cursor interactive air deflection
    vec3 worldOrigin = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float cursorDist = length(worldOrigin.xy - uCursor * 2.2);
    float cursorWind = max(0.0, 1.0 - cursorDist * 0.45) * 0.08;
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
  uniform vec3 uDeepShadowColor; // Deep interior shaded foliage (#061a0b)
  uniform vec3 uUnderstoryColor; // Shaded inner banyan leaves (#0e3818)
  uniform vec3 uMatureColor;     // Vibrant banyan green (#1b6e31)
  uniform vec3 uOuterColor;      // Fresh sun-facing foliage (#3ea552)
  uniform vec3 uSunHighlight;    // Sun-drenched golden crown tip (#8ee22c)

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
    float latVeins = pow(abs(sin(latPhase * 3.14159)), 18.0) * (1.0 - midribDist * 0.9);
    float veinHeight = midribBump * 0.70 + latVeins * 0.30;

    // Normal perturbation
    vec3 bumpedNormal = computeLeafBumpedNormal(vWorldNormal, vWorldPos, veinHeight, 0.024);

    // ── 2. SUNLIGHT & LIGHTING RESPONSE ──
    vec3 sunDir = normalize(vec3(0.55, 0.85, 0.40));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float NdotL = dot(bumpedNormal, sunDir);
    float frontDiffuse = clamp(NdotL * 0.60 + 0.40, 0.0, 1.0);

    // Subsurface Scattering (SSS): Translucent chartreuse radiance when backlit
    float backScatter = max(0.0, dot(-bumpedNormal, sunDir));
    float sss = pow(backScatter, 2.2) * 0.52 * (1.0 - midribBump * 0.5);

    // Ambient Occlusion in interior canopy layers
    float canopyAO = clamp(vClumpDepth * 0.45 + vSunlight * 0.40 + 0.20, 0.0, 1.0);
    canopyAO *= clamp(bumpedNormal.y * 0.25 + 0.75, 0.0, 1.0);

    // ── 3. BOTANICAL COLOR PALETTE COMPOSITION ──
    vec3 deepLayer = mix(uDeepShadowColor, uUnderstoryColor, canopyAO);
    vec3 midLayer = mix(uUnderstoryColor, uMatureColor, vClumpDepth * 0.6 + vSunlight * 0.4);
    vec3 sunLayer = mix(uMatureColor, uOuterColor, vSunlight);
    vec3 crownLayer = mix(uOuterColor, uSunHighlight, smoothstep(0.65, 1.0, vSunlight));

    vec3 baseColor;
    if (vSunlight < 0.35) {
      baseColor = mix(deepLayer, midLayer, vSunlight / 0.35);
    } else if (vSunlight < 0.75) {
      baseColor = mix(midLayer, sunLayer, (vSunlight - 0.35) / 0.40);
    } else {
      baseColor = mix(sunLayer, crownLayer, (vSunlight - 0.75) / 0.25);
    }

    // Apply natural per-cluster color jitter
    baseColor += vec3(vColorJitter * 0.035, vColorJitter * 0.055, vColorJitter * 0.015);

    // Midrib vascular paler green highlight
    vec3 midribCol = mix(baseColor, vec3(0.55, 0.85, 0.32), 0.35);
    baseColor = mix(baseColor, midribCol, clamp(midribBump * 1.5, 0.0, 1.0));

    // Combine diffuse & SSS
    vec3 litColor = baseColor * (frontDiffuse * canopyAO + 0.15);
    vec3 sssColor = vec3(0.56, 0.88, 0.20) * sss;
    vec3 finalColor = litColor + sssColor;

    // ── 4. WAXY CUTICLE SPECULAR HIGHLIGHT ──
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(bumpedNormal, halfDir));
    float specular = pow(NdotH, 24.0) * 0.28 * (1.0 - veinHeight * 0.4);
    finalColor += vec3(0.92, 0.98, 0.88) * specular;

    // Subtle grazing rim light
    float rim = pow(1.0 - max(0.0, dot(bumpedNormal, viewDir)), 3.5) * 0.14 * vSunlight;
    finalColor += uSunHighlight * rim;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Helper: Real 3D Ovate Leaf Blade with pointed apex drip-tip, petiole taper, and midrib fold
function createBroadOvateLeafGeometry(width = 0.14, length = 0.24, segmentsW = 10, segmentsL = 14) {
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
    if (normY < 0.15) {
      widthProfile = Math.sin((normY / 0.15) * Math.PI * 0.5) * 0.55 + 0.15;
    } else if (normY < 0.45) {
      const t = (normY - 0.15) / 0.30;
      widthProfile = 0.70 + Math.sin(t * Math.PI * 0.5) * 0.35;
    } else {
      const t = (normY - 0.45) / 0.55;
      widthProfile = 1.05 * (1.0 - Math.pow(t, 1.45)) + 0.02;
    }
    v.x *= widthProfile;

    // 3D Curvature:
    // 1. Central midrib axial crease (V-fold along Y axis)
    const midribFold = -Math.abs(normX) * 0.016 * (1.0 - Math.pow(normY - 0.5, 2.0));
    // 2. Transverse lateral wing upward cupping
    const lateralCup = Math.pow(normX, 2.0) * 0.012 * Math.sin(normY * Math.PI);
    // 3. Longitudinal arch (gentle downward tip sag)
    const longitudinalArch = -Math.pow(normY, 1.9) * 0.038;

    v.z += midribFold + lateralCup + longitudinalArch;
    v.y += length * 0.45; // Petiole sits at node origin (0, 0, 0)

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

// Helper: Dense 8-Leaf Compound Cluster Geometry (Fuller & Denser Foliage Spray)
function createDenseBanyanFoliageCluster() {
  const baseLeafGeo = createBroadOvateLeafGeometry(0.15, 0.26, 8, 12);
  const geometries = [];

  const leafConfigs = [
    // 1. Terminal Apex Top Leaf
    {
      pos: [0, 0.14, 0],
      pitch: THREE.MathUtils.degToRad(16),
      yaw: 0,
      roll: 0,
      scale: 1.18,
    },
    // 2. Upper-Right Lateral Leaf
    {
      pos: [0.075, 0.09, 0.040],
      pitch: THREE.MathUtils.degToRad(26),
      yaw: THREE.MathUtils.degToRad(48),
      roll: THREE.MathUtils.degToRad(-16),
      scale: 1.06,
    },
    // 3. Upper-Left Lateral Leaf
    {
      pos: [-0.075, 0.08, 0.035],
      pitch: THREE.MathUtils.degToRad(28),
      yaw: THREE.MathUtils.degToRad(-52),
      roll: THREE.MathUtils.degToRad(18),
      scale: 1.04,
    },
    // 4. Mid-Right Lateral Spreader Leaf
    {
      pos: [0.095, 0.03, -0.025],
      pitch: THREE.MathUtils.degToRad(36),
      yaw: THREE.MathUtils.degToRad(95),
      roll: THREE.MathUtils.degToRad(-24),
      scale: 1.02,
    },
    // 5. Mid-Left Lateral Spreader Leaf
    {
      pos: [-0.090, 0.02, -0.030],
      pitch: THREE.MathUtils.degToRad(34),
      yaw: THREE.MathUtils.degToRad(-100),
      roll: THREE.MathUtils.degToRad(22),
      scale: 1.00,
    },
    // 6. Rear-Right Canopy Filler Leaf
    {
      pos: [0.060, 0.01, -0.065],
      pitch: THREE.MathUtils.degToRad(42),
      yaw: THREE.MathUtils.degToRad(145),
      roll: THREE.MathUtils.degToRad(-18),
      scale: 0.94,
    },
    // 7. Rear-Left Canopy Filler Leaf
    {
      pos: [-0.060, 0.00, -0.070],
      pitch: THREE.MathUtils.degToRad(40),
      yaw: THREE.MathUtils.degToRad(-150),
      roll: THREE.MathUtils.degToRad(16),
      scale: 0.92,
    },
    // 8. Basal Underbelly Drop Leaf
    {
      pos: [0, -0.04, 0.060],
      pitch: THREE.MathUtils.degToRad(48),
      yaw: THREE.MathUtils.degToRad(180),
      roll: THREE.MathUtils.degToRad(6),
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

  // Merge geometries
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

    const phi = 2.399963229728653; // Golden angle

    for (let i = 0; i < clusterCount; i++) {
      const norm = i / clusterCount;
      let height, radius, startProg, tier, baseScale;

      if (norm < 0.15) {
        // Tier 1: Lower Scaffold Foliage Pads (y ~ 1.25m to 1.70m)
        const t = norm / 0.15;
        height = 1.25 + (t * 0.45);
        radius = 0.85 + (Math.sin(t * Math.PI) * 1.05) + ((i % 5) * 0.05);
        startProg = 0.44 + (t * 0.14) + (Math.sin(i * 3.1) * 0.02);
        tier = 1.0;
        baseScale = 0.98;
      } else if (norm < 0.50) {
        // Tier 2: Broad Mid-Canopy Spreading Mantle (y ~ 1.65m to 2.35m, radius up to 2.4m)
        const t = (norm - 0.15) / 0.35;
        height = 1.65 + (t * 0.70);
        radius = 1.05 + (Math.sin(t * Math.PI * 0.92) * 1.45) + ((i % 4) * 0.08);
        startProg = 0.50 + (t * 0.16) + (Math.sin(i * 2.7) * 0.02);
        tier = 2.0;
        baseScale = 1.10;
      } else if (norm < 0.82) {
        // Tier 3: Upper Canopy Dense Foliage Lobes (y ~ 2.20m to 2.85m, thick & dense)
        const t = (norm - 0.50) / 0.32;
        height = 2.20 + (t * 0.65);
        radius = 0.95 + (Math.sin(t * Math.PI * 0.88) * 1.25) + ((i % 3) * 0.09);
        startProg = 0.58 + (t * 0.16) + (Math.sin(i * 4.1) * 0.02);
        tier = 3.0;
        baseScale = 1.15;
      } else {
        // Tier 4: Broad Umbrella Crown Dome Crest (y ~ 2.70m to 3.35m, wide & full)
        const t = (norm - 0.82) / 0.18;
        height = 2.70 + (Math.pow(t, 0.72) * 0.65);
        radius = (1.0 - t * 0.32) * (1.35 + Math.sin(i * 3.1) * 0.35);
        startProg = 0.66 + (t * 0.15) + (Math.sin(i * 1.9) * 0.02);
        tier = 4.0;
        baseScale = 1.05;
      }

      const angle = (i * phi) + ((i % 7) * 0.14);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = height + (Math.sin(i * 3.7) * 0.15);

      aStartProgress[i] = Math.min(0.88, Math.max(0.44, startProg));
      aPhase[i] = (i * 1.25) + ((i % 5) * 0.8);
      aSizeScale[i] = baseScale * (0.85 + Math.sin(i * 4.3) * 0.22 + ((i % 4) * 0.08));
      aTier[i] = tier;
      aColorJitter[i] = (Math.sin(i * 7.1) + Math.cos(i * 3.3)) * 0.5;

      // Natural outward pitch and roll towards sunlight
      const outwardDir = new THREE.Vector2(x, z).normalize();
      const yawAngle = Math.atan2(outwardDir.x, outwardDir.y);
      const pitchAngle = THREE.MathUtils.degToRad(-15 + (tier * 8) + (Math.sin(i * 2.1) * 12));
      const rollAngle = THREE.MathUtils.degToRad((Math.sin(i * 5.4) * 18));

      aBaseRotation[i * 3 + 0] = pitchAngle;
      aBaseRotation[i * 3 + 1] = yawAngle;
      aBaseRotation[i * 3 + 2] = rollAngle;
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
        // Rich Earthy Botanical Palette
        uDeepShadowColor: { value: new THREE.Color('#061a0b') }, // Deep shaded interior
        uUnderstoryColor: { value: new THREE.Color('#0e3818') }, // Shaded foliage
        uMatureColor:     { value: new THREE.Color('#1b6e31') }, // Vibrant banyan body
        uOuterColor:      { value: new THREE.Color('#3ea552') }, // Sun-facing leaves
        uSunHighlight:    { value: new THREE.Color('#8ee22c') }, // Sunlit golden crest
      },
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    return { customGeo: geo, leafMaterial: mat };
  }, [clusterCount, clusterGeo]);

  // Set instance matrices at cluster node positions
  useMemo(() => {
    if (!customGeo) return;
    const dummy = new THREE.Object3D();
    const phi = 2.399963229728653;

    for (let i = 0; i < clusterCount; i++) {
      const norm = i / clusterCount;
      let height, radius;

      if (norm < 0.15) {
        const t = norm / 0.15;
        height = 1.25 + (t * 0.45);
        radius = 0.85 + (Math.sin(t * Math.PI) * 1.05) + ((i % 5) * 0.05);
      } else if (norm < 0.50) {
        const t = (norm - 0.15) / 0.35;
        height = 1.65 + (t * 0.70);
        radius = 1.05 + (Math.sin(t * Math.PI * 0.92) * 1.45) + ((i % 4) * 0.08);
      } else if (norm < 0.82) {
        const t = (norm - 0.50) / 0.32;
        height = 2.20 + (t * 0.65);
        radius = 0.95 + (Math.sin(t * Math.PI * 0.88) * 1.25) + ((i % 3) * 0.09);
      } else {
        const t = (norm - 0.82) / 0.18;
        height = 2.70 + (Math.pow(t, 0.72) * 0.65);
        radius = (1.0 - t * 0.32) * (1.35 + Math.sin(i * 3.1) * 0.35);
      }

      const angle = (i * phi) + ((i % 7) * 0.14);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = height + (Math.sin(i * 3.7) * 0.15);

      dummy.position.set(x, y, z);
      dummy.updateMatrix();
    }
  }, [clusterCount, customGeo]);

  useFrame((state) => {
    if (!instancedMeshRef.current || !leafMaterial) return;

    const p = progressRef.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;

    leafMaterial.uniforms.uScrollProgress.value = p;
    leafMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    leafMaterial.uniforms.uCursor.value.set(curX, curY);

    // Populate instance matrices on mount
    if (!instancedMeshRef.current.__initialized) {
      const dummy = new THREE.Object3D();
      const phi = 2.399963229728653;

      for (let i = 0; i < clusterCount; i++) {
        const norm = i / clusterCount;
        let height, radius;

        if (norm < 0.15) {
          const t = norm / 0.15;
          height = 1.25 + (t * 0.45);
          radius = 0.85 + (Math.sin(t * Math.PI) * 1.05) + ((i % 5) * 0.05);
        } else if (norm < 0.50) {
          const t = (norm - 0.15) / 0.35;
          height = 1.65 + (t * 0.70);
          radius = 1.05 + (Math.sin(t * Math.PI * 0.92) * 1.45) + ((i % 4) * 0.08);
        } else if (norm < 0.82) {
          const t = (norm - 0.50) / 0.32;
          height = 2.20 + (t * 0.65);
          radius = 0.95 + (Math.sin(t * Math.PI * 0.88) * 1.25) + ((i % 3) * 0.09);
        } else {
          const t = (norm - 0.82) / 0.18;
          height = 2.70 + (Math.pow(t, 0.72) * 0.65);
          radius = (1.0 - t * 0.32) * (1.35 + Math.sin(i * 3.1) * 0.35);
        }

        const angle = (i * phi) + ((i % 7) * 0.14);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = height + (Math.sin(i * 3.7) * 0.15);

        dummy.position.set(x, y, z);
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
