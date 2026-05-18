import React, { createContext, useContext, useState, useCallback } from 'react';

const ModeContext = createContext(null);

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('appMode') || 'hybrid');

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    localStorage.setItem('appMode', newMode);
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'hybrid' ? 'ai' : 'hybrid';
    setMode(newMode);
    localStorage.setItem('appMode', newMode);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, switchMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
};
