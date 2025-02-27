// File: components/ThemeToggle.js
import React from 'react';

export default function ThemeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}