import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GrowthCamera Component — Cinematic Scroll-Driven Camera Choreography for Botanical Banyan
 * Timeline Choreography:
 * - 0% to 18%: Macro focus on seed resting and settling into rich soil
 * - 18% to 32%: Underground focus framing seed cracking and subterranean taproot development
 * - 32% to 48%: Ascends smoothly with emerging green shoot and early branching
 * - 48% to 68%: Frames fluted Banyan trunk thickening and expansive horizontal limbs
 * - 68% to 85%: Captures hanging aerial prop roots grounding into soil and dense umbrella canopy
 * - 85% to 92%: Canopy focus on ripening golden feature fruits
 * - 92% to 100%: Widens gracefully to frame fruits detaching, falling, bouncing on soil, and popping feature telemetry cards
 * - 100% Reversible video-scrubbing behavior
 */

export default function GrowthCamera({ progressRef, cursorRef }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, -0.08, 0));
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const p = progressRef.current || 0;
    const curX = cursorRef?.current?.x || 0;
    const curY = cursorRef?.current?.y || 0;

    let targetX = 0;
    let targetY = 0.15;
    let targetZ = 2.1;
    let targetFov = 36;
    let lookY = -0.08;

    if (p <= 0.18) {
      // 0% - 18%: Macro seed resting & settling into soil
      const t = p / 0.18;
      targetY = THREE.MathUtils.lerp(0.15, 0.08, t);
      targetZ = THREE.MathUtils.lerp(2.1, 2.35, t);
      targetFov = THREE.MathUtils.lerp(36, 37, t);
      lookY = THREE.MathUtils.lerp(-0.08, -0.15, t);
    } else if (p <= 0.32) {
      // 18% - 32%: Subterranean roots & cracking seed
      const t = (p - 0.18) / 0.14;
      targetY = THREE.MathUtils.lerp(0.08, 0.22, t);
      targetZ = THREE.MathUtils.lerp(2.35, 2.75, t);
      targetFov = THREE.MathUtils.lerp(37, 38.5, t);
      lookY = THREE.MathUtils.lerp(-0.15, 0.10, t);
    } else if (p <= 0.48) {
      // 32% - 48%: Emerging green shoot & early branching
      const t = (p - 0.32) / 0.16;
      targetY = THREE.MathUtils.lerp(0.22, 0.65, t);
      targetZ = THREE.MathUtils.lerp(2.75, 3.45, t);
      targetFov = THREE.MathUtils.lerp(38.5, 41, t);
      lookY = THREE.MathUtils.lerp(0.10, 0.55, t);
    } else if (p <= 0.68) {
      // 48% - 68%: Fluted Banyan trunk thickening & wide horizontal limbs
      const t = (p - 0.48) / 0.20;
      targetY = THREE.MathUtils.lerp(0.65, 1.15, t);
      targetZ = THREE.MathUtils.lerp(3.45, 4.35, t);
      targetFov = THREE.MathUtils.lerp(41, 43.5, t);
      lookY = THREE.MathUtils.lerp(0.55, 1.05, t);
    } else if (p <= 0.85) {
      // 68% - 85%: Aerial prop roots & broad spreading canopy
      const t = (p - 0.68) / 0.17;
      targetY = THREE.MathUtils.lerp(1.15, 1.28, t);
      targetZ = THREE.MathUtils.lerp(4.35, 4.95, t);
      targetFov = THREE.MathUtils.lerp(43.5, 45, t);
      lookY = THREE.MathUtils.lerp(1.05, 1.18, t);
    } else if (p <= 0.92) {
      // 85% - 92%: Canopy ripe fruits focus
      const t = (p - 0.85) / 0.07;
      targetY = THREE.MathUtils.lerp(1.28, 1.34, t);
      targetZ = THREE.MathUtils.lerp(4.95, 5.15, t);
      targetFov = THREE.MathUtils.lerp(45, 45.5, t);
      lookY = THREE.MathUtils.lerp(1.18, 1.22, t);
    } else {
      // 92% - 100%: Widens gracefully to frame falling fruits landing on soil & popping feature cards
      const t = (p - 0.92) / 0.08;
      targetY = THREE.MathUtils.lerp(1.34, 0.92, t);
      targetZ = THREE.MathUtils.lerp(5.15, 5.45, t);
      targetFov = THREE.MathUtils.lerp(45.5, 46.5, t);
      lookY = THREE.MathUtils.lerp(1.22, 0.65, t);
    }

    // Subtle cursor parallax
    const parallaxX = curX * 0.22;
    const parallaxY = curY * 0.14;

    const finalCamPos = new THREE.Vector3(targetX + parallaxX, targetY + parallaxY, targetZ);
    targetLookAt.current.set(parallaxX * 0.3, lookY, 0);

    // Smooth damping
    const dampFactor = Math.min(1.0, delta * 5.0);
    camera.position.lerp(finalCamPos, dampFactor);
    currentLookAt.current.lerp(targetLookAt.current, dampFactor);

    if (camera.fov !== targetFov) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, dampFactor);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
