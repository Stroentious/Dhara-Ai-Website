import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Farmer Component — Photorealistic Agricultural Caretaker of the DHARA AI Tree
 *
 * Precision Watering Alignment Architecture:
 * 1. World-Space Water Trajectory (Zero-Gap Attachment):
 *    - `spoutTipRef` is an exact transform anchor attached to the watering can's rose nozzle.
 *    - In `useFrame`, `spoutTipRef.getWorldPosition(_spoutWorldPos)` dynamically captures the exact 3D nozzle opening.
 *    - The water vertex shader operates directly in World Space via `viewMatrix * vec4(p, 1.0)`, ensuring zero double-transform offsets.
 *    - Droplets have full opacity starting at flowT = 0.0, ensuring zero gap between the physical nozzle and the water stream.
 * 2. Physically Aligned Spray Direction:
 *    - Can spout extends along +Z in `canGroup`.
 *    - `canGroup.lookAt(seedWorld)` aims the spout directly at the seed target.
 *    - Parabolic gravity trajectory connects the nozzle tip smoothly to the seed topsoil.
 * 3. 100% Scroll-Controlled & Smoothly Reversible.
 */

// Helper to create an organic contoured lathe geometry
function createContouredLathe(pointsArray, segments = 22) {
  const pts = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
  return new THREE.LatheGeometry(pts, segments);
}

// ── 1. ZERO-GAP WORLD-SPACE WATER STREAM SHADER ──
const WATER_VERT = /* glsl */`
  attribute float aProgress; // 0.0 at nozzle opening, 1.0 at soil target
  attribute float aSpread;   // Conical spray angle
  attribute float aPhase;    // Random phase offset
  attribute float aSize;

  uniform float uWatering;   // 0.0 = inactive, 1.0 = full flow
  uniform float uTime;
  uniform vec3  uSpoutPos;   // Exact 3D world position of physical nozzle opening
  uniform vec3  uTargetPos;  // Exact 3D world position of seed/soil

  varying float vAlpha;

  void main() {
    // Continuous flow along stream from 0.0 (nozzle) to 1.0 (soil)
    float flowT = fract(aProgress - uTime * 2.0 + aPhase * 0.12);

    // Linear baseline interpolation in World Space
    vec3 p = mix(uSpoutPos, uTargetPos, flowT);

    // Natural downward gravity parabola (0 at nozzle, 0 at target)
    float gravityArc = -sin(flowT * 3.14159265) * 0.048;
    p.y += gravityArc;

    // Subtle conical dispersion that gently widens toward the soil
    float spread = flowT * 0.020;
    p.x += cos(aSpread + aPhase) * spread;
    p.z += sin(aSpread + aPhase) * spread;

    // ZERO GAP: Full visibility starting directly at flowT = 0.0 (nozzle rim)
    // Fades out softly only upon entering the soil (flowT > 0.88)
    vAlpha = (1.0 - smoothstep(0.88, 1.0, flowT)) * uWatering;

    // Transform directly from World Space to View Space to Clip Space
    // (Bypasses any parent group offsets so uSpoutPos matches physical nozzle with 0 offset)
    vec4 viewPos = viewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.0 - flowT * 0.20) * aSize * (105.0 / -viewPos.z);
    gl_Position  = projectionMatrix * viewPos;
  }
`;

const WATER_FRAG = /* glsl */`
  uniform vec3  uWaterColor;
  uniform float uWatering;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    float glow = smoothstep(0.5, 0.03, d);
    float spec = pow(1.0 - d * 2.0, 3.5);
    vec3 col = mix(uWaterColor, vec3(1.0, 1.0, 1.0), spec * 0.92);
    gl_FragColor = vec4(col, glow * vAlpha * 0.92);
  }
`;

// Scratch objects for zero-GC per-frame vector math
const _Y_AXIS = new THREE.Vector3(0, 1, 0);
const _tmpA = new THREE.Vector3();
const _tmpB = new THREE.Vector3();
const _tmpC = new THREE.Vector3();
const _tmpQ = new THREE.Quaternion();
const _spoutWorldPos = new THREE.Vector3();
const _seedWorldPos = new THREE.Vector3();

// Standard height for unit cylinder geometries (scaled per frame)
const UNIT_CYL_H = 1.0;

function orientSegment(mesh, fromWorld, toWorld, rootPos) {
  _tmpA.subVectors(toWorld, fromWorld);
  const len = _tmpA.length();
  if (len < 1e-4) return;
  _tmpA.divideScalar(len);
  _tmpQ.setFromUnitVectors(_Y_AXIS, _tmpA);

  mesh.quaternion.copy(_tmpQ);
  mesh.scale.set(1, len / UNIT_CYL_H, 1);
  mesh.position.set(
    (fromWorld.x + toWorld.x) * 0.5 - rootPos.x,
    (fromWorld.y + toWorld.y) * 0.5 - rootPos.y,
    (fromWorld.z + toWorld.z) * 0.5 - rootPos.z
  );
}

export default function Farmer({ progressRef, cursorRef, quality = 'high', isBW = false }) {
  const rootGroupRef    = useRef();
  const farmerBodyRef   = useRef();
  const headGroupRef    = useRef();
  const torsoRef        = useRef();
  const mouthRef        = useRef();

  // Right arm hierarchy and can
  const upperArmMeshRef = useRef();
  const forearmMeshRef  = useRef();
  const handMeshRef     = useRef();
  const canGroupRef     = useRef();
  const spoutTipRef     = useRef();
  const waterPointsRef  = useRef();

  // ── 1. PROCEDURAL ANATOMICAL GEOMETRIES ──
  const geo = useMemo(() => {
    // 1. Contoured Head
    const headPts = [
      [0.001, -0.092],
      [0.038, -0.082], // Chin
      [0.060, -0.048], // Jawline
      [0.074,  0.000], // Cheeks
      [0.076,  0.046], // Brow
      [0.066,  0.088], // Forehead
      [0.040,  0.114], // Crown top
      [0.001,  0.118],
    ];
    const headGeo = createContouredLathe(headPts, 22);

    const noseGeo = new THREE.ConeGeometry(0.013, 0.036, 8);
    noseGeo.rotateX(Math.PI * 0.45);

    const mustacheGeo = new THREE.TorusGeometry(0.022, 0.006, 8, 14, Math.PI);
    mustacheGeo.rotateZ(Math.PI);
    mustacheGeo.scale(1.2, 0.7, 1.0);

    const mouthGeo = new THREE.TorusGeometry(0.019, 0.004, 8, 12, Math.PI);
    mouthGeo.rotateZ(Math.PI);

    const eyeGeo  = new THREE.SphereGeometry(0.007, 8, 8);
    const neckGeo = new THREE.CylinderGeometry(0.034, 0.042, 0.062, 14);

    // 2. Traditional Pagri (Turban)
    const pagriRoll1 = new THREE.TorusGeometry(0.082, 0.031, 12, 24);
    pagriRoll1.rotateX(Math.PI * 0.48);
    pagriRoll1.scale(1.02, 0.88, 1.12);

    const pagriRoll2 = new THREE.TorusGeometry(0.074, 0.027, 10, 20);
    pagriRoll2.rotateX(Math.PI * 0.44);
    pagriRoll2.rotateZ(Math.PI * 0.12);
    pagriRoll2.scale(0.98, 0.82, 1.08);

    const pagriCrown = new THREE.SphereGeometry(0.073, 16, 16);
    pagriCrown.scale(1.08, 0.65, 1.18);

    // 3. Contoured Kurta Torso
    const torsoPts = [
      [0.065, -0.22], // Lower hem
      [0.145, -0.18], // Hip flare
      [0.138, -0.06], // Waist
      [0.155,  0.10], // Chest
      [0.142,  0.18], // Shoulders / Collar
      [0.055,  0.20], // Neckline
    ];
    const torsoGeo = createContouredLathe(torsoPts, 22);
    torsoGeo.scale(1.18, 1.0, 0.88);

    const shoulderCapGeo = new THREE.SphereGeometry(0.048, 12, 12);
    shoulderCapGeo.scale(1.1, 0.9, 1.0);

    // 4. Legs & Dhoti
    const thighPts = [
      [0.066,  0.00],
      [0.072, -0.10],
      [0.056, -0.22],
    ];
    const thighGeo = createContouredLathe(thighPts, 16);

    const calfPts = [
      [0.054,  0.00],
      [0.060, -0.09],
      [0.038, -0.21],
    ];
    const calfGeo = createContouredLathe(calfPts, 16);

    const footGeo = new THREE.BoxGeometry(0.065, 0.040, 0.13);
    footGeo.translate(0, -0.020, 0.030);

    // 5. Left Arm (Natural resting pose)
    const lUArmPts = [[0.036,0],[0.042,-0.08],[0.032,-0.18],[0.029,-0.20]];
    const lUArmGeo = createContouredLathe(lUArmPts, 14);

    const lFArmPts = [[0.030,0],[0.036,-0.06],[0.024,-0.16],[0.021,-0.18]];
    const lFArmGeo = createContouredLathe(lFArmPts, 14);

    const handGeo  = new THREE.SphereGeometry(0.027, 10, 10);
    handGeo.scale(0.85, 1.25, 0.75);

    // 6. Right Arm Dynamic Segments
    const rUArmCyl = new THREE.CylinderGeometry(0.036, 0.042, UNIT_CYL_H, 14);
    const rFArmCyl = new THREE.CylinderGeometry(0.026, 0.034, UNIT_CYL_H, 14);
    const rHandGeo = new THREE.SphereGeometry(0.029, 12, 12);
    rHandGeo.scale(0.9, 1.2, 0.8);

    // 7. REALISTIC WEATHERED WATERING CAN
    // Hand grip point is at (0, 0, 0) of the can group.
    // Can body sits at y = -0.10.
    // Spout centerline is at y = -0.06, extending along +Z to rose nozzle face at z = 0.28.
    const canBodyPts = [
      [0.066, -0.085],
      [0.076, -0.055],
      [0.080,  0.000],
      [0.072,  0.065],
      [0.074,  0.080],
    ];
    const canBodyGeo = createContouredLathe(canBodyPts, 22);

    // Top Handle: arches over the can; farmer grips apex at (0, 0, 0)
    const canHandleGeo = new THREE.TorusGeometry(0.078, 0.009, 8, 20, Math.PI);
    canHandleGeo.translate(0, -0.078, 0);

    // Spout: cylinder along +Z axis from z = 0.0 to 0.26
    const canSpoutGeo  = new THREE.CylinderGeometry(0.012, 0.022, 0.26, 14);
    canSpoutGeo.rotateX(Math.PI * 0.5);

    // Rose sprinkler head at z = 0.26
    const roseGeo = new THREE.CylinderGeometry(0.034, 0.014, 0.038, 14);
    roseGeo.rotateX(Math.PI * 0.5);

    return {
      headGeo, noseGeo, mustacheGeo, mouthGeo, eyeGeo, neckGeo,
      pagriRoll1, pagriRoll2, pagriCrown,
      torsoGeo, shoulderCapGeo,
      thighGeo, calfGeo, footGeo,
      lUArmGeo, lFArmGeo, handGeo,
      rUArmCyl, rFArmCyl, rHandGeo,
      canBodyGeo, canHandleGeo, canSpoutGeo, roseGeo,
    };
  }, []);

  // ── 2. AUTHENTIC AGRICULTURAL PBR MATERIALS ──
  const mat = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({
      color: isBW ? new THREE.Color('#9e6340') : new THREE.Color('#8d5431'),
      roughness: 0.72,
      metalness: 0.04,
      depthWrite: true,
      depthTest: true,
    }),
    pagri: new THREE.MeshStandardMaterial({
      color: isBW ? new THREE.Color('#d4a373') : new THREE.Color('#c78a4c'),
      roughness: 0.88,
      metalness: 0.0,
      depthWrite: true,
      depthTest: true,
    }),
    kurta: new THREE.MeshStandardMaterial({
      color: isBW ? new THREE.Color('#f0ece1') : new THREE.Color('#e8dfd1'),
      roughness: 0.86,
      metalness: 0.0,
      depthWrite: true,
      depthTest: true,
    }),
    dhoti: new THREE.MeshStandardMaterial({
      color: isBW ? new THREE.Color('#d9d2c5') : new THREE.Color('#b8ab96'),
      roughness: 0.88,
      metalness: 0.0,
      depthWrite: true,
      depthTest: true,
    }),
    shoe: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#322217'),
      roughness: 0.65,
      metalness: 0.08,
      depthWrite: true,
      depthTest: true,
    }),
    can: new THREE.MeshStandardMaterial({
      color: isBW ? new THREE.Color('#9ca3af') : new THREE.Color('#6b7280'),
      roughness: 0.44,
      metalness: 0.65,
      depthWrite: true,
      depthTest: true,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b45309'),
      roughness: 0.35,
      metalness: 0.75,
      depthWrite: true,
      depthTest: true,
    }),
    face: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c1917'),
      roughness: 0.4,
      depthWrite: true,
      depthTest: true,
    }),
  }), [isBW]);

  // ── 3. WATER STREAM BUFFER & MATERIAL ──
  // Dense particle distribution (160 droplets) ensures unbroken liquid stream
  const droplets = quality === 'low' ? 70 : quality === 'medium' ? 120 : 160;
  const { waterGeo, waterMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos  = new Float32Array(droplets * 3);
    const prog = new Float32Array(droplets);
    const spr  = new Float32Array(droplets);
    const ph   = new Float32Array(droplets);
    const sz   = new Float32Array(droplets);

    for (let i = 0; i < droplets; i++) {
      prog[i] = i / droplets;
      spr[i]  = (i * 2.39996) % (Math.PI * 2);
      ph[i]   = Math.random() * Math.PI * 2;
      sz[i]   = 0.75 + Math.random() * 0.55;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos,  3));
    geo.setAttribute('aProgress',new THREE.BufferAttribute(prog, 1));
    geo.setAttribute('aSpread',  new THREE.BufferAttribute(spr,  1));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(ph,   1));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sz,   1));

    const mat = new THREE.ShaderMaterial({
      vertexShader:   WATER_VERT,
      fragmentShader: WATER_FRAG,
      uniforms: {
        uWatering:  { value: 0 },
        uTime:      { value: 0 },
        uSpoutPos:  { value: new THREE.Vector3() },
        uTargetPos: { value: new THREE.Vector3(0, -0.10, 0) },
        uWaterColor:{ value: isBW ? new THREE.Color('#93c5fd') : new THREE.Color('#67e8f9') },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
    return { waterGeo: geo, waterMat: mat };
  }, [droplets, isBW]);

  // ── 4. SCROLL TIMELINE & PRECISION ATTACHMENT ──
  useFrame((state) => {
    if (!rootGroupRef.current) return;

    const p   = progressRef.current || 0;
    const t   = state.clock.elapsedTime;
    const curX = cursorRef?.current?.x || 0;

    const sm = THREE.MathUtils.smoothstep;
    const lp = THREE.MathUtils.lerp;
    const deg = THREE.MathUtils.degToRad;

    // Watering weight: active during seed watering phase (p: 0.005 -> 0.22)
    const ww = sm(p, 0.005, 0.08) * (1.0 - sm(p, 0.16, 0.22));

    // Dynamic vertical position of the seed settling in the soil
    const seedSettle = sm(p, 0.01, 0.18);
    const currentSeedY = -0.10 - seedSettle * 0.11;
    _seedWorldPos.set(0.0, currentSeedY, 0.0);

    // ── 1. FARMER PLACEMENT ON SOIL BED ──
    const fpX = lp(-0.62, -0.82, sm(p, 0.20, 0.55));
    const fpY = -0.155; // Exact topsoil mound height
    const fpZ = lp( 0.14,  0.22, sm(p, 0.20, 0.55));
    rootGroupRef.current.position.set(fpX, fpY, fpZ);

    // ── 2. BODY YAW & DIRECTION ──
    const angleToSeed = Math.atan2(-fpX, -fpZ); // ~102.7° facing seed
    const turnToViewer = sm(p, 0.84, 0.96);
    const bodyYaw = lp(angleToSeed, 0.08, turnToViewer) + curX * 0.03;
    if (farmerBodyRef.current) farmerBodyRef.current.rotation.y = bodyYaw;

    // ── 3. TORSO BREATHING & LEAN ──
    const breath = Math.sin(t * 1.35) * 0.006;
    if (torsoRef.current) {
      torsoRef.current.scale.set(1 + breath * 0.4, 1 + breath, 1 + breath * 0.4);
      torsoRef.current.rotation.x = lp(0, deg(8), ww);
    }

    // ── 4. HEAD GAZE ──
    if (headGroupRef.current) {
      let hPitch = 0, hYaw = 0;
      if (p < 0.22) {
        // Look directly at the seed in the soil while watering
        hPitch = deg(50);
        hYaw   = deg(0);
      } else if (p < 0.84) {
        // Look up into the ascending canopy
        const lu = sm(p, 0.24, 0.76);
        hPitch = lp(deg(6), deg(-32), lu);
        hYaw   = lp(deg(0), deg( 8), lu);
      } else {
        // Turn to look warmly at the user
        const lu2 = sm(p, 0.84, 0.95);
        hPitch = lp(deg(-16), deg(-2), lu2);
        hYaw   = lp(deg(8),  deg(-14), lu2);
      }
      headGroupRef.current.rotation.x = hPitch;
      headGroupRef.current.rotation.y = hYaw;
    }

    // ── 5. WARM SMILE ──
    const smileAmt = sm(p, 0.88, 0.98);
    if (mouthRef.current) {
      mouthRef.current.scale.set(1 + smileAmt * 0.45, 1 + smileAmt * 0.70, 1);
      mouthRef.current.position.y = -0.042 + smileAmt * 0.006;
    }

    // ── 6. RIGHT ARM KINEMATICS & HAND-TO-HANDLE GRIP ──
    const cosY = Math.cos(bodyYaw), sinY = Math.sin(bodyYaw);
    const shoulderWorld = _tmpB.set(
      fpX + cosY * 0.16,
      fpY + 0.80,
      fpZ - sinY * 0.16
    );

    const dirToSeed = _tmpC.subVectors(_seedWorldPos, shoulderWorld).normalize();

    // Hand position when watering vs rest
    const handPoseWater = new THREE.Vector3(
      shoulderWorld.x + dirToSeed.x * 0.34,
      fpY + 0.38,
      shoulderWorld.z + dirToSeed.z * 0.34
    );

    const handPoseRest = new THREE.Vector3(
      shoulderWorld.x,
      fpY + 0.32,
      shoulderWorld.z
    );

    const handWorld = new THREE.Vector3().lerpVectors(handPoseRest, handPoseWater, ww);

    const elbowWorld = new THREE.Vector3().lerpVectors(shoulderWorld, handWorld, 0.50);
    elbowWorld.y -= 0.045 * (1.0 - ww * 0.4);

    if (upperArmMeshRef.current) {
      orientSegment(upperArmMeshRef.current, shoulderWorld, elbowWorld, { x: fpX, y: fpY, z: fpZ });
    }

    if (forearmMeshRef.current) {
      orientSegment(forearmMeshRef.current, elbowWorld, handWorld, { x: fpX, y: fpY, z: fpZ });
    }

    if (handMeshRef.current) {
      handMeshRef.current.position.set(
        handWorld.x - fpX,
        handWorld.y - fpY,
        handWorld.z - fpZ
      );
    }

    // ── 7. WATERING CAN POSITION & SPOUT ALIGNMENT ──
    if (canGroupRef.current) {
      canGroupRef.current.position.set(
        handWorld.x - fpX,
        handWorld.y - fpY,
        handWorld.z - fpZ
      );

      if (ww > 0.01) {
        // Point spout directly at the seed target
        canGroupRef.current.lookAt(_seedWorldPos.x, _seedWorldPos.y, _seedWorldPos.z);
      } else {
        // Hang vertically by side when not watering
        canGroupRef.current.rotation.set(deg(12), bodyYaw - Math.PI * 0.5, 0);
      }

      // Update can matrix immediately so spoutTip world position is fresh
      canGroupRef.current.updateMatrixWorld(true);
    }

    // ── 8. WATER STREAM EMITTER & TARGET (100% Attached to Physical Nozzle Tip) ──
    if (waterMat) {
      waterMat.uniforms.uWatering.value = ww;
      waterMat.uniforms.uTime.value     = t;

      if (spoutTipRef.current && ww > 0.005) {
        // Read exact 3D world coordinate of the physical rose nozzle opening
        spoutTipRef.current.getWorldPosition(_spoutWorldPos);
        waterMat.uniforms.uSpoutPos.value.copy(_spoutWorldPos);
        waterMat.uniforms.uTargetPos.value.copy(_seedWorldPos);
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* ── 1. BODY GRAPH (Rotates with bodyYaw to face seed) ── */}
      <group ref={farmerBodyRef}>
        {/* Left Leg */}
        <group position={[-0.075, 0.44, 0.0]}>
          <mesh geometry={geo.thighGeo} material={mat.dhoti} castShadow frustumCulled={false} />
          <mesh position={[0, -0.22, 0]} geometry={geo.calfGeo} material={mat.dhoti} castShadow frustumCulled={false} />
          <mesh position={[0, -0.40, 0]} geometry={geo.footGeo} material={mat.shoe}  castShadow frustumCulled={false} />
        </group>

        {/* Right Leg */}
        <group position={[0.075, 0.44, 0.02]}>
          <mesh geometry={geo.thighGeo} material={mat.dhoti} castShadow frustumCulled={false} />
          <mesh position={[0, -0.22, 0]} geometry={geo.calfGeo} material={mat.dhoti} castShadow frustumCulled={false} />
          <mesh position={[0, -0.40, 0]} geometry={geo.footGeo} material={mat.shoe}  castShadow frustumCulled={false} />
        </group>

        {/* Torso */}
        <group ref={torsoRef} position={[0, 0.64, 0]}>
          <mesh geometry={geo.torsoGeo} material={mat.kurta} castShadow frustumCulled={false} />
          <mesh position={[-0.175, 0.16, 0]} geometry={geo.shoulderCapGeo} material={mat.kurta} frustumCulled={false} />
          <mesh position={[ 0.175, 0.16, 0]} geometry={geo.shoulderCapGeo} material={mat.kurta} frustumCulled={false} />

          {/* Left Arm (Resting naturally) */}
          <group position={[-0.175, 0.16, 0]}>
            <mesh geometry={geo.lUArmGeo} material={mat.kurta} frustumCulled={false} />
            <group position={[0, -0.20, 0.02]}>
              <mesh geometry={geo.lFArmGeo} material={mat.skin} frustumCulled={false} />
              <mesh position={[0, -0.19, 0.01]} geometry={geo.handGeo} material={mat.skin} frustumCulled={false} />
            </group>
          </group>
        </group>

        {/* Head, Pagri & Face */}
        <group ref={headGroupRef} position={[0, 0.87, 0.015]}>
          <mesh position={[0, -0.032, 0]} geometry={geo.neckGeo} material={mat.skin} frustumCulled={false} />
          <mesh geometry={geo.headGeo} material={mat.skin} castShadow frustumCulled={false} />
          <mesh position={[0, 0.0, 0.077]} geometry={geo.noseGeo} material={mat.skin} frustumCulled={false} />
          <mesh position={[0, -0.022, 0.071]} geometry={geo.mustacheGeo} material={mat.face} frustumCulled={false} />
          <mesh position={[-0.025, 0.021, 0.067]} geometry={geo.eyeGeo} material={mat.face} frustumCulled={false} />
          <mesh position={[ 0.025, 0.021, 0.067]} geometry={geo.eyeGeo} material={mat.face} frustumCulled={false} />
          <mesh ref={mouthRef} position={[0, -0.042, 0.065]} geometry={geo.mouthGeo} material={mat.face} frustumCulled={false} />

          {/* Pagri (Turban) */}
          <mesh position={[0, 0.053, 0   ]} geometry={geo.pagriRoll1} material={mat.pagri} castShadow frustumCulled={false} />
          <mesh position={[0, 0.066,-0.01]} geometry={geo.pagriRoll2} material={mat.pagri} castShadow frustumCulled={false} />
          <mesh position={[0, 0.062, 0   ]} geometry={geo.pagriCrown} material={mat.pagri} castShadow frustumCulled={false} />
        </group>
      </group>

      {/* ── 2. RIGHT ARM CHAIN (Dynamically oriented to grip handle) ── */}
      <mesh ref={upperArmMeshRef} geometry={geo.rUArmCyl} material={mat.kurta} frustumCulled={false} />
      <mesh ref={forearmMeshRef}  geometry={geo.rFArmCyl} material={mat.skin} frustumCulled={false} />
      <mesh ref={handMeshRef}     geometry={geo.rHandGeo} material={mat.skin} frustumCulled={false} />

      {/* ── 3. WATERING CAN (Handle centered at (0,0,0) in hand) ── */}
      <group ref={canGroupRef}>
        {/* Top Handle: hand wraps around this apex */}
        <mesh position={[0, 0, 0]} geometry={geo.canHandleGeo} material={mat.can} frustumCulled={false} />

        {/* Can Body (Hangs naturally below the handle) */}
        <mesh position={[0, -0.10, 0]} geometry={geo.canBodyGeo} material={mat.can} castShadow frustumCulled={false} />

        {/* Spout: Extends forward along +Z from y = -0.06 */}
        <mesh
          position={[0, -0.06, 0.13]}
          geometry={geo.canSpoutGeo}
          material={mat.can}
          frustumCulled={false}
        />

        {/* Rose Sprinkler Head at z = 0.26 */}
        <mesh
          position={[0, -0.06, 0.26]}
          geometry={geo.roseGeo}
          material={mat.brass}
          frustumCulled={false}
        />

        {/* Physical Nozzle Tip Marker (Exact world origin for water stream at z = 0.28) */}
        <group ref={spoutTipRef} position={[0, -0.06, 0.28]} />
      </group>

      {/* ── 4. WATER DROPLET PARTICLES (Direct World-Space Render) ── */}
      <points ref={waterPointsRef} geometry={waterGeo} material={waterMat} frustumCulled={false} />
    </group>
  );
}
