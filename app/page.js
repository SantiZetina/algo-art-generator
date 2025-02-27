// File: app/page.js
'use client'

import React, { useState, useEffect } from 'react';
import ArtCanvas from '../components/ArtCanvas';
import ControlPanel from '../components/ControlPanel';
import { initialParams, algorithms, palettes } from '../lib/constants';
import ThemeToggle from '../components/ThemeToggle';

export default function AlgorithmicArtGenerator() {
  const [algorithm, setAlgorithm] = useState('perlin');
  const [palette, setPalette] = useState('sunset');
  const [params, setParams] = useState({ ...initialParams });
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [generating, setGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };
  
  const randomizePalette = () => {
    const randomIndex = Math.floor(Math.random() * palettes.length);
    setPalette(palettes[randomIndex].id);
  };
  
  const resetParams = () => {
    setParams({ ...initialParams });
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
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-colors duration-300">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Algorithmic Art Generator</h1>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        
        <div className="md:flex">
          <ArtCanvas 
            algorithm={algorithm}
            palette={palette}
            params={params}
            seed={seed}
            generating={generating}
            setGenerating={setGenerating}
            darkMode={darkMode}
            randomizeSeed={randomizeSeed}
          />
          
          <ControlPanel 
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            palette={palette}
            setPalette={setPalette}
            params={params}
            seed={seed}
            setSeed={setSeed}
            darkMode={darkMode}
            randomizePalette={randomizePalette}
            resetParams={resetParams}
            handleParamChange={handleParamChange}
          />
        </div>
      </div>
    </div>
  );
}