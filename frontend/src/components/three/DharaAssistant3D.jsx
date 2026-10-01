import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '../../context/LanguageContext';

/**
 * 3D Bio-Agronomic AI Assistant Orb
 * Features:
 * - Luminous multifaceted crystalline core with organic biosensing pulse
 * - Dual-axis counter-rotating gyro telemetry rings with agronomic emerald & cyan accents
 * - Swarming nutrient ion/data spore particles
 * - Smooth hover acceleration and click dynamics
 */
function AssistantMesh({ isHovered, isClicked }) {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speedMultiplier = isHovered ? 2.2 : 1.0;

    // Smooth harmonic floating & gentle tilting
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.12;
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.15;
    }

    // Core pulsing glow
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 3.5) * 0.08;
      const targetScale = isClicked ? 0.85 : isHovered ? 1.18 * pulse : 1.0 * pulse;
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      coreRef.current.rotation.x += delta * 0.8 * speedMultiplier;
      coreRef.current.rotation.y += delta * 1.2 * speedMultiplier;
    }

    // Concentric gyro telemetry rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 1.5 * speedMultiplier;
      ring1Ref.current.rotation.y += delta * 0.8 * speedMultiplier;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 1.8 * speedMultiplier;
      ring2Ref.current.rotation.z += delta * 1.1 * speedMultiplier;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z -= delta * 1.3 * speedMultiplier;
      ring3Ref.current.rotation.x -= delta * 0.9 * speedMultiplier;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Core Bio-Energy Crystal (Icosahedron + Inner Sphere) */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshPhysicalMaterial
          color="#d4a359"
          emissive="#b47834"
          emissiveIntensity={isHovered ? 1.8 : 0.9}
          roughness={0.15}
          metalness={0.8}
          transmission={0.4}
          ior={1.3}
          thickness={0.5}
        />
      </mesh>
      <mesh scale={0.5}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#faf7f0" transparent opacity={0.95} />
      </mesh>

      {/* 2. Concentric Gyro Telemetry Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.15, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#d4a359"
          emissive="#a87232"
          emissiveIntensity={isHovered ? 1.5 : 0.7}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.35, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={isHovered ? 1.6 : 0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[0.95, 0.02, 16, 48]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#eab308"
          emissiveIntensity={isHovered ? 1.7 : 0.7}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* 3. Swarming Nutrient Ion / Data Spore Particles */}
      <Sparkles
        count={24}
        scale={[3.2, 3.2, 3.2]}
        size={3}
        speed={isHovered ? 2.5 : 1.2}
        color="#e8d5b5"
      />
      <Sparkles
        count={8}
        scale={[2.5, 2.5, 2.5]}
        size={4}
        speed={isHovered ? 3.0 : 1.5}
        color="#38bdf8"
      />
    </group>
  );
}

const DharaAssistant3D = ({ onClick }) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      if (onClick) onClick(e);
    }, 200);
  };

  return (
    <div
      className="dhara-3d-assistant-container"
      data-tour="ask-dhara"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 999,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        userSelect: 'none',
      }}
    >
      {/* Dynamic Bilingual Tooltip / Label Pill */}
      <div
        className="assistant-label-pill"
        data-tour="voice-search"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 15, 10, 0.95) 0%, rgba(10, 7, 4, 0.98) 100%)',
          border: '1px solid rgba(212, 163, 89, 0.45)',
          borderRadius: '999px',
          padding: '0.52rem 1.05rem 0.52rem 0.9rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.7), 0 0 15px rgba(212, 163, 89, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transform: isHovered ? 'scale(1.04) translateX(-2px)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--accent-primary)',
            display: 'inline-block',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            {t('assistant.title')}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {t('assistant.floatingHint')}
          </span>
        </div>
      </div>

      {/* 3D Interactive Canvas Orb Viewport (Scaled up to 84px) */}
      <div
        className="assistant-orb-canvas-box"
        style={{
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(212, 163, 89, 0.25) 0%, rgba(100, 65, 25, 0.4) 50%, rgba(12, 9, 6, 0.95) 100%)',
          border: isHovered ? '2.5px solid var(--accent-primary)' : '1.5px solid rgba(212, 163, 89, 0.5)',
          boxShadow: isHovered
            ? '0 12px 35px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 163, 89, 0.65), inset 0 0 18px rgba(217, 119, 6, 0.35)'
            : '0 8px 26px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 163, 89, 0.4)',
          transform: isClicked ? 'scale(0.92)' : isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease, box-shadow 0.2s ease',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.9} />
          <pointLight position={[4, 4, 4]} intensity={2.5} color="#e8d5b5" />
          <pointLight position={[-4, -3, 2]} intensity={1.8} color="#d4a359" />
          <directionalLight position={[0, 5, 2]} intensity={1.2} color="#ffffff" />
          <Suspense fallback={null}>
            <AssistantMesh isHovered={isHovered} isClicked={isClicked} />
          </Suspense>
        </Canvas>
      </div>

      <style>{`
        @keyframes orbGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(212, 163, 89, 0.4)); }
          50% { filter: drop-shadow(0 0 16px rgba(217, 119, 6, 0.6)); }
        }
        .dhara-3d-assistant-container {
          animation: orbGlowPulse 4s infinite ease-in-out;
        }
        @media (max-width: 768px) {
          .dhara-3d-assistant-container {
            bottom: 1.25rem !important;
            right: 1.25rem !important;
          }
          .assistant-label-pill {
            display: none !important;
          }
          .assistant-orb-canvas-box {
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DharaAssistant3D;
