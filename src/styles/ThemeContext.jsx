import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { retroTheme, trendyTheme, allThemes } from './themes';

const ThemeContext = createContext(null);

export const ThemeContextProvider = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState(
    () => localStorage.getItem('activeTheme') || 'retro'
  );

  const activeTheme = useMemo(
    () => allThemes.find((t) => t.id === activeThemeId) || retroTheme,
    [activeThemeId]
  );

  const setTheme = useCallback((themeId) => {
    setActiveThemeId(themeId);
    localStorage.setItem('activeTheme', themeId);
  }, []);

  // Apply theme as CSS custom properties on :root
  useEffect(() => {
    const root = document.documentElement;
    const { colors, fonts, shadows } = activeTheme;

    // Colors
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-surface', colors.bgSurface);
    root.style.setProperty('--bg-dark', colors.bgDark);
    root.style.setProperty('--bg-warm', colors.bgWarm);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--text-on-dark', colors.textOnDark);
    root.style.setProperty('--accent-primary', colors.accentPrimary);
    root.style.setProperty('--accent-primary-hover', colors.accentPrimaryHover);
    root.style.setProperty('--accent-secondary', colors.accentSecondary);
    root.style.setProperty('--accent-secondary-dark', colors.accentSecondaryDark);
    root.style.setProperty('--border-light', colors.borderLight);
    root.style.setProperty('--border-dark', colors.borderDark);
    root.style.setProperty('--color-muted-tan', colors.mutedTan);

    // Fonts
    root.style.setProperty('--font-heading', fonts.heading);
    root.style.setProperty('--font-body', fonts.body);

    // Font sizes (theme-specific)
    const sizes = activeTheme.fontSizes;
    if (sizes) {
      root.style.setProperty('--text-xs', sizes.xs);
      root.style.setProperty('--text-sm', sizes.sm);
      root.style.setProperty('--text-base', sizes.base);
      root.style.setProperty('--text-md', sizes.md);
      root.style.setProperty('--text-lg', sizes.lg);
      root.style.setProperty('--text-xl', sizes.xl);
      root.style.setProperty('--text-2xl', sizes['2xl']);
      root.style.setProperty('--text-3xl', sizes['3xl']);
      root.style.setProperty('--text-4xl', sizes['4xl']);
    }

    // Shadows
    root.style.setProperty('--shadow-sm', shadows.sm);
    root.style.setProperty('--shadow-md', shadows.md);
    root.style.setProperty('--shadow-lg', shadows.lg);

    // Button gradient
    root.style.setProperty('--button-gradient', activeTheme.buttonGradient || colors.accentPrimary);

    // Action button variables
    const actions = activeTheme.actions;
    if (actions) {
      root.style.setProperty('--action-primary-bg', actions.primary.bg);
      root.style.setProperty('--action-primary-color', actions.primary.color);
      root.style.setProperty('--action-primary-hover', actions.primary.hoverBg);
      root.style.setProperty('--action-secondary-bg', actions.secondary.bg);
      root.style.setProperty('--action-secondary-color', actions.secondary.color);
      root.style.setProperty('--action-secondary-border', actions.secondary.border);
      root.style.setProperty('--action-secondary-hover', actions.secondary.hoverBg);
      root.style.setProperty('--action-danger-bg', actions.danger.bg);
      root.style.setProperty('--action-danger-color', actions.danger.color);
      root.style.setProperty('--action-danger-hover', actions.danger.hoverBg);
      root.style.setProperty('--action-ghost-bg', actions.ghost.bg);
      root.style.setProperty('--action-ghost-color', actions.ghost.color);
      root.style.setProperty('--action-ghost-border', actions.ghost.border);
      root.style.setProperty('--action-ghost-hover', actions.ghost.hoverBg);
    }

    // Body background
    document.body.style.backgroundColor = colors.bgPrimary;
  }, [activeTheme]);

  // Expose for JS access where needed
  const colors = useMemo(() => ({
    ...activeTheme.palette,
    ...activeTheme.colors,
  }), [activeTheme]);

  return (
    <ThemeContext.Provider value={{
      activeTheme,
      colors,
      fonts: activeTheme.fonts,
      shadows: activeTheme.shadows,
      buttonGradient: activeTheme.buttonGradient,
      actions: activeTheme.actions,
      setTheme,
      allThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};
