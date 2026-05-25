import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../../styles/ThemeContext';
import { handGestureService } from '../../services/handGesture';

const GESTURE_LABELS = {
  swipe_left: { icon: '👈', label: 'Swipe Left', action: 'Going back...' },
  swipe_right: { icon: '👉', label: 'Swipe Right', action: 'Next page...' },
  fist: { icon: '✊', label: 'Fist', action: 'Dashboard...' },
  pinch: { icon: '🤏', label: 'Pinch', action: 'Activating...' },
  open: { icon: '✋', label: 'Open Palm', action: 'Tracking...' },
  point: { icon: '☝️', label: 'Pointing', action: 'Selecting...' },
};

const GestureToast = () => {
  const { fonts } = useThemeContext();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleGesture = (gesture) => {
      const info = GESTURE_LABELS[gesture];
      if (info && gesture !== 'open') {
        setToast(info);
        setTimeout(() => setToast(null), 1500);
      }
    };

    handGestureService.addListener(handleGesture);

    return () => {
      handGestureService.removeListener(handleGesture);
    };
  }, []);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 20px',
      borderRadius: 12,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'fadeSlideIn 0.2s ease',
    }}>
      <span style={{ fontSize: '20px' }}>{toast.icon}</span>
      <div>
        <div style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: '#fff' }}>{toast.label}</div>
        <div style={{ fontFamily: fonts.body, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{toast.action}</div>
      </div>
    </div>
  );
};

export default GestureToast;
