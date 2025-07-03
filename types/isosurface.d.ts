declare module 'isosurface' {
  export function marchingCubes(
    dims: [number, number, number],
    field: (i: number, j: number, k: number) => number,
    level?: number
  ): {
    positions: [number, number, number][];
    cells: [number, number, number][];
  };
} 