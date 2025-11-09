import React, { createContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, fallback to system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches   // detects if user has dark mode enabled system-wide[ .matches returns true if dark mode is on, false otherwise ]
      ? 'dark' 
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    // console.log('document: ', document);
    // console.log('root: ', root);

    
    if (theme === 'dark') {
      root.classList.add('dark'); // add dark class to html tag or root (inspect and check)
    } else {
      root.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;