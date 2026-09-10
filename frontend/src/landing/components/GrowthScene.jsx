import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import GrowthCamera from '../animations/GrowthCamera';
import Seed from '../animations/Seed';
import Roots from '../animations/Roots';
import Stem from '../animations/Stem';
import Branches from '../animations/Branches';
import Leaves from '../animations/Leaves';
import Fruits from '../animations/Fruits';
import Environment from '../animations/Environment';
import Rain from '../animations/Rain';

/**
 * GrowthSceneInner — R3F Scene Graph Container for Botanical Banyan Growth
 */
function GrowthSceneInner({ progressRef, cursorRef, quality, onTreeClick, isBW = false, language = 'en' }) {
  const treeGroupRef = useRef();

  useFrame((state, delta) => {
    if (!treeGroupRef.current) return;
    const curX = cursorRef?.current?.x || 0;
    
    // Gentle global tree sway influenced by cursor
    const sway = Math.sin(state.clock.elapsedTime * 0.7) * 0.02 + curX * 0.04;
    treeGroupRef.current.rotation.y = THREE.MathUtils.lerp(treeGroupRef.current.rotation.y, sway, 0.08);
  });

  return (
    <>
      <GrowthCamera progressRef={progressRef} cursorRef={cursorRef} />
      <Environment progressRef={progressRef} cursorRef={cursorRef} quality={quality} isBW={isBW} />
      <Rain progressRef={progressRef} quality={quality} isBW={isBW} />

      <group
        ref={treeGroupRef}
        onClick={onTreeClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <Seed progressRef={progressRef} cursorRef={cursorRef} quality={quality} />
        <Roots progressRef={progressRef} cursorRef={cursorRef} quality={quality} />
        <Stem progressRef={progressRef} cursorRef={cursorRef} quality={quality} />
        <Branches progressRef={progressRef} cursorRef={cursorRef} quality={quality} />
        <Leaves progressRef={progressRef} cursorRef={cursorRef} quality={quality} />
        <Fruits progressRef={progressRef} quality={quality} isBW={isBW} language={language} />
      </group>
    </>
  );
}

/**
 * GrowthScene — Canvas Foundation & Quality Controller
 */
export default function GrowthScene({
  progressRef,
  cursorRef,
  quality = 'high',
  onTreeClick,
  isBW = false,
  language = 'en',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`growth-scene-canvas ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={quality === 'low' ? [1, 1.25] : [1, 1.75]}
          camera={{ position: [0, 0.15, 2.1], fov: 36 }}
          shadows={quality !== 'low' ? 'soft' : false}
          gl={{
            antialias: quality !== 'low',
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            outputColorSpace: THREE.SRGBColorSpace,
            depth: true,
            stencil: false,
          }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <GrowthSceneInner
            progressRef={progressRef}
            cursorRef={cursorRef}
            quality={quality}
            onTreeClick={onTreeClick}
            isBW={isBW}
            language={language}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
