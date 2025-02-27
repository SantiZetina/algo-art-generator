// File: components/SeedControl.js
import React from 'react';
import { Shuffle } from 'lucide-react';

export default function SeedControl({ seed, setSeed }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Seed</h2>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={seed}
          onChange={(e) => setSeed(parseInt(e.target.value))}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                    dark:focus:ring-indigo-400 transition-colors duration-300"
        />
        <button
          onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                    rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 
                    focus:outline-none transition-colors duration-300"
          aria-label="Randomize seed"
        >
          <Shuffle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}