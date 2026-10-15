import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  connections: number[];
}

function NetworkParticles({ count = 80, mousePos }: { count?: number; mousePos: React.RefObject<{ x: number; y: number }> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<Particle[]>([]);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Red-ish tones
      const r = 0.8 + Math.random() * 0.2;
      const g = 0.15 + Math.random() * 0.1;
      const b = 0.15 + Math.random() * 0.15;
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      particles.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.002
        ),
        connections: [],
      });
    }

    particlesRef.current = particles;
    return { positions, colors };
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(count * count * 6), [count]);
  const lineColors = useMemo(() => new Float32Array(count * count * 6), [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const particles = particlesRef.current;
    const time = state.clock.getElapsedTime();

    // Mouse influence
    const mx = mousePos.current ? mousePos.current.x * 5 : 0;
    const my = mousePos.current ? mousePos.current.y * 3 : 0;

    // Update particles
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.position.add(p.velocity);

      // Add subtle mouse attraction
      const dx = mx - p.position.x;
      const dy = my - p.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 5) {
        p.position.x += dx * 0.0005;
        p.position.y += dy * 0.0005;
      }

      // Gentle oscillation
      p.position.y += Math.sin(time * 0.5 + i * 0.1) * 0.001;

      // Bounds
      if (p.position.x > 10 || p.position.x < -10) p.velocity.x *= -1;
      if (p.position.y > 6 || p.position.y < -6) p.velocity.y *= -1;
      if (p.position.z > 4 || p.position.z < -4) p.velocity.z *= -1;

      positionAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);
    }
    positionAttr.needsUpdate = true;

    // Update connections
    let lineIndex = 0;
    const connectionDistance = 3;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const d = particles[i].position.distanceTo(particles[j].position);
        if (d < connectionDistance) {
          const alpha = 1 - d / connectionDistance;

          linePositions[lineIndex * 6] = particles[i].position.x;
          linePositions[lineIndex * 6 + 1] = particles[i].position.y;
          linePositions[lineIndex * 6 + 2] = particles[i].position.z;
          linePositions[lineIndex * 6 + 3] = particles[j].position.x;
          linePositions[lineIndex * 6 + 4] = particles[j].position.y;
          linePositions[lineIndex * 6 + 5] = particles[j].position.z;

          const r = 0.9 * alpha;
          const g = 0.2 * alpha;
          const b = 0.2 * alpha;
          lineColors[lineIndex * 6] = r;
          lineColors[lineIndex * 6 + 1] = g;
          lineColors[lineIndex * 6 + 2] = b;
          lineColors[lineIndex * 6 + 3] = r;
          lineColors[lineIndex * 6 + 4] = g;
          lineColors[lineIndex * 6 + 5] = b;

          lineIndex++;
        }
      }
    }

    const lineGeom = linesRef.current.geometry;
    const linePosAttr = lineGeom.attributes.position as THREE.BufferAttribute;
    const lineColAttr = lineGeom.attributes.color as THREE.BufferAttribute;
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;
    lineGeom.setDrawRange(0, lineIndex * 2);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

interface ParticleNetworkProps {
  className?: string;
}

export function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <NetworkParticles count={60} mousePos={mousePos} />
      </Canvas>
    </div>
  );
}

