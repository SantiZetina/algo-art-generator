// File: components/AlgorithmSelector.js
import React from 'react';
import { algorithms } from '../lib/constants';

export default function AlgorithmSelector({ algorithm, setAlgorithm }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Algorithm</h2>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 
                  text-gray-900 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                  dark:focus:ring-indigo-400 transition-colors duration-300"
      >
        {algorithms.map((algo) => (
          <option key={algo.id} value={algo.id}>{algo.name}</option>
        ))}
      </select>
    </div>
  );
}