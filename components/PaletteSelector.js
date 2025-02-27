// File: components/PaletteSelector.js
import React from 'react';
import { Shuffle } from 'lucide-react';
import { palettes } from '../lib/constants';

export default function PaletteSelector({ palette, setPalette, randomizePalette }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Color Palette</h2>
        <button
          onClick={randomizePalette}
          className="flex items-center text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 
                    dark:hover:bg-gray-600 focus:outline-none transition-colors duration-300"
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
            className={`cursor-pointer p-2 rounded-md ${palette === p.id ? 
              'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 
              'hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-300`}
          >
            <div className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">{p.name}</div>
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
  );
}