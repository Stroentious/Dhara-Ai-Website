import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Stem Component — Botanical Multi-Columnar Anastomosing Banyan Trunk (*Ficus benghalensis*)
 * 
 * Botanical & Visual Realism:
 * - Real Bark Characteristics: Multi-scale vertical furrowed fissures, convex bark plates,
 *   lenticels, longitudinal wood grain, and micro-flaking.
 * - Physically Grounded Material: Deep raw-umber sub-bark crevices, warm sienna midtones,
 *   weathered ash-tan ridges, and selective moist crevice moss.
 * - Non-Cylindrical Geometry: Fluted braided column clusters, buttressed base flares,
 *   and organic axial waviness.
 * - Lighting Response: Half-Lambert wrapped diffuse, cavity ambient occlusion,
 *   low-sheen dry bark specular highlights, and warm grazing rim light.
 * - 100% Reversible scroll-scrubbing timeline.
 */

const STEM_VERTEX_SHADER = /* glsl */`
  attribute float aHeightProg;  // 0.0 at ground base (y ~ -0.18), 1.0 at apex (y ~ 2.45)
  attribute float aBaseRadius;
  attribute float aColumnAngle;  // Angular position of this column around core
  attribute float aColumnTier;   // 0.0 = Central core, 1.0 = Primary fused column, 2.0 = Buttress flare
  
  uniform float uGrowth;        // 0.0 to 1.0 (Shoot height extrusion)
  uniform float uMaturity;      // 0.0 (tender green shoot) to 1.0 (mature banyan trunk)
  uniform float uTime;
  uniform vec2 uCursor;

  varying vec2 vUv;
  varying float vHeightProg;
  varying float vMaturity;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vColumnTier;

  void main() {
    vUv = uv;
    vHeightProg = aHeightProg;
    vMaturity = uMaturity;
    vColumnTier = aColumnTier;

    // Organic tip emergence with smooth extrusion curve
    float localGrowth = smoothstep(aHeightProg - 0.06, aHeightProg, uGrowth);

    // ── 1. BOTANICAL BANYAN TRUNK PROFILE ──
    // Flared massive buttressed base root spread near ground (y: -0.18 to 0.40)
    float baseGroundDist = max(0.0, 1.0 - aHeightProg * 2.8);
    float buttressFlare = baseGroundDist * baseGroundDist * (0.16 * uMaturity);
    
    // Taper from stout multi-pillar base to canopy junction
    float baseThick = mix(0.045, 0.22, uMaturity) + buttressFlare;
    float topThick = mix(0.018, 0.075, uMaturity);
    float radiusAtHeight = mix(baseThick, topThick, pow(aHeightProg, 0.85));

    // ── 2. LONGITUDINAL TRUNK FLUTING, ASYMMETRIC LOBES & BARK KNOBS ──
    if (uMaturity > 0.08) {
      float ribCount = mix(14.0, 26.0, aColumnTier * 0.5);
      float fluting = sin(vUv.x * ribCount + aColumnAngle) * 0.024 * uMaturity * (1.0 - aHeightProg * 0.42);
      
      // Asymmetric trunk lobe irregularity (breaks perfectly circular cross-sections)
      float lobeIrregularity = (sin(vUv.x * 3.0 + aColumnAngle * 1.5) * 0.022 
                              + cos(vUv.x * 7.0 - aHeightProg * 4.0) * 0.012 
                              + sin(vUv.x * 13.0 + aHeightProg * 8.0) * 0.006) * uMaturity;
      
      // Subtle organic branch collar knobbiness
      float knobbiness = sin(aHeightProg * 14.5) * exp(-abs(sin(aHeightProg * 7.25)) * 1.8) * 0.012 * uMaturity;
      
      radiusAtHeight += fluting + lobeIrregularity + knobbiness;
    }

    // ── 3. NATURAL WIND SWAY & ORGANIC ASYMMETRY ──
    float swayAmp = aHeightProg * aHeightProg * (0.040 + length(uCursor) * 0.025);
    float swayX = sin(uTime * 1.05 + aHeightProg * 2.4) * swayAmp + (uCursor.x * swayAmp * 0.85);
    float swayZ = cos(uTime * 0.92 + aHeightProg * 2.0) * swayAmp + (uCursor.y * swayAmp * 0.85);

    vec3 transformed = position;
    transformed.x += swayX * localGrowth;
    transformed.z += swayZ * localGrowth;

    // Organic elliptical trunk deformation
    float deform = sin(aHeightProg * 6.28 + aColumnAngle * 2.0) * 0.016 * uMaturity;
    transformed.x += normal.x * deform;
    transformed.z += normal.z * deform;

    // Expand vertex along normal according to growth thickness
    transformed += normal * (radiusAtHeight * localGrowth - aBaseRadius);

    vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const STEM_FRAGMENT_SHADER = /* glsl */`
  uniform float uGrowth;
  uniform float uMaturity;
  uniform float uTime;
  uniform vec3 uBarkDeep;
  uniform vec3 uBarkDark;
  uniform vec3 uBarkMid;
  uniform vec3 uBarkWarm;
  uniform vec3 uBarkGolden;
  uniform vec3 uBarkSunlit;

  varying vec2 vUv;
  varying float vHeightProg;
  varying float vMaturity;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vColumnTier;

  // ── PROCEDURAL BARK NOISE & VORONOI HELPERS ──
  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  vec2 hash22(vec2 p) {
    float n = sin(dot(p, vec2(41.0, 289.0)));
    return fract(vec2(262144.0, 32768.0) * n);
  }

  // Stretched cellular Voronoi for vertically elongated bark plates & fissures
  vec3 cellularBarkPlates(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float m = 8.0;
    float m2 = 8.0;
    vec2 mg = vec2(0.0);
    
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash22(n + g);
        o = 0.5 + 0.44 * sin(o * 6.2831853);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < m) {
          m2 = m;
          m = d;
          mg = g;
        } else if (d < m2) {
          m2 = d;
        }
      }
    }
    return vec3(sqrt(m), sqrt(m2), hash21(n + mg));
  }

  // Blinn-Mikkelsen bump mapping for physical surface normal perturbation
  vec3 computeBumpedNormal(vec3 surfNorm, vec3 surfPos, float height, float bumpScale) {
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
    if (vHeightProg > uGrowth + 0.025) {
      discard;
    }

    // ── 1. PROCEDURAL VERTICAL BARK FISSURES & IRREGULAR PLATES ──
    // Highly vertically elongated coordinates matching natural tree trunks (ratio ~ 4.2:1)
    vec2 barkCoord = vec2(vUv.x * 16.0, vUv.y * 3.8);
    
    // Multi-octave domain warping for organic, twisting fissures
    vec2 warp1 = vec2(
      sin(vUv.y * 18.0 + vUv.x * 4.0),
      cos(vUv.y * 14.0 - vUv.x * 5.5)
    ) * 0.38;
    
    vec2 warp2 = vec2(
      sin(vUv.y * 38.0 + warp1.x * 2.0),
      cos(vUv.x * 24.0 + warp1.y * 2.0)
    ) * 0.14;
    
    vec2 pCoord = barkCoord + warp1 + warp2;

    // Cellular Voronoi evaluation: vor.x = plate center distance, vor.y = neighbor
    vec3 vor = cellularBarkPlates(pCoord);
    float edgeDist = vor.y - vor.x; // 0 at deep fissure crack, high at plate crest

    // Deep vertical fissure grooves
    float fissureMask = smoothstep(0.02, 0.26, edgeDist);
    float creviceDeep = 1.0 - fissureMask;

    // Convex rounded pillowing across individual bark plates
    float plateCrest = sqrt(clamp(edgeDist / 0.54, 0.0, 1.0));

    // Longitudinal wood grain & fiber splits along plates
    float secGrain = sin(pCoord.x * 6.283185 * 2.2 + sin(pCoord.y * 8.0) * 1.5) * 0.5 + 0.5;
    secGrain = pow(secGrain, 2.2);

    // Transverse chapping / horizontal bark wrinkles & lenticels
    float transverseChaps = sin(vUv.y * 84.0 + sin(vUv.x * 28.0) * 2.4) * 0.5 + 0.5;
    float chappedCracks = smoothstep(0.68, 0.94, transverseChaps) * 0.18;

    // High-frequency surface stippling & bark flakes
    float microGrain = hash21(floor(vec2(vUv.x * 85.0, vUv.y * 160.0))) * 0.08;

    // ── 2. COMPOSITE 3D BARK RELIEF & SURFACE BUMP MAPPING ──
    float totalHeight = plateCrest * 0.72
                      - creviceDeep * 0.82
                      - secGrain * 0.22
                      - chappedCracks * 0.16
                      + microGrain;

    vec3 bumpedNormal = computeBumpedNormal(vWorldNormal, vWorldPos, totalHeight, 0.052);

    // ── 3. REALISTIC SCENE ILLUMINATION RESPONSE ──
    vec3 sunDir = normalize(vec3(0.55, 0.85, 0.40));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Physically-based diffuse with soft wrap-around for cylindrical bark depth
    float NdotL = dot(bumpedNormal, sunDir);
    float diffuse = clamp((NdotL + 0.38) / 1.38, 0.0, 1.0);

    // Ambient cavity occlusion inside deep cracks & fissures
    float cavityAO = clamp(fissureMask * 0.82 + 0.18, 0.0, 1.0);
    cavityAO *= clamp(bumpedNormal.y * 0.25 + 0.75, 0.0, 1.0);

    // Soil ground bounce light from below
    float groundBounce = max(0.0, -bumpedNormal.y) * 0.18;
    vec3 groundBounceColor = vec3(0.35, 0.22, 0.12) * groundBounce;

    // Sky cool fill from above
    float skyFill = max(0.0, bumpedNormal.y) * 0.14;
    vec3 skyFillColor = vec3(0.70, 0.82, 0.95) * skyFill;

    // ── 4. REALISTIC WARM EARTHY BARK PALETTE ──
    // Deep fissure shadow -> Sub-bark warm raw umber -> Rich earthy sienna -> Weathered ridge -> Sunlit dry cork crest
    vec3 deepShadow = uBarkDeep;
    vec3 subBark    = mix(uBarkDeep, uBarkDark, smoothstep(0.0, 0.28, edgeDist));
    vec3 plateBody  = mix(uBarkMid, uBarkWarm, smoothstep(0.16, 0.58, plateCrest));
    vec3 ridgeCrest = mix(uBarkGolden, uBarkSunlit, smoothstep(0.52, 0.94, plateCrest));

    vec3 barkColor = mix(subBark, plateBody, smoothstep(0.08, 0.45, edgeDist));
    barkColor = mix(barkColor, ridgeCrest, smoothstep(0.40, 0.90, plateCrest));
    barkColor = mix(deepShadow, barkColor, cavityAO);

    // Subtle plate-to-plate tonal variation (natural biological aging per plate)
    float plateId = vor.z;
    vec3 plateTonalShift = vec3(plateId * 0.06 - 0.03, plateId * 0.04 - 0.02, plateId * 0.02 - 0.01);
    barkColor += plateTonalShift * fissureMask;

    // Apply lighting
    vec3 litBark = barkColor * (diffuse * 0.74 + 0.22) * cavityAO + groundBounceColor + skyFillColor;
    // Sun-facing ridges receive warm grazing light
    litBark += uBarkSunlit * max(0.0, NdotL) * plateCrest * 0.22;

    // ── 5. DRY WEATHERED SPECULAR & GRAZING SHEEN ──
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(bumpedNormal, halfDir));
    // Soft, natural diffuse sheen on dry weathered plate ridges (roughness ~ 0.8)
    float specular = pow(NdotH, 18.0) * 0.09 * fissureMask;
    litBark += vec3(0.96, 0.92, 0.86) * specular;

    // Subtle rim lighting for depth separation
    float rim = pow(1.0 - max(0.0, dot(bumpedNormal, viewDir)), 3.5) * 0.10 * fissureMask;
    litBark += uBarkSunlit * rim;

    // ── 6. NATURAL BARK WOOD COMPOSITION (Realistic medium-to-dark brown throughout growth) ──
    vec3 finalCol = litBark;

    gl_FragColor = vec4(finalCol, 1.0);
  }
`;

export default function Stem({ progressRef, cursorRef, quality = 'high' }) {
  const groupRef = useRef();

  const { trunkGeometries, stemMaterial } = useMemo(() => {
    // 1. Central Core Trunk (organic natural lean characteristic of Ficus benghalensis)
    const corePoints = [
      new THREE.Vector3(0, -0.18, 0),
      new THREE.Vector3(0.015, 0.20, 0.010),
      new THREE.Vector3(-0.024, 0.70, -0.015),
      new THREE.Vector3(0.028, 1.25, 0.020),
      new THREE.Vector3(-0.018, 1.80, -0.014),
      new THREE.Vector3(0.008, 2.45, 0.006),
    ];
    const coreCurve = new THREE.CatmullRomCurve3(corePoints);

    // 2. Multi-columnar Anastomosing Pillar Columns (6-8 fluted columns braided around core)
    const columnCount = quality === 'low' ? 5 : quality === 'medium' ? 7 : 8;
    const allCurves = [{ curve: coreCurve, baseRadius: 0.115, tier: 0.0, angle: 0 }];
    const phi = 2.399963229728653; // Golden angle

    for (let c = 0; c < columnCount; c++) {
      const colAngle = c * phi;
      const colRadius = 0.075 + (Math.sin(c * 2.3) * 0.018);
      const points = [];

      for (let s = 0; s <= 5; s++) {
        const t = s / 5;
        const corePt = coreCurve.getPoint(t);
        const twistAngle = colAngle + (t * 2.8);
        const orbitRadius = colRadius * (1.0 - t * 0.48);
        
        const pt = new THREE.Vector3(
          corePt.x + Math.cos(twistAngle) * orbitRadius,
          corePt.y,
          corePt.z + Math.sin(twistAngle) * orbitRadius
        );
        points.push(pt);
      }

      allCurves.push({
        curve: new THREE.CatmullRomCurve3(points),
        baseRadius: 0.048 - (c * 0.002),
        tier: 1.0,
        angle: colAngle,
      });
    }

    // 3. Flared Ground Buttress Roots (Hug soil base y: -0.18 to 0.45)
    const buttressCount = quality === 'low' ? 3 : 5;
    for (let b = 0; b < buttressCount; b++) {
      const bAngle = (b * (Math.PI * 2 / buttressCount)) + 0.4;
      const bPoints = [
        new THREE.Vector3(Math.cos(bAngle) * 0.42, -0.18, Math.sin(bAngle) * 0.42),
        new THREE.Vector3(Math.cos(bAngle) * 0.26, 0.08, Math.sin(bAngle) * 0.26),
        new THREE.Vector3(Math.cos(bAngle) * 0.12, 0.28, Math.sin(bAngle) * 0.12),
        coreCurve.getPoint(0.28),
      ];
      allCurves.push({
        curve: new THREE.CatmullRomCurve3(bPoints),
        baseRadius: 0.055,
        tier: 2.0,
        angle: bAngle,
      });
    }

    // Build Tube Geometries with custom attributes
    const tubularSegments = quality === 'low' ? 32 : 48;
    const radialSegments = quality === 'low' ? 8 : 12;

    const geometries = allCurves.map(({ curve, baseRadius, tier, angle }) => {
      const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, baseRadius, radialSegments, false);
      const pos = tubeGeo.attributes.position;
      const count = pos.count;

      const aHeightProg = new Float32Array(count);
      const aBaseRadius = new Float32Array(count);
      const aColumnAngle = new Float32Array(count);
      const aColumnTier = new Float32Array(count);

      for (let i = 0; i <= tubularSegments; i++) {
        const heightRatio = i / tubularSegments;
        for (let j = 0; j <= radialSegments; j++) {
          const idx = i * (radialSegments + 1) + j;
          if (idx < count) {
            aHeightProg[idx] = heightRatio;
            aBaseRadius[idx] = baseRadius;
            aColumnAngle[idx] = angle;
            aColumnTier[idx] = tier;
          }
        }
      }

      tubeGeo.setAttribute('aHeightProg', new THREE.BufferAttribute(aHeightProg, 1));
      tubeGeo.setAttribute('aBaseRadius', new THREE.BufferAttribute(aBaseRadius, 1));
      tubeGeo.setAttribute('aColumnAngle', new THREE.BufferAttribute(aColumnAngle, 1));
      tubeGeo.setAttribute('aColumnTier', new THREE.BufferAttribute(aColumnTier, 1));
      return tubeGeo;
    });

    const mat = new THREE.ShaderMaterial({
      vertexShader: STEM_VERTEX_SHADER,
      fragmentShader: STEM_FRAGMENT_SHADER,
      uniforms: {
        uGrowth: { value: 0 },
        uMaturity: { value: 0 },
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uBarkDeep: { value: new THREE.Color('#160d08') },     // Deep fissure shadow
        uBarkDark: { value: new THREE.Color('#2c1b12') },     // Sub-bark raw umber
        uBarkMid: { value: new THREE.Color('#4e3524') },      // Rich warm walnut bark
        uBarkWarm: { value: new THREE.Color('#6d4a32') },     // Earthy sienna plate body
        uBarkGolden: { value: new THREE.Color('#8c6343') },   // Weathered tan-cork ridge
        uBarkSunlit: { value: new THREE.Color('#b58c67') },   // Sunlit dry cork crest
      },
      side: THREE.DoubleSide,
    });

    return { trunkGeometries: geometries, stemMaterial: mat };
  }, [quality]);

  useFrame((state) => {
    if (!stemMaterial) return;

    const p = progressRef.current || 0;
    // Green shoot begins emerging at 24% and reaches full trunk height by 62%
    const growth = THREE.MathUtils.smoothstep(p, 0.24, 0.62);
    // Maturity transitions from young tender shoot to sturdy wooden Banyan trunk
    const maturity = THREE.MathUtils.smoothstep(p, 0.38, 0.82);

    stemMaterial.uniforms.uGrowth.value = growth;
    stemMaterial.uniforms.uMaturity.value = maturity;
    stemMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;
    stemMaterial.uniforms.uCursor.value.set(curX, curY);

    if (groupRef.current) {
      groupRef.current.visible = p >= 0.23;
    }
  });

  return (
    <group ref={groupRef}>
      {trunkGeometries.map((geo, idx) => (
        <mesh
          key={idx}
          geometry={geo}
          material={stemMaterial}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
