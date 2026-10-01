import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLanguage } from '../../context/LanguageContext';

/**
 * 3D Agricultural Guidance Beacon & Astrolabe Mesh
 * - Faceted Bio-Crystal Core (Emerald & Amber Guidance Light)
 * - Gyroscopic Holographic Compass Ring
 * - Orbiting Golden Spore / Leaf Satellites
 * - Click-activated Wave Expansion Dynamic
 */
function BeaconMesh({ isHovered, isClicked, mousePos }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();
  const pulseWaveRef = useRef();
  const particlesRef = useRef([]);

  // Generate 6 orbiting botanical spore nodes
  const particleNodes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      orbitRadius: 1.1 + (i % 2) * 0.25,
      speed: 1.2 + (i % 3) * 0.3,
      phase: (i * Math.PI) / 3,
      yOffset: ((i - 2.5) / 3) * 0.3,
      scale: 0.12 + (i % 2) * 0.06,
    }));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speedMult = isHovered ? 2.2 : 1.0;

    // 1. Floating harmonic oscillation & mouse tracking tilt
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2.0) * 0.08;
      
      const targetRotX = isHovered ? mousePos.y * 0.35 : Math.sin(time * 1.2) * 0.1;
      const targetRotZ = isHovered ? -mousePos.x * 0.35 : Math.cos(time * 1.4) * 0.08;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
      groupRef.current.rotation.y += delta * 0.6 * speedMult;
    }

    // 2. Core Pulse & Rotation
    if (coreRef.current) {
      const breathing = 1 + Math.sin(time * 3.5) * 0.06;
      const targetScale = isClicked ? 0.75 : isHovered ? 1.18 * breathing : 1.0 * breathing;
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18);
      coreRef.current.rotation.x += delta * 1.0 * speedMult;
      coreRef.current.rotation.z += delta * 0.7 * speedMult;
    }

    // 3. Guidance Horizon Rings (Counter-rotation)
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.4 * speedMult;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 2.2) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 1.6 * speedMult;
      ring2Ref.current.rotation.z = Math.cos(time * 1.8) * 0.2;
    }

    // 4. Click Expansion Wave
    if (pulseWaveRef.current) {
      if (isClicked) {
        pulseWaveRef.current.scale.lerp(new THREE.Vector3(2.2, 2.2, 2.2), 0.25);
        if (pulseWaveRef.current.material) {
          pulseWaveRef.current.material.opacity = THREE.MathUtils.lerp(pulseWaveRef.current.material.opacity, 0.9, 0.3);
        }
      } else {
        pulseWaveRef.current.scale.lerp(new THREE.Vector3(0.1, 0.1, 0.1), 0.15);
        if (pulseWaveRef.current.material) {
          pulseWaveRef.current.material.opacity = THREE.MathUtils.lerp(pulseWaveRef.current.material.opacity, 0.0, 0.2);
        }
      }
    }

    // 5. Orbiting Spore Particles
    particlesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const cfg = particleNodes[idx];
      const angle = time * cfg.speed * speedMult + cfg.phase;
      mesh.position.x = Math.cos(angle) * cfg.orbitRadius;
      mesh.position.z = Math.sin(angle) * cfg.orbitRadius;
      mesh.position.y = cfg.yOffset + Math.sin(time * 3 + idx) * 0.12;
      mesh.rotation.y = angle;
      mesh.rotation.x = Math.sin(time * 2 + idx) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {/* ── 1. CENTRAL GUIDANCE CRYSTAL SEED ── */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#d4a359"
          emissive="#b47834"
          emissiveIntensity={isHovered ? 1.6 : 0.8}
          roughness={0.15}
          metalness={0.85}
          wireframe={false}
        />
      </mesh>

      {/* Internal Luminous Core */}
      <mesh scale={0.35}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.9} />
      </mesh>

      {/* ── 2. HOLOGRAPHIC GUIDANCE ASTROLABE COMPASS RING ── */}
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[0.88, 0.028, 12, 36]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#ca8a04"
            emissiveIntensity={isHovered ? 1.8 : 0.7}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        {/* 4 Cardinal Guide Pointers */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, i) => (
          <mesh key={i} position={[Math.cos(rot) * 0.88, Math.sin(rot) * 0.88, 0]} rotation={[0, 0, rot]}>
            <coneGeometry args={[0.06, 0.14, 4]} />
            <meshBasicMaterial color="#e8d5b5" />
          </mesh>
        ))}
      </group>

      {/* Secondary Gyro Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.02, 0.016, 8, 32]} />
        <meshBasicMaterial color="#d4a359" transparent opacity={0.65} />
      </mesh>

      {/* ── 3. CLICK ACTIVATION WAVE ── */}
      <mesh ref={pulseWaveRef} scale={[0.1, 0.1, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.0, 32]} />
        <meshBasicMaterial color="#e8d5b5" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* ── 4. ORBITING BOTANICAL SPORES & LEAF NODES ── */}
      {particleNodes.map((cfg, idx) => (
        <mesh
          key={idx}
          ref={(el) => (particlesRef.current[idx] = el)}
          scale={cfg.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#d4a359' : '#fbbf24'}
            emissive={idx % 2 === 0 ? '#b47834' : '#d97706'}
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * GuideBeacon3D — Techkriti-Grade 3D Agricultural Guide Button
 * Integrates a real-time micro WebGL guidance astrolabe directly into the Interactive Guide action.
 */
const GuideBeacon3D = ({ onClick }) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      if (onClick) onClick(e);
    }, 220);
  };

  return (
    <button
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: isHovered
          ? 'linear-gradient(135deg, rgba(212, 163, 89, 0.20) 0%, rgba(217, 119, 6, 0.16) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(212, 163, 89, 0.08) 100%)',
        border: isHovered
          ? '1px solid rgba(212, 163, 89, 0.55)'
          : '1px solid var(--border-glass)',
        borderRadius: '999px',
        padding: '0.32rem 0.85rem 0.32rem 0.45rem',
        color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: '0.78rem',
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        cursor: 'pointer',
        boxShadow: isHovered
          ? '0 0 20px rgba(212, 163, 89, 0.35), inset 0 0 12px rgba(212, 163, 89, 0.15)'
          : '0 2px 8px rgba(0, 0, 0, 0.4)',
        transform: isClicked ? 'scale(0.96)' : isHovered ? 'translateY(-1px)' : 'none',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.18s ease, color 0.2s ease',
        userSelect: 'none',
      }}
      title={t('nav.helpGuide')}
      aria-label={t('nav.helpGuide')}
    >
      {/* ── LIVE 3D HOLOGRAPHIC COMPASS BEACON (30px x 30px) ── */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(212, 163, 89, 0.25) 0%, rgba(16, 12, 6, 0.9) 100%)',
          border: isHovered ? '1px solid rgba(232, 213, 181, 0.6)' : '1px solid rgba(212, 163, 89, 0.35)',
          boxShadow: isHovered
            ? '0 0 14px rgba(212, 163, 89, 0.5), inset 0 0 8px rgba(217, 119, 6, 0.3)'
            : '0 0 6px rgba(212, 163, 89, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
          transition: 'all 0.25s ease',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.9} />
          <pointLight position={[3, 3, 3]} intensity={2.2} color="#e8d5b5" />
          <pointLight position={[-3, -2, 2]} intensity={1.6} color="#d4a359" />
          <Suspense fallback={null}>
            <BeaconMesh isHovered={isHovered} isClicked={isClicked} mousePos={mousePos} />
          </Suspense>
        </Canvas>
      </div>

      {/* Button Label */}
      <span style={{ letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
        {t('nav.helpGuide')}
      </span>

      {/* Guidance Pulse Dot Indicator */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isHovered ? 'var(--text-secondary)' : 'var(--accent-primary)',
          boxShadow: isHovered ? '0 0 8px var(--text-secondary)' : '0 0 4px var(--accent-primary)',
          display: 'inline-block',
          marginLeft: '0.1rem',
          animation: 'guidePulse 2.4s infinite ease-in-out',
        }}
      />

      <style>{`
        @keyframes guidePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </button>
  );
};

export default GuideBeacon3D;
