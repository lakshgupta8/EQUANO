import * as isosurface from 'isosurface';

export type MeshWorkerRequest = {
  type: 'marchingCubes';
  size: number;
  range: number;
  left: string;
  right: string;
  effectiveSliderValues: Record<string, number>;
};

export type MeshWorkerResponse = {
  type: 'mesh';
  meshData: any;
};

const ctx: Worker = self as any;

ctx.onmessage = function (e: MessageEvent<MeshWorkerRequest>) {
  const { type, size, range, left, right, effectiveSliderValues } = e.data;
  if (type === 'marchingCubes') {
    // TODO: Integrate evaluateExpression logic here
    const field = (x: number, y: number, z: number) => {
      // Placeholder: sphere equation
      return x * x + y * y + z * z - 1;
    };
    const meshData = isosurface.marchingCubes([size, size, size], (i, j, k) => {
      const x = (i / (size - 1)) * (2 * range) - range;
      const y = (j / (size - 1)) * (2 * range) - range;
      const z = (k / (size - 1)) * (2 * range) - range;
      return field(x, y, z);
    }, 0);
    ctx.postMessage({ type: 'mesh', meshData });
  }
}; 