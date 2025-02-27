'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Shuffle, Sliders, Camera } from 'lucide-react';

const algorithms = [
  { id: 'perlin', name: 'Perlin Noise Flow Field' },
  { id: 'cellular', name: 'Cellular Automata' },
  { id: 'fractal', name: 'Fractal Tree' },
  { id: 'voronoi', name: 'Voronoi Diagram' },
  { id: 'mondrian', name: 'Mondrian Style' },
  { id: 'bubble', name: 'Bubble Patterns' }
];

const palettes = [
  { id: 'sunset', name: 'Sunset', colors: ['#FF7B89', '#8A5082', '#6F5F90', '#758EB7', '#A5CAD2'] },
  { id: 'forest', name: 'Forest', colors: ['#2D3047', '#93B7BE', '#E0CA3C', '#A37336', '#6D2E46'] },
  { id: 'neon', name: 'Neon', colors: ['#7400B8', '#6930C3', '#5E60CE', '#5390D9', '#4EA8DE', '#48BFE3', '#56CFE1', '#64DFDF', '#72EFDD', '#80FFDB'] },
  { id: 'monochrome', name: 'Monochrome', colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057', '#343A40', '#212529'] },
  { id: 'retro', name: 'Retro', colors: ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFD6FF', '#E7C6FF', '#C8B6FF', '#B8C0FF', '#BBD0FF'] }
];

const initialParams = {
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

export default function AlgorithmicArtGenerator() {
  const [algorithm, setAlgorithm] = useState('perlin');
  const [palette, setPalette] = useState('sunset');
  const [params, setParams] = useState({ ...initialParams });
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    generateArt();
  }, [algorithm, palette, seed]);
  
  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };
  
  const randomizePalette = () => {
    const randomIndex = Math.floor(Math.random() * palettes.length);
    setPalette(palettes[randomIndex].id);
  };
  
  const resetParams = () => {
    setParams({
      ...initialParams
    });
  };
  
  const handleParamChange = (paramKey, value) => {
    setParams({
      ...params,
      [algorithm]: {
        ...params[algorithm],
        [paramKey]: value
      }
    });
  };
  
  const generateArt = () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    
    // Get selected palette
    const selectedPalette = palettes.find(p => p.id === palette).colors;
    
    // Use pseudorandom number generator with seed
    const random = (() => {
      let s = seed;
      return () => {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
      };
    })();
    
    const randomColor = () => {
      return selectedPalette[Math.floor(random() * selectedPalette.length)];
    };
    
    // Render based on selected algorithm
    switch(algorithm) {
      case 'perlin':
        renderPerlinNoiseFlowField(ctx, width, height, params.perlin, random, selectedPalette);
        break;
      case 'cellular':
        renderCellularAutomata(ctx, width, height, params.cellular, random, selectedPalette);
        break;
      case 'fractal':
        renderFractalTree(ctx, width, height, params.fractal, random, selectedPalette);
        break;
      case 'voronoi':
        renderVoronoi(ctx, width, height, params.voronoi, random, selectedPalette);
        break;
      case 'mondrian':
        renderMondrian(ctx, width, height, params.mondrian, random, selectedPalette);
        break;
      case 'bubble':
        renderBubblePattern(ctx, width, height, params.bubble, random, selectedPalette);
        break;
      default:
        break;
    }
    
    setGenerating(false);
  };
  
  const downloadArt = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `algorithmic-art-${algorithm}-${seed}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  // Perlin Noise Flow Field
  const renderPerlinNoiseFlowField = (ctx, width, height, params, random, palette) => {
    const { scale, particles, speed, complexity, opacity } = params;
    
    // Simplified Perlin noise implementation
    const noise = (x, y) => {
      const X = Math.floor(x);
      const Y = Math.floor(y);
      
      const xf = x - X;
      const yf = y - Y;
      
      const u = fade(xf);
      const v = fade(yf);
      
      const n00 = dotGridGradient(X, Y, xf, yf, random);
      const n01 = dotGridGradient(X, Y + 1, xf, yf - 1, random);
      const n10 = dotGridGradient(X + 1, Y, xf - 1, yf, random);
      const n11 = dotGridGradient(X + 1, Y + 1, xf - 1, yf - 1, random);
      
      const x1 = lerp(n00, n10, u);
      const x2 = lerp(n01, n11, u);
      
      return lerp(x1, x2, v);
    };
    
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + t * (b - a);
    
    const dotGridGradient = (ix, iy, x, y, random) => {
      const r = 2920 * Math.sin(ix * 21942 + iy * 171324 + 8912) * Math.cos(ix * 23157 * iy * 217832 + 9758);
      const angle = r * 2 * Math.PI;
      const gx = Math.cos(angle);
      const gy = Math.sin(angle);
      
      return gx * x + gy * y;
    };
    
    // Create particles
    let particles_array = [];
    for (let i = 0; i < particles; i++) {
      particles_array.push({
        x: random() * width,
        y: random() * height,
        color: palette[Math.floor(random() * palette.length)]
      });
    }
    
    // Setup canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity;
    
    // Draw flow field
    for (let i = 0; i < particles; i++) {
      let p = particles_array[i];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      
      for (let j = 0; j < 50; j++) {
        // Get angle from noise
        const angle = noise(p.x * scale * complexity, p.y * scale * complexity) * Math.PI * 4;
        
        // Update position
        p.x += Math.cos(angle) * speed;
        p.y += Math.sin(angle) * speed;
        
        // Stop if out of bounds
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) break;
        
        ctx.lineTo(p.x, p.y);
      }
      
      ctx.strokeStyle = p.color;
      ctx.stroke();
    }
  };
  
  // Cellular Automata (Conway's Game of Life style)
  const renderCellularAutomata = (ctx, width, height, params, random, palette) => {
    const { cellSize, initialDensity, iterations, birthRule, surviveRule } = params;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    
    // Create initial grid
    let grid = Array(cols).fill().map(() => Array(rows).fill(0));
    
    // Initialize with random cells
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = random() < initialDensity ? 1 : 0;
      }
    }
    
    // Parse rules
    const birthRuleSet = new Set(birthRule.split('').map(Number));
    const surviveRuleSet = new Set(surviveRule.split('').map(Number));
    
    // Run iterations
    for (let iter = 0; iter < iterations; iter++) {
      let newGrid = Array(cols).fill().map(() => Array(rows).fill(0));
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let neighbors = 0;
          
          // Count neighbors (8-way)
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              
              const ni = (i + dx + cols) % cols;
              const nj = (j + dy + rows) % rows;
              neighbors += grid[ni][nj];
            }
          }
          
          // Apply rules
          if (grid[i][j] === 1) {
            newGrid[i][j] = surviveRuleSet.has(neighbors) ? 1 : 0;
          } else {
            newGrid[i][j] = birthRuleSet.has(neighbors) ? 1 : 0;
          }
        }
      }
      
      grid = newGrid;
    }
    
    // Render the final state with colors
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) {
          // Use different colors based on location
          const colorIndex = (i + j) % palette.length;
          ctx.fillStyle = palette[colorIndex];
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
  };
  
  // Fractal Tree
  const renderFractalTree = (ctx, width, height, params, random, palette) => {
    const { branches, depth, angle, reduction, initialSize } = params;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Setup transformation to start from bottom center
    ctx.translate(width / 2, height - 20);
    
    // Generate tree with recursive function
    const drawBranch = (len, level, branchFactor) => {
      if (level <= 0) return;
      
      // Draw trunk/branch
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.strokeStyle = level > depth * 0.4 ? 
                        palette[0] : // Trunk color
                        palette[Math.min(palette.length - 1, Math.floor((depth - level) / depth * palette.length))]; // Branch color
      ctx.lineWidth = Math.max(1, level * 1.5 / depth * 10);
      ctx.stroke();
      
      // Move to end of branch
      ctx.translate(0, -len);
      
      // Draw branches
      for (let i = 0; i < branchFactor; i++) {
        const spreadAngle = angle * (1 + (random() * 0.5 - 0.25));
        const angleOffset = (i - (branchFactor - 1) / 2) * spreadAngle;
        
        ctx.save();
        ctx.rotate(angleOffset * Math.PI / 180);
        drawBranch(len * reduction * (0.9 + random() * 0.2), level - 1, branchFactor);
        ctx.restore();
      }
      
      // Draw leaf at end of branch
      if (level <= 2) {
        ctx.beginPath();
        ctx.arc(0, 0, 3 + random() * 5, 0, Math.PI * 2);
        ctx.fillStyle = palette[palette.length - 1];
        ctx.fill();
      }
      
      // Return to start position
      ctx.translate(0, len);
    };
    
    // Start recursive drawing
    drawBranch(initialSize, depth, branches);
    
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  
  // Voronoi Diagram
  const renderVoronoi = (ctx, width, height, params, random, palette) => {
    const { points, jitter, lineWidth } = params;
    
    // Generate random points
    const sites = [];
    for (let i = 0; i < points; i++) {
      sites.push({
        x: random() * width,
        y: random() * height,
        color: palette[Math.floor(random() * palette.length)]
      });
    }
    
    // For each pixel, find the closest site
    const pixelSize = 4; // For performance
    for (let x = 0; x < width; x += pixelSize) {
      for (let y = 0; y < height; y += pixelSize) {
        let minDist = Number.MAX_VALUE;
        let closestSite = null;
        
        // Find closest site
        for (const site of sites) {
          const dx = x - site.x;
          const dy = y - site.y;
          const dist = Math.sqrt(dx * dx + dy * dy) * (1 + jitter * (random() - 0.5));
          
          if (dist < minDist) {
            minDist = dist;
            closestSite = site;
          }
        }
        
        // Fill pixel with site color
        ctx.fillStyle = closestSite.color;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
    
    // Draw points
    ctx.lineWidth = lineWidth;
    sites.forEach(site => {
      ctx.beginPath();
      ctx.arc(site.x, site.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
    });
  };
  
  // Mondrian Style
  const renderMondrian = (ctx, width, height, params, random, palette) => {
    const { minSize, splitProb, colorProb } = params;
    
    // Start with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Recursive function to split rectangles
    const splitRect = (x, y, w, h, depth) => {
      // Stop if rectangle is too small
      if (w < minSize || h < minSize) return;
      
      // Decide whether to split based on probability
      if (random() > splitProb && depth > 1) {
        // Decide whether to color or leave white
        if (random() < colorProb) {
          ctx.fillStyle = palette[Math.floor(random() * palette.length)];
          ctx.fillRect(x, y, w, h);
        }
        
        // Draw black border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, w, h);
        
        return;
      }
      
      // Decide split direction (horizontal or vertical)
      if (w > h) {
        // Split vertically
        const splitPoint = Math.floor(x + random() * (w - minSize * 2) + minSize);
        splitRect(x, y, splitPoint - x, h, depth + 1);
        splitRect(splitPoint, y, w - (splitPoint - x), h, depth + 1);
      } else {
        // Split horizontally
        const splitPoint = Math.floor(y + random() * (h - minSize * 2) + minSize);
        splitRect(x, y, w, splitPoint - y, depth + 1);
        splitRect(x, splitPoint, w, h - (splitPoint - y), depth + 1);
      }
    };
    
    // Start recursive splitting
    splitRect(0, 0, width, height, 0);
  };
  
  // Bubble Pattern
  const renderBubblePattern = (ctx, width, height, params, random, palette) => {
    const { count, minRadius, maxRadius, overlapping } = params;
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Generate bubbles
    const bubbles = [];
    let attempts = 0;
    const maxAttempts = count * 10;
    
    while (bubbles.length < count && attempts < maxAttempts) {
      attempts++;
      
      // Generate random bubble
      const radius = minRadius + random() * (maxRadius - minRadius);
      const x = radius + random() * (width - radius * 2);
      const y = radius + random() * (height - radius * 2);
      const color = palette[Math.floor(random() * palette.length)];
      
      // Check overlap with existing bubbles
      let overlaps = false;
      for (const bubble of bubbles) {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (radius + bubble.radius) * overlapping) {
          overlaps = true;
          break;
        }
      }
      
      // Add bubble if no overlap or overlap is allowed
      if (!overlaps) {
        bubbles.push({ x, y, radius, color });
      }
    }
    
    // Draw bubbles
    for (const bubble of bubbles) {
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        bubble.x - bubble.radius * 0.3, 
        bubble.y - bubble.radius * 0.3, 
        bubble.radius * 0.1,
        bubble.x, 
        bubble.y, 
        bubble.radius
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, bubble.color + 'dd');
      gradient.addColorStop(1, bubble.color + '77');
      
      // Draw bubble
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add highlight
      ctx.beginPath();
      ctx.arc(
        bubble.x - bubble.radius * 0.3,
        bubble.y - bubble.radius * 0.3,
        bubble.radius * 0.1,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }
  };
  
  // UI Helper function to render parameters
  const renderParams = () => {
    const currentParams = params[algorithm];
    if (!currentParams) return null;
    
    return (
      <div className="space-y-3">
        {Object.keys(currentParams).map(key => {
          // Determine parameter type and range
          let min = 0;
          let max = 100;
          let step = 0.1;
          
          switch(key) {
            case 'scale':
              min = 0.001;
              max = 0.1;
              step = 0.001;
              break;
            case 'opacity':
              min = 0;
              max = 1;
              step = 0.01;
              break;
            case 'particles':
            case 'iterations':
            case 'points':
            case 'count':
              min = 1;
              max = 2000;
              step = 1;
              break;
            case 'cellSize':
              min = 1;
              max = 30;
              step = 1;
              break;
            case 'initialDensity':
            case 'splitProb':
            case 'colorProb':
            case 'overlapping':
              min = 0;
              max = 1;
              step = 0.01;
              break;
            case 'jitter':
              min = 0;
              max = 2;
              step = 0.01;
              break;
            case 'minSize':
              min = 5;
              max = 100;
              step = 1;
              break;
            case 'minRadius':
              min = 1;
              max = 30;
              step = 1;
              break;
            case 'maxRadius':
              min = 10;
              max = 100;
              step = 1;
              break;
            case 'birthRule':
            case 'surviveRule':
              return (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={currentParams[key]}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
              );
            default:
              break;
          }
          
          return (
            <div key={key} className="flex flex-col">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <span className="text-xs font-medium text-gray-500">
                  {typeof currentParams[key] === 'number' ? 
                    currentParams[key].toFixed(step < 0.1 ? 3 : 1) : 
                    currentParams[key]}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentParams[key]}
                onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Canvas area */}
          <div className="md:w-2/3 p-4 relative">
            <div className="bg-white rounded-lg shadow-inner overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={600}
                className="w-full h-auto object-contain"
              />
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="animate-spin text-indigo-600 h-8 w-8 mb-2" />
                    <span className="text-gray-800 font-medium">Generating Art...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={downloadArt}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Download className="h-5 w-5 mr-2" />
                Download
              </button>
              <button
                onClick={randomizeSeed}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Randomize
              </button>
              <button
                onClick={generateArt}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Camera className="h-5 w-5 mr-2" />
                Generate
              </button>
            </div>
          </div>
          
          {/* Controls area */}
          <div className="md:w-1/3 bg-gray-50 p-4 border-l">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Algorithm</h2>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {algorithms.map((algo) => (
                    <option key={algo.id} value={algo.id}>{algo.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gray-900">Color Palette</h2>
                  <button
                    onClick={randomizePalette}
                    className="flex items-center text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                  >
                    <Shuffle className="h-3 w-3 mr-1" />
                    Random
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {palettes.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPalette(p.id)}
                      className={`cursor-pointer p-2 rounded-md ${palette === p.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-100'}`}
                    >
                      <div className="text-xs font-medium mb-1">{p.name}</div>
                      <div className="flex h-6">
                        {p.colors.map((color, i) => (
                          <div
                            key={i}
                            className="flex-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gray-900">Parameters</h2>
                  <button
                    onClick={resetParams}
                    className="flex items-center text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                  >
                    <Sliders className="h-3 w-3 mr-1" />
                    Reset
                  </button>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  {renderParams()}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Seed</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    onClick={randomizeSeed}
                    className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                  >
                    <Shuffle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}