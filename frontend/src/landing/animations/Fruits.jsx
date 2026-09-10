import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Droplets, Sprout, Activity, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Fruits & Feature Reveal Component — Botanical Banyan Figs (*Ficus benghalensis*)
 * Botanical & Timeline Progression:
 * - 0% to 68%: Hidden while roots, trunk, and early branches develop
 * - 68% to 78%: Tiny fruit buds emerge on LOWER/LOWER-MIDDLE woody boughs (pale green buds)
 * - 78% to 85%: Immature fruits swell and expand on lower boughs (fresh lime green)
 * - 85% to 90%: Gradual ripening phase synchronized with tree maturity (green -> amber-yellow -> rich golden orange)
 * - 90% to 92%: Fully mature banyan canopy + fully ripe golden-red banyan figs hanging firmly on lower branches
 * - 92% to 96%: Ripe fruits detach from lower boughs and fall with parabolic gravity acceleration, rotation & ground bounce
 * - 96% to 100%: Fruits burst open, revealing the 4 compact DHARA AI feature telemetry cards
 * - 100% Reversible scroll-scrubbed physics
 */

// 4 Feature Fruits placed on authentic ELEVATED FIRST MAJOR LOWER BANYAN BOUGHS (y: 1.25 to 1.36)
const FEATURE_DATA = [
  {
    id: 'moisture',
    icon: Droplets,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    // Positioned on Lower-Left horizontal bough (y ~ 1.25)
    branchPos: new THREE.Vector3(-1.25, 1.25, 0.42),
    groundPos: new THREE.Vector3(-2.15, -0.15, 1.05),
    sizeScale: 1.05,
    rotOffset: [0.15, 0.35, -0.20],
    startBud: 0.68,
    fullSize: 0.85,
    startRipe: 0.85,
    fullRipe: 0.905,
    startFall: 0.920,
    landTime: 0.958,
    openTime: 0.968,
    titles: {
      en: 'Soil Moisture Sensing',
      hi: 'मृदा नमी संवेदन',
    },
    metrics: {
      en: '42.8% • Optimal Hydration',
      hi: '४२.८% • सटीक नमी स्तर',
    },
    descriptions: {
      en: 'Subsurface root-zone moisture sensing & autonomous precision drip control.',
      hi: 'जड़ों में नमी का 24/7 विश्लेषण एवं स्वचालित सूक्ष्म सिंचाई नियंत्रण।',
    },
  },
  {
    id: 'npk',
    icon: Sprout,
    color: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.35)',
    // Positioned on Lower-Left-Center horizontal bough (y ~ 1.36)
    branchPos: new THREE.Vector3(-0.55, 1.36, 0.65),
    groundPos: new THREE.Vector3(-0.75, -0.15, 1.35),
    sizeScale: 0.96,
    rotOffset: [-0.10, -0.20, 0.15],
    startBud: 0.70,
    fullSize: 0.86,
    startRipe: 0.855,
    fullRipe: 0.910,
    startFall: 0.924,
    landTime: 0.960,
    openTime: 0.970,
    titles: {
      en: '7-in-1 NPK Soil Telemetry',
      hi: '७-इन-१ NPK पोषक तत्व',
    },
    metrics: {
      en: '140-45-180 ppm Balanced',
      hi: 'संतुलित N-P-K पोषण',
    },
    descriptions: {
      en: 'Dielectric probe monitoring Nitrogen, Phosphorus, Potassium, pH & EC.',
      hi: 'नाइट्रोजन, फास्फोरस, पोटाश, pH और लवणता का सटीक डिजिटल मापन।',
    },
  },
  {
    id: 'canopy',
    icon: Activity,
    color: '#a3e635',
    glowColor: 'rgba(163, 230, 53, 0.35)',
    // Positioned on Lower-Right-Center horizontal bough (y ~ 1.34)
    branchPos: new THREE.Vector3(0.55, 1.34, 0.60),
    groundPos: new THREE.Vector3(0.75, -0.15, 1.35),
    sizeScale: 1.02,
    rotOffset: [0.12, -0.30, -0.10],
    startBud: 0.71,
    fullSize: 0.865,
    startRipe: 0.860,
    fullRipe: 0.915,
    startFall: 0.928,
    landTime: 0.962,
    openTime: 0.972,
    titles: {
      en: 'Canopy Health & Climate',
      hi: 'फसल स्वास्थ्य एवं मौसम',
    },
    metrics: {
      en: '99.2% Photosynthetic Vitality',
      hi: '९९.२% उत्तम फसल ओज',
    },
    descriptions: {
      en: 'Hyperlocal weather telemetry, VPD analysis, pest prediction & solar flux.',
      hi: 'अति-स्थानीय मौसम पूर्वानुमान, कीट प्रकोप चेतावनी एवं सौर ऊर्जा मैपिंग।',
    },
  },
  {
    id: 'ai',
    icon: Sparkles,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    // Positioned on Lower-Right horizontal bough (y ~ 1.25)
    branchPos: new THREE.Vector3(1.22, 1.25, 0.38),
    groundPos: new THREE.Vector3(2.15, -0.15, 1.05),
    sizeScale: 0.98,
    rotOffset: [-0.15, 0.25, 0.20],
    startBud: 0.72,
    fullSize: 0.87,
    startRipe: 0.865,
    fullRipe: 0.920,
    startFall: 0.932,
    landTime: 0.965,
    openTime: 0.975,
    titles: {
      en: 'Autonomous DHARA AI',
      hi: 'स्वायत्त धारा AI इंजन',
    },
    metrics: {
      en: '+18.4% Yield Optimization',
      hi: '+१८.४% पैदावार में वृद्धि',
    },
    descriptions: {
      en: 'Deep neural agronomic optimization engine delivering instant farm advisory.',
      hi: 'गहन तंत्रिका नेटवर्क जो किसानों को सही समय पर सटीक निर्णय देता है।',
    },
  },
];

/**
 * Single Fruit 3D Object with Attachment Stalk, Multi-Stage Ripening & Falling Physics
 */
function SingleFruit({ fruit, progressRef, quality, language: propLanguage }) {
  const groupRef = useRef();
  const leftHalfRef = useRef();
  const rightHalfRef = useRef();
  const pedicelRef = useRef();
  const glowLightRef = useRef();

  let language = propLanguage || 'en';
  try {
    const langCtx = useLanguage();
    if (langCtx && langCtx.language) {
      language = langCtx.language;
    }
  } catch (e) {
    language = propLanguage || 'en';
  }

  // Create organic fruit half geometry (ovoid banyan fig profile)
  const fruitHalfGeo = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.125, 22, 18, 0, Math.PI);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      // Taper pedicel collar, plump lower fig belly
      const taper = 1.0 - (v.y * 0.38);
      v.x *= taper * 0.85;
      v.z *= taper * 0.96;
      v.y *= 1.20;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Small woody attachment stalk (pedicel) connecting fig to tree branch
  const stalkGeo = useMemo(() => {
    const stalkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.16, 0),
      new THREE.Vector3(0.012, 0.08, 0.005),
      new THREE.Vector3(0, 0.0, 0),
    ]);
    return new THREE.TubeGeometry(stalkCurve, 8, 0.012, 6, false);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = Math.min(1.0, Math.max(0.0, progressRef?.current || 0));

    // Hidden until stage start
    if (p < fruit.startBud) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // 1. Budding & Sizing (0.68 -> 0.85)
    const sizeT = Math.min(1.0, (p - fruit.startBud) / (fruit.fullSize - fruit.startBud));
    const currentScale = THREE.MathUtils.smoothstep(sizeT, 0, 1) * fruit.sizeScale;
    groupRef.current.scale.setScalar(Math.max(0.001, currentScale));

    // 2. Ripening Color Interpolation (0.85 -> 0.905-0.920)
    let ripeT = 0;
    if (p >= fruit.startRipe) {
      ripeT = Math.min(1.0, (p - fruit.startRipe) / (fruit.fullRipe - fruit.startRipe));
    }

    const paleGreen = new THREE.Color('#86efac');
    const richGolden = new THREE.Color(fruit.color);
    const currentColor = paleGreen.clone().lerp(richGolden, ripeT);

    if (leftHalfRef.current && rightHalfRef.current) {
      leftHalfRef.current.material.color.copy(currentColor);
      rightHalfRef.current.material.color.copy(currentColor);
      leftHalfRef.current.material.emissive.copy(currentColor);
      rightHalfRef.current.material.emissive.copy(currentColor);
      leftHalfRef.current.material.emissiveIntensity = ripeT * 0.50;
      rightHalfRef.current.material.emissiveIntensity = ripeT * 0.50;
    }

    // 3. Hanging on Branch vs Falling Physics
    if (p < fruit.startFall) {
      groupRef.current.position.copy(fruit.branchPos);
      groupRef.current.rotation.set(...fruit.rotOffset);
      if (pedicelRef.current) pedicelRef.current.visible = true;

      // Closed fig halves while attached to branch
      if (leftHalfRef.current) {
        leftHalfRef.current.position.set(0, 0, 0);
        leftHalfRef.current.rotation.set(0, 0, 0);
      }
      if (rightHalfRef.current) {
        rightHalfRef.current.position.set(0, 0, 0);
        rightHalfRef.current.rotation.set(0, 0, 0);
      }
    } else {
      // Pedicel snaps off when fruit falls
      if (pedicelRef.current) pedicelRef.current.visible = false;

      const fallSpan = fruit.landTime - fruit.startFall;
      const fallT = Math.min(1.0, Math.max(0.0, (p - fruit.startFall) / fallSpan));

      const startP = fruit.branchPos;
      const endP = fruit.groundPos;

      const curX = THREE.MathUtils.lerp(startP.x, endP.x, fallT);
      const curZ = THREE.MathUtils.lerp(startP.z, endP.z, fallT);
      
      // Parabolic gravity curve with bounce
      let curY;
      if (fallT < 0.85) {
        // Main drop under acceleration
        const dropT = fallT / 0.85;
        curY = THREE.MathUtils.lerp(startP.y, endP.y, Math.pow(dropT, 1.85));
      } else {
        // Elastic rebound bounce
        const bounceT = (fallT - 0.85) / 0.15;
        const bounceHeight = 0.14 * Math.sin(bounceT * Math.PI);
        curY = endP.y + bounceHeight;
      }

      groupRef.current.position.set(curX, curY, curZ);

      // Tumble rotation while falling
      groupRef.current.rotation.x = fruit.rotOffset[0] + fallT * Math.PI * 2.2;
      groupRef.current.rotation.y = fruit.rotOffset[1] + fallT * Math.PI * 1.5;
      groupRef.current.rotation.z = fruit.rotOffset[2] + fallT * Math.PI * 0.8;

      // 4. Ground Landing & Burst Opening Reveal (0.968 -> 1.00)
      if (p >= fruit.openTime) {
        const openSpan = 1.0 - fruit.openTime;
        const openT = Math.min(1.0, (p - fruit.openTime) / openSpan);
        const easeOpen = THREE.MathUtils.smoothstep(openT, 0, 1);

        if (leftHalfRef.current) {
          leftHalfRef.current.position.x = -easeOpen * 0.18;
          leftHalfRef.current.position.y = -easeOpen * 0.04;
          leftHalfRef.current.rotation.z = easeOpen * 0.65;
        }
        if (rightHalfRef.current) {
          rightHalfRef.current.position.x = easeOpen * 0.18;
          rightHalfRef.current.position.y = -easeOpen * 0.04;
          rightHalfRef.current.rotation.z = -easeOpen * 0.65;
        }
      } else {
        if (leftHalfRef.current) {
          leftHalfRef.current.position.set(0, 0, 0);
          leftHalfRef.current.rotation.set(0, 0, 0);
        }
        if (rightHalfRef.current) {
          rightHalfRef.current.position.set(0, 0, 0);
          rightHalfRef.current.rotation.set(0, 0, 0);
        }
      }
    }

    // Dynamic Glow Light
    if (glowLightRef.current) {
      if (p >= fruit.startRipe) {
        const isLanded = p >= fruit.landTime;
        glowLightRef.current.intensity = isLanded ? 1.6 : (ripeT * 0.65);
      } else {
        glowLightRef.current.intensity = 0;
      }
    }
  });

  const isCardOpen = (progressRef?.current || 0) >= fruit.openTime;

  return (
    <group ref={groupRef}>
      {/* Attachment Stalk (Pedicel) */}
      <mesh ref={pedicelRef} geometry={stalkGeo} position={[0, 0.12, 0]} castShadow>
        <meshStandardMaterial color="#4a3728" roughness={0.92} metalness={0.04} />
      </mesh>

      {/* Left Fig Half */}
      <mesh ref={leftHalfRef} geometry={fruitHalfGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#86efac"
          roughness={0.42}
          metalness={0.12}
          bumpScale={0.04}
        />
      </mesh>

      {/* Right Fig Half */}
      <mesh ref={rightHalfRef} geometry={fruitHalfGeo} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#86efac"
          roughness={0.42}
          metalness={0.12}
          bumpScale={0.04}
        />
      </mesh>

      {/* Dynamic Glow Light */}
      <pointLight
        ref={glowLightRef}
        color={fruit.color}
        intensity={0}
        distance={1.2}
        decay={2}
      />

      {/* Interactive Pop-Out Telemetry Card (Revealed upon landing) */}
      {isCardOpen && (
        <Html
          position={[0, 0.42, 0]}
          center
          distanceFactor={5.5}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            style={{
              width: '185px',
              padding: '0.60rem 0.70rem',
              borderRadius: '12px',
              background: 'rgba(8, 20, 14, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${fruit.color}55`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 15px ${fruit.glowColor}`,
              color: '#ffffff',
              fontFamily: 'var(--font-body, sans-serif)',
              textAlign: 'left',
              userSelect: 'none',
              transform: 'scale(1)',
              animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', marginBottom: '0.30rem' }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '6px',
                  background: `${fruit.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: fruit.color,
                }}
              >
                <fruit.icon size={13} />
              </div>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: fruit.color }}>
                {fruit.titles[language] || fruit.titles.en}
              </div>
            </div>

            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
              {fruit.metrics[language] || fruit.metrics.en}
            </div>

            <div style={{ fontSize: '0.50rem', color: 'rgba(236, 253, 245, 0.72)', lineHeight: 1.25 }}>
              {fruit.descriptions[language] || fruit.descriptions.en}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Fruits Component Container — Manages the 4 Banyan Figs
 */
export default function Fruits({ progressRef, quality = 'high', isBW = false, language = 'en' }) {
  return (
    <group>
      {FEATURE_DATA.map((fruit) => (
        <SingleFruit
          key={fruit.id}
          fruit={fruit}
          progressRef={progressRef}
          quality={quality}
          language={language}
        />
      ))}
    </group>
  );
}
