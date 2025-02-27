// File: components/ControlPanel.js
import React from 'react';
import { Shuffle, Sliders } from 'lucide-react';
import { algorithms, palettes } from '../lib/constants';
import AlgorithmSelector from './AlgorithmSelector';
import PaletteSelector from './PaletteSelector';
import ParameterControls from './ParameterControls';
import SeedControl from './SeedControl';

export default function ControlPanel({
  algorithm,
  setAlgorithm,
  palette,
  setPalette,
  params,
  seed,
  setSeed,
  darkMode,
  randomizePalette,
  resetParams,
  handleParamChange
}) {
  return (
    <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800 p-4 border-l border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="space-y-6">
        <AlgorithmSelector 
          algorithm={algorithm} 
          setAlgorithm={setAlgorithm} 
        />
        
        <PaletteSelector 
          palette={palette}
          setPalette={setPalette}
          randomizePalette={randomizePalette}
        />
        
        <ParameterControls 
          algorithm={algorithm}
          params={params}
          resetParams={resetParams}
          handleParamChange={handleParamChange}
        />
        
        <SeedControl 
          seed={seed}
          setSeed={setSeed}
        />
      </div>
    </div>
  );
}