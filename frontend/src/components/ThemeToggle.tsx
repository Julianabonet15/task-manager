'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-transform duration-300 ${isDark ? 'translate-x-7 bg-gray-900' : 'translate-x-0 bg-white'} shadow`}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}