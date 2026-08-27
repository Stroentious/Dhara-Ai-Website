import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Seed Component — Botanically Authentic Agricultural Seed
 * Timeline:
 * - 0%  to 18%: Whole organic seed resting on soil surface, then settling into humus (y = -0.10 -> -0.20)
 * - 18% to 34%: Suture line opens/cracks, releasing the embryonic radicle downward and plumule upward
 * - 34% to 55%: Energy transfers into underground roots and emerging green shoot
 * - 55% to 75%: Seed husk naturally integrates into soil collar as stem thickens into trunk
 * - 100% Reversible video-scrubbing behavior
 */

export default function Seed({ progressRef, cursorRef, quality = 'high' }) {
  const groupRef = useRef();
  const leftCotyledonRef = useRef();
  const rightCotyledonRef = useRef();
  const radicleRef = useRef();
  const glowCoreRef = useRef();

  // Procedural botanical seed shell half (ovate teardrop with natural dorsal ridge and micropyle taper)
  const shellGeo = useMemo(() => {
    const segmentsW = quality === 'low' ? 20 : quality === 'medium' ? 28 : 36;
    const segmentsH = quality === 'low' ? 16 : quality === 'medium' ? 24 : 30;
    const geom = new THREE.SphereGeometry(0.32, segmentsW, segmentsH, 0, Math.PI);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      
      // Teardrop taper: slender at apex (micropyle), plump rounded base (chalaza)
      const normY = v.y / 0.32; // -1.0 to 1.0
      const taper = 1.0 - normY * 0.42 + Math.pow(Math.max(0, normY), 2.2) * 0.15;
      
      v.x *= taper * 0.78;
      v.z *= taper * 0.88;
      v.y *= 1.28; // Elongated seed body

      // Longitudinal botanical seam ridge
      if (v.z > 0) {
        const ridgeProfile = Math.sin(Math.PI * (normY * 0.5 + 0.5));
        v.z += ridgeProfile * 0.038;
      }

      // Micro surface texture / organic asymmetry
      v.x += Math.sin(v.y * 12.0) * 0.008;
      v.z += Math.cos(v.x * 14.0) * 0.008;

      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }, [quality]);

  // Embryo / Radicle & Plumule tip geometry
  const radicleGeo = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.12, 0.45, 18);
    geom.rotateX(Math.PI);
    geom.translate(0, -0.16, 0);
    return geom;
  }, []);

  // Earthy Seed Husk Material (PBR with organic roughness and subtle bump)
  const huskMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4d2d18'),
      roughness: 0.78,
      metalness: 0.06,
      bumpScale: 0.06,
      side: THREE.DoubleSide,
    });
  }, []);

  // Inner Germinating Embryo Material (Fresh, vital sapling green)
  const embryoMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4ade80'),
      emissive: new THREE.Color('#15803d'),
      emissiveIntensity: 0.5,
      roughness: 0.30,
      metalness: 0.08,
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = progressRef.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;

    // Timeline 0% to 18%: Seed rests at y = -0.10, then organically settles into soil (y = -0.21)
    const settle = THREE.MathUtils.smoothstep(p, 0.01, 0.18);
    const seedY = -0.10 - settle * 0.11;

    // Organic micro-breathing & gentle cursor response
    const swayX = Math.sin(state.clock.elapsedTime * 0.75) * 0.018 + curX * 0.025;
    const swayZ = Math.cos(state.clock.elapsedTime * 0.60) * 0.018 + curY * 0.025;

    groupRef.current.position.set(0, seedY, 0);
    groupRef.current.rotation.set(0.16 + swayZ, swayX, 0.08);

    // Timeline 18% to 34%: Suture opens/cracks as germination activates
    const splitProgress = THREE.MathUtils.smoothstep(p, 0.18, 0.34);
    const splitDist = splitProgress * 0.22;
    const splitAngle = splitProgress * 0.48;

    if (leftCotyledonRef.current) {
      leftCotyledonRef.current.position.set(-splitDist, 0, 0);
      leftCotyledonRef.current.rotation.set(0, 0, splitAngle);
    }

    if (rightCotyledonRef.current) {
      rightCotyledonRef.current.position.set(splitDist, 0, 0);
      rightCotyledonRef.current.rotation.set(0, Math.PI, -splitAngle);
    }

    // Timeline 20% to 45%: Embryo emerges, establishing root/shoot vitality
    const embryoGrowth = THREE.MathUtils.smoothstep(p, 0.20, 0.45);
    if (radicleRef.current) {
      radicleRef.current.scale.set(
        embryoGrowth,
        embryoGrowth * 1.3,
        embryoGrowth
      );
      radicleRef.current.position.set(0, -embryoGrowth * 0.14, 0);
    }

    // Glowing germinating embryo core
    if (glowCoreRef.current) {
      const glowIntensity = THREE.MathUtils.smoothstep(p, 0.18, 0.32) * (1.0 - THREE.MathUtils.smoothstep(p, 0.50, 0.75));
      glowCoreRef.current.intensity = glowIntensity * 1.6;
    }

    // Timeline 50% to 75%: Seed husk integrates into soil collar as trunk develops
    const fadeOut = 1.0 - THREE.MathUtils.smoothstep(p, 0.50, 0.75);
    groupRef.current.scale.setScalar(Math.max(0.001, 1.0 - (1.0 - fadeOut) * 0.88));
    groupRef.current.visible = p < 0.80;
  });

  return (
    <group ref={groupRef} castShadow receiveShadow>
      {/* Left Cotyledon Shell */}
      <mesh
        ref={leftCotyledonRef}
        geometry={shellGeo}
        material={huskMaterial}
        castShadow
        receiveShadow
      />

      {/* Right Cotyledon Shell */}
      <mesh
        ref={rightCotyledonRef}
        geometry={shellGeo}
        material={huskMaterial}
        castShadow
        receiveShadow
      />

      {/* Germinating Radicle / Embryo */}
      <mesh
        ref={radicleRef}
        geometry={radicleGeo}
        material={embryoMaterial}
        castShadow
      />

      {/* Vitality Core Glow */}
      <pointLight
        ref={glowCoreRef}
        color="#22c55e"
        intensity={0}
        distance={1.8}
        decay={2}
        position={[0, 0, 0]}
      />
    </group>
  );
}
