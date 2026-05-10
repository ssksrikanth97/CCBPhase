import React, { useEffect } from 'react';
import { useThemeContext } from '../../styles/ThemeContext';
import { useBU } from '../BusinessUnit/store/buContext';

const PlaceholderPage = ({ title, description }) => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();

  useEffect(() => {
    document.title = `EV Phase - ${title}`;
  }, [title]);

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>
        {title}
      </h1>
      <p style={{ fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textMuted, marginBottom: 32 }}>
        {description} — {activeBU.name}
      </p>
      <div style={{
        backgroundColor: colors.bgSurface, borderRadius: 12, padding: 40,
        border: `1.5px solid ${colors.borderLight}`, textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
        <p style={{ fontFamily: fonts.body, fontSize: 'var(--text-md)', color: colors.textMuted }}>
          This module is under development for <strong>{activeBU.name}</strong>
        </p>
        <p style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, marginTop: 8 }}>
          Services: {activeBU.services.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
