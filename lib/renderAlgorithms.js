// File: lib/renderAlgorithms.js

export function renderAlgorithm(algorithm, ctx, width, height, params, random, palette, darkMode) {
    switch(algorithm) {
      case 'perlin':
        renderPerlinNoiseFlowField(ctx, width, height, params, random, palette, darkMode);
        break;
      case 'cellular':
        renderCellularAutomata(ctx, width, height, params, random, palette, darkMode);
        break;
      case 'fractal':
        renderFractalTree(ctx, width, height, params, random, palette, darkMode);
        break;
      case 'voronoi':
        renderVoronoi(ctx, width, height, params, random, palette, darkMode);
        break;
      case 'mondrian':
        renderMondrian(ctx, width, height, params, random, palette, darkMode);
        break;
      case 'bubble':
        renderBubblePattern(ctx, width, height, params, random, palette, darkMode);
        break;
      default:
        break;
    }
  }
  
  // Perlin Noise Flow Field
  export function renderPerlinNoiseFlowField(ctx, width, height, params, random, palette, darkMode) {
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
    
    const dotGridGradient = (ix, iy, x, y) => {
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
    ctx.fillStyle = darkMode ? '#1a1a1a' : 'white';
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
  }
  
  // Cellular Automata (Conway's Game of Life style)
  export function renderCellularAutomata(ctx, width, height, params, random, palette, darkMode) {
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
  }
  
  // Fractal Tree
  export function renderFractalTree(ctx, width, height, params, random, palette, darkMode) {
    const { branches, depth, angle, reduction, initialSize } = params;
    
    ctx.fillStyle = darkMode ? '#1a1a1a' : 'white';
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
  }
  
  // Voronoi Diagram
  export function renderVoronoi(ctx, width, height, params, random, palette, darkMode) {
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
      ctx.fillStyle = darkMode ? 'white' : 'black';
      ctx.fill();
    });
  }
  
  // Mondrian Style
  export function renderMondrian(ctx, width, height, params, random, palette, darkMode) {
    const { minSize, splitProb, colorProb } = params;
    
    // Start with white background
    ctx.fillStyle = darkMode ? '#1a1a1a' : 'white';
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
        ctx.strokeStyle = darkMode ? 'white' : 'black';
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
  }
  
  // Bubble Pattern
  export function renderBubblePattern(ctx, width, height, params, random, palette, darkMode) {
    const { count, minRadius, maxRadius, overlapping } = params;
    
    // White background
    ctx.fillStyle = darkMode ? '#1a1a1a' : 'white';
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
  }