// File: lib/constants.js

export const algorithms = [
    { id: 'perlin', name: 'Perlin Noise Flow Field' },
    { id: 'cellular', name: 'Cellular Automata' },
    { id: 'fractal', name: 'Fractal Tree' },
    { id: 'voronoi', name: 'Voronoi Diagram' },
    { id: 'mondrian', name: 'Mondrian Style' },
    { id: 'bubble', name: 'Bubble Patterns' }
  ];
  
  export const palettes = [
    { id: 'sunset', name: 'Sunset', colors: ['#FF7B89', '#8A5082', '#6F5F90', '#758EB7', '#A5CAD2'] },
    { id: 'forest', name: 'Forest', colors: ['#2D3047', '#93B7BE', '#E0CA3C', '#A37336', '#6D2E46'] },
    { id: 'neon', name: 'Neon', colors: ['#7400B8', '#6930C3', '#5E60CE', '#5390D9', '#4EA8DE', '#48BFE3', '#56CFE1', '#64DFDF', '#72EFDD', '#80FFDB'] },
    { id: 'monochrome', name: 'Monochrome', colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057', '#343A40', '#212529'] },
    { id: 'retro', name: 'Retro', colors: ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'] },
    { id: 'pastel', name: 'Pastel', colors: ['#FFD6FF', '#E7C6FF', '#C8B6FF', '#B8C0FF', '#BBD0FF'] }
  ];
  
  export const initialParams = {
    perlin: {
      scale: 0.01,
      particles: 1000,
      speed: 2,
      complexity: 2,
      opacity: 0.6
    },
    cellular: {
      cellSize: 8,
      initialDensity: 0.3,
      iterations: 10,
      birthRule: '3',
      surviveRule: '23'
    },
    fractal: {
      branches: 3,
      depth: 9,
      angle: 15,
      reduction: 0.7,
      initialSize: 120
    },
    voronoi: {
      points: 30,
      jitter: 0.8,
      lineWidth: 1.5
    },
    mondrian: {
      minSize: 30,
      splitProb: 0.5,
      colorProb: 0.3
    },
    bubble: {
      count: 150,
      minRadius: 5,
      maxRadius: 50,
      overlapping: 0.7
    }
  };