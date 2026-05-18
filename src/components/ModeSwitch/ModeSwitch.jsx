import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMode } from '../../store/ModeContext';
import { useThemeContext } from '../../styles/ThemeContext';

const ModeSwitch = () => {
  const { mode, toggleMode } = useMode();
  const { colors, fonts } = useThemeContext();
  const history = useHistory();

  const handleToggle = () => {
    toggleMode();
    if (mode === 'hybrid') {
      history.push('/explore');
    } else {
      history.push('/dashboard');
    }
  };

  const isAI = mode === 'ai';

  return (
    <button
      onClick={handleToggle}
      title={isAI ? 'Switch to Hybrid Mode' : 'Switch to AI Mode'}
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 24,
        border: 'none',
        cursor: 'pointer',
        fontFamily: fonts.body,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.3px',
        transition: 'all 0.3s ease',
        background: isAI
          ? 'linear-gradient(135deg, #0a1628, #1a2a4a)'
          : `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
        color: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      <span style={{
        width: 28,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        position: 'relative',
        display: 'inline-block',
      }}>
        <span style={{
          position: 'absolute',
          top: 2,
          left: isAI ? 14 : 2,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.3s ease',
        }} />
      </span>
      {isAI ? 'AI Mode' : 'Hybrid'}
    </button>
  );
};

export default ModeSwitch;
