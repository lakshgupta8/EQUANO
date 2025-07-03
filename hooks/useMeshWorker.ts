import { useEffect, useRef, useState } from 'react';

export function useMeshWorker(
  left: string,
  right: string,
  size: number,
  range: number,
  effectiveSliderValues: Record<string, number>
) {
  const [meshData, setMeshData] = useState<any>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Use native Web Worker
    const worker = new Worker(
      new URL('../workers/meshWorker.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'mesh') {
        setMeshData(e.data.meshData);
      }
    };

    worker.postMessage({
      type: 'marchingCubes',
      left,
      right,
      size,
      range,
      effectiveSliderValues,
    });

    return () => {
      worker.terminate();
    };
  }, [left, right, size, range, effectiveSliderValues]);

  return meshData;
} 