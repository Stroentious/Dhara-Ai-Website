import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Droplets, Sprout, Activity, Sun, Sparkles } from 'lucide-react';

/**
 * AgriculturalNodes Component — Subtle DHARA AI Telemetry Indicators
 * - Emerges smoothly only when the tree reaches maturity (p >= 0.84)
 * - Fades out seamlessly on reverse scroll
 * - Premium translucent glass styling
 */

const TelemetryBadge = ({ icon: Icon, label, value, status, accentColor = '#22c55e' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.55rem',
      background: 'rgba(6, 15, 10, 0.82)',
      border: `1px solid ${accentColor}40`,
      borderRadius: '999px',
      padding: '0.35rem 0.75rem',
      boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 15px ${accentColor}25`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontSize: '0.72rem',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      userSelect: 'none',
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: `${accentColor}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={12} color={accentColor} />
    </div>
    <div>
      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>{label}</div>
      <div style={{ fontWeight: 700, color: '#ecfdf5', fontSize: '0.74rem' }}>{value}</div>
    </div>
  </div>
);

export default function AgriculturalNodes({ progressRef }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    const p = progressRef.current || 0;

    // Reveal when p >= 0.84
    const opacity = THREE.MathUtils.smoothstep(p, 0.84, 0.96);
    groupRef.current.visible = opacity > 0.01;

    // Apply scale / gentle floating
    const scale = THREE.MathUtils.lerp(0.8, 1.0, opacity);
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {/* Node 1: Underground Soil Moisture (Left Root Zone) */}
      <group position={[-1.3, -0.4, 0.3]}>
        <Html center distanceFactor={8} zIndexRange={[10, 0]}>
          <TelemetryBadge
            icon={Droplets}
            label="Root Moisture"
            value="42.8% • Optimal"
            accentColor="#38bdf8"
          />
        </Html>
      </group>

      {/* Node 2: Soil Nutrients NPK (Right Root Zone) */}
      <group position={[1.3, -0.3, -0.2]}>
        <Html center distanceFactor={8} zIndexRange={[10, 0]}>
          <TelemetryBadge
            icon={Sprout}
            label="NPK Balance"
            value="140-45-180 ppm"
            accentColor="#4ade80"
          />
        </Html>
      </group>

      {/* Node 3: Canopy Health & Photosynthesis (Left Canopy) */}
      <group position={[-1.5, 2.2, 0.2]}>
        <Html center distanceFactor={8} zIndexRange={[10, 0]}>
          <TelemetryBadge
            icon={Activity}
            label="Canopy Vigor"
            value="99.2% • Prime"
            accentColor="#22c55e"
          />
        </Html>
      </group>

      {/* Node 4: Micro-Climate & AI Insights (Right Canopy) */}
      <group position={[1.5, 2.4, 0.1]}>
        <Html center distanceFactor={8} zIndexRange={[10, 0]}>
          <TelemetryBadge
            icon={Sparkles}
            label="Dhara AI Engine"
            value="Growth Optimized"
            accentColor="#fbbf24"
          />
        </Html>
      </group>
    </group>
  );
}
