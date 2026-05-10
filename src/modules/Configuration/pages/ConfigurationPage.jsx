import React, { useEffect } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const ConfigurationPage = () => {
  const { activeTheme, colors, fonts, shadows, buttonGradient, setTheme, allThemes } = useThemeContext();

  useEffect(() => {
    document.title = 'EV Phase - Configuration';
  }, []);

  const styles = {
    root: { maxWidth: 900 },
    pageTitle: {
      fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700,
      color: colors.textPrimary, marginBottom: 4,
    },
    pageSubtitle: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)',
      color: colors.textMuted, marginBottom: 32,
    },
    sectionTitle: {
      fontFamily: fonts.body, fontSize: 'var(--text-md)', fontWeight: 600,
      color: colors.textPrimary, marginBottom: 16,
    },
    themeGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20,
    },
    themeCard: (theme, isActive) => ({
      borderRadius: 12, padding: 24,
      border: `2px solid ${isActive ? colors.accentPrimary : colors.borderLight}`,
      backgroundColor: theme.colors.bgSurface,
      cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: isActive ? `0 0 0 3px ${rgba(colors.accentPrimary, 0.15)}` : 'none',
    }),
    themeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    themeName: (theme) => ({
      fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 600,
      color: theme.colors.textPrimary,
    }),
    badge: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 10px', borderRadius: 20,
      backgroundColor: rgba(colors.accentPrimary, 0.1), color: colors.accentPrimary,
    },
    previewBar: { height: 6, borderRadius: 3, marginBottom: 12, display: 'flex', overflow: 'hidden' },
    description: (theme) => ({
      fontFamily: fonts.body, fontSize: 'var(--text-base)',
      color: theme.colors.textMuted, marginBottom: 16, lineHeight: 1.5,
    }),
    swatches: { display: 'flex', gap: 8, marginBottom: 16 },
    swatch: (color) => ({
      width: 32, height: 32, borderRadius: 8,
      backgroundColor: color, border: '2px solid rgba(128,128,128,0.2)',
    }),
    applyBtn: (isActive) => ({
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 600,
      padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
      background: isActive
        ? colors.accentSecondary
        : (buttonGradient || colors.accentPrimary),
      color: '#ffffff',
    }),
    fontPreview: {
      backgroundColor: rgba(colors.borderLight, 0.5),
      borderRadius: 8,
      padding: '12px 14px',
      marginBottom: 16,
    },
    fontRow: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      marginBottom: 6,
    },
    fontLabel: {
      fontFamily: fonts.body,
      fontSize: 'var(--text-xs)',
      color: colors.textMuted,
      minWidth: 60,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  return (
    <div style={styles.root}>
      <h1 style={styles.pageTitle}>Configuration</h1>
      <p style={styles.pageSubtitle}>Manage application settings and appearance</p>

      <h2 style={styles.sectionTitle}>Theme Builder</h2>
      <div style={styles.themeGrid}>
        {allThemes.map((theme) => {
          const isActive = theme.id === activeTheme.id;
          return (
            <div
              key={theme.id}
              style={styles.themeCard(theme, isActive)}
              onClick={() => setTheme(theme.id)}
            >
              <div style={styles.themeHeader}>
                <span style={styles.themeName(theme)}>{theme.name}</span>
                {isActive && <span style={styles.badge}>Active</span>}
              </div>

              <div style={styles.previewBar}>
                <div style={{ flex: 1, backgroundColor: theme.colors.bgDark }} />
                <div style={{ flex: 1, backgroundColor: theme.colors.accentPrimary }} />
                <div style={{ flex: 1, backgroundColor: theme.colors.accentSecondary }} />
                <div style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }} />
              </div>

              <p style={styles.description(theme)}>{theme.description}</p>

              <div style={styles.fontPreview}>
                <div style={styles.fontRow}>
                  <span style={styles.fontLabel}>Heading:</span>
                  <span style={{ fontFamily: theme.fonts.heading, fontSize: 'var(--text-lg)', color: theme.colors.textPrimary }}>
                    {theme.fonts.heading.split(',')[0].replace(/'/g, '')}
                  </span>
                </div>
                <div style={styles.fontRow}>
                  <span style={styles.fontLabel}>Body:</span>
                  <span style={{ fontFamily: theme.fonts.body, fontSize: 'var(--text-md)', color: theme.colors.textPrimary }}>
                    {theme.fonts.body.split(',')[0].replace(/'/g, '')}
                  </span>
                </div>
              </div>

              <div style={styles.swatches}>
                <div style={styles.swatch(theme.colors.bgDark)} />
                <div style={styles.swatch(theme.colors.accentPrimary)} />
                <div style={styles.swatch(theme.colors.accentPrimaryHover)} />
                <div style={styles.swatch(theme.colors.accentSecondary)} />
                <div style={styles.swatch(theme.colors.accentSecondaryDark)} />
                <div style={styles.swatch(theme.colors.bgPrimary)} />
              </div>

              <button
                style={styles.applyBtn(isActive)}
                onClick={(e) => { e.stopPropagation(); setTheme(theme.id); }}
              >
                {isActive ? '✓ Applied' : 'Apply Theme'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigurationPage;
