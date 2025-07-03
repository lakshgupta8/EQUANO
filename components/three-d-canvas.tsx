"use client"

import { useEffect, useState, useMemo } from "react"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Line } from '@react-three/drei'
import { evaluateExpression } from "@/lib/math-parser"
import * as isosurface from 'isosurface';
import * as THREE from 'three';
import { Line as DreiLine } from '@react-three/drei';
import { useMeshWorker } from '../hooks/useMeshWorker';

export interface Expression {
  expression: string;
  visible: boolean;
  color: string;
}

export interface PlotPoint {
  points: [number, number, number][];
  color: string;
}

export interface ThreeDCanvasProps {
  expressions: Expression[];
  sliderValues: Record<string, number>;
  isAnimating: boolean;
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function ThreeDCanvas({ expressions, sliderValues, isAnimating }: ThreeDCanvasProps) {
  const debouncedSliderValues = useDebouncedValue(sliderValues, 60);
  const effectiveSliderValues = isAnimating ? sliderValues : debouncedSliderValues;

  const implicitExpr = expressions.find(
    (expr) => expr.visible && expr.expression.includes('=') && !expr.expression.trim().toLowerCase().startsWith('z=')
  );
  let left = '', right = '', color = '#888';
  const size = 20, range = 5;
  if (implicitExpr) {
    [left, right] = implicitExpr.expression.split('=').map(s => s.trim());
    color = implicitExpr.color;
  }
  const meshData = useMeshWorker(left, right, size, range, effectiveSliderValues);

  // Memoize plot data for performance
  const { plotData, meshes, lines } = useMemo(() => {
    const plotData: PlotPoint[] = [];
    const meshes: any[] = [];
    const lines: any[] = [];
    expressions.forEach((expr) => {
      if (!expr.visible) return;
      try {
        // Implicit surface (marching cubes)
        if (expr.expression.includes('=') && !expr.expression.trim().toLowerCase().startsWith('z=')) {
          const [left, right] = expr.expression.split('=').map(s => s.trim());
          const size = 20; // Lowered for performance
          const range = 5;
          const field = (x: number, y: number, z: number) => {
            try {
              return evaluateExpression(left, { x, y, z, ...effectiveSliderValues }) - evaluateExpression(right, { x, y, z, ...effectiveSliderValues });
            } catch {
              return 1e6;
            }
          };
          const meshData = isosurface.marchingCubes([size, size, size], (i, j, k) => {
            const x = (i / (size - 1)) * (2 * range) - range;
            const y = (j / (size - 1)) * (2 * range) - range;
            const z = (k / (size - 1)) * (2 * range) - range;
            return field(x, y, z);
          }, 0);
          const geometry = new THREE.BufferGeometry();
          const vertices = new Float32Array(meshData.positions.flat());
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          const indices = new Uint32Array(meshData.cells.flat());
          geometry.setIndex(new THREE.BufferAttribute(indices, 1));
          geometry.computeVertexNormals();
          geometry.computeBoundingBox();
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          geometry.translate(-center.x, -center.y, -center.z);
          meshes.push({ geometry, color: expr.color });
          return;
        }
        // Explicit z = f(x, y) surface
        if (expr.expression.trim().toLowerCase().startsWith('z=')) {
          const zExpr = expr.expression.replace(/^z\s*=\s*/, "");
          const size = 30; // Lowered for performance
          const range = 5;
          const vertices: number[] = [];
          const indices: number[] = [];
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              const x = (i / (size - 1)) * (2 * range) - range;
              const y = (j / (size - 1)) * (2 * range) - range;
              let z = 0;
              try {
                z = evaluateExpression(zExpr, { x, y, ...effectiveSliderValues });
                if (!isFinite(z)) z = 0;
              } catch { z = 0; }
              vertices.push(x, y, z);
            }
          }
          for (let i = 0; i < size - 1; i++) {
            for (let j = 0; j < size - 1; j++) {
              const a = i * size + j;
              const b = (i + 1) * size + j;
              const c = (i + 1) * size + (j + 1);
              const d = i * size + (j + 1);
              indices.push(a, b, d, b, c, d);
            }
          }
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
          geometry.setIndex(indices);
          geometry.computeVertexNormals();
          meshes.push({ geometry, color: expr.color });
          return;
        }
        // Explicit y = f(x) curve (draw as 3D line)
        if (expr.expression.trim().toLowerCase().startsWith('y=')) {
          const yExpr = expr.expression.replace(/^y\s*=\s*/, "");
          const size = 100; // Lowered for performance
          const range = 5;
          const points: [number, number, number][] = [];
          for (let i = 0; i <= size; i++) {
            const x = (i / size) * (2 * range) - range;
            let y = 0;
            try {
              y = evaluateExpression(yExpr, { x, ...effectiveSliderValues });
              if (!isFinite(y)) y = 0;
            } catch { y = 0; }
            points.push([x, y, 0]);
          }
          lines.push({ points, color: expr.color });
          return;
        }
        // Fallback: plot as points (as a single Points object)
        const points: [number, number, number][] = [];
        const size = 20; // Lowered for performance
        const range = 5;
        for (let i = 0; i <= size; i++) {
          for (let j = 0; j <= size; j++) {
            const x = (i / size) * (2 * range) - range;
            const y = (j / size) * (2 * range) - range;
            try {
              const z = evaluateExpression(expr.expression, { x, y, ...effectiveSliderValues });
              if (isFinite(z)) {
                points.push([x, y, z]);
              }
            } catch (e) {
              // Skip invalid points
            }
          }
        }
        if (points.length > 0) {
          plotData.push({ points, color: expr.color });
        }
      } catch (error) {
        console.warn("Error parsing 3D expression:", expr.expression, error);
      }
    });
    return { plotData, meshes, lines };
  }, [expressions, effectiveSliderValues]);

  // Render 3D scene
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid
          args={[20, 20]}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6e6e6e"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
        <group>
          <Line points={[[-10, 0, 0], [10, 0, 0]]} color="red" lineWidth={2} />
          <Line points={[[0, -10, 0], [0, 10, 0]]} color="green" lineWidth={2} />
          <Line points={[[0, 0, -10], [0, 0, 10]]} color="blue" lineWidth={2} />
        </group>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(20, 20, 20)]} />
          <lineBasicMaterial args={[{ color: "#888" }]} />
        </lineSegments>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial args={[{ color: "yellow" }]} />
        </mesh>
        {/* Render mesh from worker if available */}
        {implicitExpr && meshData && meshData.positions && meshData.cells && (
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(meshData.positions.flat()), 3]}
              />
              <bufferAttribute
                attach="index"
                args={[new Uint32Array(meshData.cells.flat()), 1]}
              />
            </bufferGeometry>
            <meshStandardMaterial args={[{ color, opacity: 0.7, transparent: true, side: 2 }]} />
          </mesh>
        )}
        {/* Render advanced meshes for explicit surfaces */}
        {meshes.map((mesh, idx) => (
          <mesh key={idx} geometry={mesh.geometry}>
            <meshStandardMaterial args={[{ color: mesh.color, opacity: 0.7, transparent: true, side: 2 }]} />
          </mesh>
        ))}
        {/* Render explicit y=f(x) as lines */}
        {lines.map((line, idx) => (
          <DreiLine key={idx} points={line.points} color={line.color} lineWidth={2} />
        ))}
        {/* Plot Data (fallback points as a single Points object) */}
        {plotData.map((data, index) => {
          const positions = new Float32Array(data.points.flat());
          return (
            <points key={index}>
              <bufferGeometry>
                <bufferAttribute args={[positions, 3]} />
              </bufferGeometry>
              <pointsMaterial args={[{ color: data.color, size: 0.12, sizeAttenuation: true }]} />
            </points>
          );
        })}
        <OrbitControls enableDamping={true} />
      </Canvas>
    </div>
  );
} 