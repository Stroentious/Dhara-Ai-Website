import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Seed Component — Photorealistic Biological Cross-Section (Reference Image 1)
 * 
 * Features:
 * - Symmetrical lignified seed coat (testa) with realistic wall thickness & warm tan/brown texture
 * - Inner cotyledon cross-section with pale olive-green cellular porous matrix
 * - Central embryonic heart cleft linking the downward radicle to the upward plumule shoot
 * - Clinging soil granules and microscopic root hairs adhering to the seed base
 * - Biological germination timeline (28% to 48% scroll): suture splits open, revealing inner anatomy
 * - 100% reversible scroll scrubbing
 */

export default function Seed({ progressRef, cursorRef, quality = 'high' }) {
  const groupRef = useRef();
  const leftCoatRef = useRef();
  const rightCoatRef = useRef();
  const leftCotyledonRef = useRef();
  const rightCotyledonRef = useRef();
  const radicleTipRef = useRef();
  const plumuleTipRef = useRef();

  // 1. Outer Shell Geometry (Half-egg cross-section with dorsal ridge and wall thickness)
  const { coatGeo, cotyledonGeo, soilCrumbsGeo } = useMemo(() => {
    const segW = quality === 'low' ? 24 : quality === 'medium' ? 32 : 44;
    const segH = quality === 'low' ? 20 : quality === 'medium' ? 28 : 36;
    
    // Outer Shell Half
    const cGeo = new THREE.SphereGeometry(0.28, segW, segH, 0, Math.PI);
    const cPos = cGeo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < cPos.count; i++) {
      v.fromBufferAttribute(cPos, i);
      const ny = v.y / 0.28; // -1 to 1
      // Botanical seed teardrop shape: slender apex, rounded bottom
      const taper = 1.0 - ny * 0.38 + Math.pow(Math.max(0, ny), 2.2) * 0.18;
      v.x *= taper * 0.82;
      v.z *= taper * 0.92;
      v.y *= 1.32; // Vertical elongation

      // Dorsal ridge
      if (v.z > 0) {
        v.z += Math.sin(Math.PI * (ny * 0.5 + 0.5)) * 0.035;
      }
      // Micro-texture bump
      v.x += Math.sin(v.y * 18.0) * 0.005;
      v.z += Math.cos(v.x * 20.0) * 0.005;

      cPos.setXYZ(i, v.x, v.y, v.z);
    }
    cGeo.computeVertexNormals();

    // Inner Cotyledon Half (slightly smaller to fit inside shell with visible wall rim)
    const cotGeo = new THREE.SphereGeometry(0.26, segW, segH, 0, Math.PI);
    const cotPos = cotGeo.attributes.position;

    for (let i = 0; i < cotPos.count; i++) {
      cotPos.setXYZ(
        i,
        cPos.getX(i) * 0.91,
        cPos.getY(i) * 0.91,
        cPos.getZ(i) * 0.91
      );
    }
    cotGeo.computeVertexNormals();

    // Soil crumbs adhering to base
    const crumbCount = quality === 'low' ? 35 : 70;
    const crumbPos = new Float32Array(crumbCount * 3);
    const crumbScale = new Float32Array(crumbCount);
    for (let i = 0; i < crumbCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.14 + Math.random() * 0.16;
      crumbPos[i * 3 + 0] = Math.cos(theta) * r;
      crumbPos[i * 3 + 1] = -0.28 - Math.random() * 0.14;
      crumbPos[i * 3 + 2] = Math.sin(theta) * r;
      crumbScale[i] = 0.008 + Math.random() * 0.016;
    }
    const crGeo = new THREE.BufferGeometry();
    crGeo.setAttribute('position', new THREE.BufferAttribute(crumbPos, 3));
    crGeo.setAttribute('scale', new THREE.BufferAttribute(crumbScale, 1));

    return { coatGeo: cGeo, cotyledonGeo: cotGeo, soilCrumbsGeo: crGeo };
  }, [quality]);

  // 2. Materials
  // Outer Lignified Testa (Warm tan/brown seed coat)
  const coatMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#663816'),
      roughness: 0.82,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
  }, []);

  // Inner Cotyledon (Pale olive-green cellular tissue)
  const cotyledonMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8C9E5E'),
      emissive: new THREE.Color('#3A4C1C'),
      emissiveIntensity: 0.28,
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
  }, []);

  // Emerging Radicle (Pale ivory/cream taproot tip)
  const radicleMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f4ede2'),
      roughness: 0.40,
      metalness: 0.02,
    });
  }, []);

  // Emerging Shoot (Natural woody shoot)
  const shootMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5a3d28'),
      roughness: 0.75,
      metalness: 0.05,
    });
  }, []);

  // Clinging Soil Crumb Material
  const soilCrumbMat = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#1f140c'),
      size: 0.022,
      sizeAttenuation: true,
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = progressRef.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;

    // 0% to 18%: Seed rests at topsoil furrow (y = -0.10) and gently settles into moist earth (y = -0.21)
    const settle = THREE.MathUtils.smoothstep(p, 0.01, 0.18);
    const seedY = -0.10 - settle * 0.11;

    // Organic micro-breathing & gentle cursor parallax
    const swayX = Math.sin(state.clock.elapsedTime * 0.70) * 0.012 + curX * 0.020;
    const swayZ = Math.cos(state.clock.elapsedTime * 0.55) * 0.012 + curY * 0.020;

    groupRef.current.position.set(0, seedY, 0);
    groupRef.current.rotation.set(0.12 + swayZ, swayX, 0.04);

    // ── GERMINATION POPPING / SPLIT SEQUENCE (18% to 35% scroll) ──
    // As irrigation moisture activates embryo, seed coat parts along the sagittal suture & pops open
    const splitT = THREE.MathUtils.smoothstep(p, 0.18, 0.35);
    const splitX = splitT * 0.11;
    const splitAngle = splitT * 0.32;

    if (leftCoatRef.current && leftCotyledonRef.current) {
      leftCoatRef.current.position.set(-splitX, 0, 0);
      leftCoatRef.current.rotation.set(0, 0, splitAngle);
      leftCotyledonRef.current.position.set(-splitX * 0.92, 0, 0);
      leftCotyledonRef.current.rotation.set(0, 0, splitAngle * 0.95);
    }

    if (rightCoatRef.current && rightCotyledonRef.current) {
      rightCoatRef.current.position.set(splitX, 0, 0);
      rightCoatRef.current.rotation.set(0, Math.PI, -splitAngle);
      rightCotyledonRef.current.position.set(splitX * 0.92, 0, 0);
      rightCotyledonRef.current.rotation.set(0, Math.PI, -splitAngle * 0.95);
    }

    // ── RADICLE EMERGENCE DOWNWARD (20% to 42% scroll) ──
    const radicleGrowth = THREE.MathUtils.smoothstep(p, 0.20, 0.40);
    if (radicleTipRef.current) {
      radicleTipRef.current.scale.set(
        radicleGrowth,
        radicleGrowth * 1.5,
        radicleGrowth
      );
      radicleTipRef.current.position.set(0, -0.28 - radicleGrowth * 0.16, 0);
    }

    // ── PLUMULE / SHOOT EMERGENCE UPWARD (24% to 46% scroll) ──
    const shootGrowth = THREE.MathUtils.smoothstep(p, 0.24, 0.45);
    if (plumuleTipRef.current) {
      plumuleTipRef.current.scale.set(
        shootGrowth,
        shootGrowth * 1.6,
        shootGrowth
      );
      plumuleTipRef.current.position.set(0, 0.24 + shootGrowth * 0.12, 0);
    }


    // ── SEED COAT MERGING INTO SOIL COLLAR (48% to 75% scroll) ──
    const fadeOut = 1.0 - THREE.MathUtils.smoothstep(p, 0.48, 0.72);
    groupRef.current.scale.setScalar(Math.max(0.001, 1.0 - (1.0 - fadeOut) * 0.90));
    groupRef.current.visible = p < 0.78;
  });

  return (
    <group ref={groupRef}>
      {/* ── 1. LEFT SEED HALF ── */}
      <group>
        <mesh
          ref={leftCoatRef}
          geometry={coatGeo}
          material={coatMat}
          castShadow
          receiveShadow
        />
        <mesh
          ref={leftCotyledonRef}
          geometry={cotyledonGeo}
          material={cotyledonMat}
          castShadow
          receiveShadow
        />
      </group>

      {/* ── 2. RIGHT SEED HALF ── */}
      <group>
        <mesh
          ref={rightCoatRef}
          geometry={coatGeo}
          material={coatMat}
          castShadow
          receiveShadow
        />
        <mesh
          ref={rightCotyledonRef}
          geometry={cotyledonGeo}
          material={cotyledonMat}
          castShadow
          receiveShadow
        />
      </group>

      {/* ── 3. EMERGING IVORY RADICLE (Taproot precursor) ── */}
      <mesh ref={radicleTipRef} material={radicleMat} castShadow>
        <coneGeometry args={[0.075, 0.35, 20]} />
      </mesh>

      {/* ── 4. EMERGING PLUMULE (Green shoot precursor) ── */}
      <mesh ref={plumuleTipRef} material={shootMat} castShadow>
        <coneGeometry args={[0.055, 0.30, 20]} />
      </mesh>

      {/* ── 5. CLINGING SOIL CRUMBS ── */}
      <points geometry={soilCrumbsGeo} material={soilCrumbMat} />
    </group>
  );
}
