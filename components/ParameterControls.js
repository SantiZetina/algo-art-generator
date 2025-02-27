// File: components/ParameterControls.js
import React from 'react';
import { Sliders } from 'lucide-react';

export default function ParameterControls({ algorithm, params, resetParams, handleParamChange }) {
  const currentParams = params[algorithm];
  if (!currentParams) return null;
  
  // Parameter configuration
  const getParamConfig = (key) => {
    let config = { min: 0, max: 100, step: 0.1 };
    
    switch(key) {
      case 'scale':
        config = { min: 0.001, max: 0.1, step: 0.001 };
        break;
      case 'opacity':
        config = { min: 0, max: 1, step: 0.01 };
        break;
      case 'particles':
      case 'iterations':
      case 'points':
      case 'count':
        config = { min: 1, max: 2000, step: 1 };
        break;
      case 'cellSize':
        config = { min: 1, max: 30, step: 1 };
        break;
      case 'initialDensity':
      case 'splitProb':
      case 'colorProb':
      case 'overlapping':
        config = { min: 0, max: 1, step: 0.01 };
        break;
      case 'jitter':
        config = { min: 0, max: 2, step: 0.01 };
        break;
      case 'minSize':
        config = { min: 5, max: 100, step: 1 };
        break;
      case 'minRadius':
        config = { min: 1, max: 30, step: 1 };
        break;
      case 'maxRadius':
        config = { min: 10, max: 100, step: 1 };
        break;
      default:
        break;
    }
    
    return config;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Parameters</h2>
        <button
          onClick={resetParams}
          className="flex items-center text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 
                    dark:hover:bg-gray-600 focus:outline-none transition-colors duration-300"
        >
          <Sliders className="h-3 w-3 mr-1" />
          Reset
        </button>
      </div>
      <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
        <div className="space-y-3">
          {Object.keys(currentParams).map(key => {
            // Special handling for text inputs
            if (key === 'birthRule' || key === 'surviveRule') {
              return (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={currentParams[key]}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 
                              focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm 
                              dark:text-gray-200 transition-colors duration-300"
                  />
                </div>
              );
            }
            
            // Range inputs for other parameters
            const config = getParamConfig(key);
            return (
              <div key={key} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {typeof currentParams[key] === 'number' ? 
                      currentParams[key].toFixed(config.step < 0.1 ? 3 : 1) : 
                      currentParams[key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={currentParams[key]}
                  onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}