import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../../styles/ThemeContext';
import { handGestureService } from '../../services/handGesture';

const HandGestureToggle = () => {
  const { colors, fonts } = useThemeContext();
  const [enabled, setEnabled] = useState(false);

  const handleToggle = async () => {
    if (enabled) {
      handGestureService.stop();
      setEnabled(false);
      localStorage.setItem('hand_gesture_enabled', 'false');
    } else {
      const success = await handGestureService.init();
      setEnabled(success);
      localStorage.setItem('hand_gesture_enabled', success ? 'true' : 'false');
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={enabled ? 'Disable Hand Gestures' : 'Enable Hand Gestures'}
      style={{
        position: 'fixed',
        bottom: 24,
        left: 160,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        fontFamily: fonts.body,
        fontSize: '11px',
        fontWeight: 600,
        background: enabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)',
        color: enabled ? '#16a34a' : colors.textMuted,
        border: `1px solid ${enabled ? 'rgba(34, 197, 94, 0.3)' : colors.borderLight}`,
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: '14px' }}>✋</span>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: enabled ? '#16a34a' : colors.textMuted }} />
    </button>
  );
};

export default HandGestureToggle;
