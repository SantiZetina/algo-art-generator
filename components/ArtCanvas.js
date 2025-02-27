// File: components/ArtCanvas.js
import React, { useEffect, useRef } from 'react';
import { Download, RefreshCw, Shuffle, Camera } from 'lucide-react';
import { palettes } from '../lib/constants';
import { renderAlgorithm } from '../lib/renderAlgorithms';

export default function ArtCanvas({
  algorithm,
  palette,
  params,
  seed,
  generating,
  setGenerating,
  darkMode,
  randomizeSeed
}) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    generateArt();
  }, [algorithm, palette, seed]);
  
  const generateArt = () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = darkMode ? '#1a1a1a' : '#fff';
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
    
    // Render based on selected algorithm
    renderAlgorithm(algorithm, ctx, width, height, params[algorithm], random, selectedPalette, darkMode);
    
    setGenerating(false);
  };
  
  const downloadArt = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `algorithmic-art-${algorithm}-${seed}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  return (
    <div className="md:w-2/3 p-4 relative">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-inner overflow-hidden transition-colors duration-300">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600}
          className="w-full h-auto object-contain"
        />
        {generating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 transition-colors duration-300">
            <div className="flex flex-col items-center">
              <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400 h-8 w-8 mb-2" />
              <span className="text-gray-800 dark:text-gray-200 font-medium">Generating Art...</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={downloadArt}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
        >
          <Download className="h-5 w-5 mr-2" />
          Download
        </button>
        <button
          onClick={randomizeSeed}
          className="flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-md shadow hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
        >
          <Shuffle className="h-5 w-5 mr-2" />
          Randomize
        </button>
        <button
          onClick={generateArt}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
        >
          <Camera className="h-5 w-5 mr-2" />
          Generate
        </button>
      </div>
    </div>
  );
}