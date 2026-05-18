import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useAuth, MOCK_USERS } from '../store/authContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { useMode } from '../../../store/ModeContext';
import Aurora from '../../../components/Aurora/Aurora';
import DotField from '../../../components/DotField/DotField';
import FaceScanner from '../../../components/FaceScanner/FaceScanner';

const LoginPage = () => {
  const history = useHistory();
  const { login } = useAuth();
  const { switchRole } = useBU();
  const { colors, activeTheme } = useThemeContext();
  const { switchMode } = useMode();
  const [scannerActive, setScannerActive] = useState(false);

  const handleScanComplete = () => {
    const superAdmin = MOCK_USERS.find((u) => u.role === 'superAdmin');
    login(superAdmin.email, superAdmin.password);
    switchRole('superAdmin');
    switchMode('ai');
    history.push('/explore');
  };

  const handleStartScan = () => {
    setScannerActive(true);
  };

  const logoColor = activeTheme.id === 'trendy' ? '#ffffff' : 'var(--accent-primary)';
  const logoTextColor = activeTheme.id === 'trendy' ? '#ffffff' : 'var(--text-primary)';

  return (
    <div className="auth-page">
      {activeTheme.id === 'trendy' && (
        <Aurora colorStops={["#7cff67", "#22d3ee", "#2563eb"]} blend={0.5} amplitude={1.0} speed={1} />
      )}
      {activeTheme.id === 'retro' && (
        <DotField color={colors.accentPrimary} bgColor={colors.bgPrimary} speed={0.5} />
      )}

      <div className="auth-page__content">
        <div className="auth-page__logo">
          <span className="auth-page__logo-icon" style={{ color: logoColor }}>△</span>
          <span className="auth-page__logo-text" style={{ color: logoTextColor }}>EV Phase</span>
        </div>

        <div className="auth-page__card">
          <h1 className="auth-page__title">Welcome back</h1>
          <p className="auth-page__subtitle">Authenticate with Face ID to continue</p>

          {scannerActive ? (
            <FaceScanner active={scannerActive} onScanComplete={handleScanComplete} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
              <button
                onClick={handleStartScan}
                style={{
                  width: 120, height: 120, borderRadius: '50%',
                  border: '2px solid var(--border-light)',
                  backgroundColor: 'var(--bg-primary)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3rem', transition: 'all 0.3s ease',
                }}
                aria-label="Login with Face ID"
              >
                🔐
              </button>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
                color: 'var(--text-muted)', marginTop: 16, textAlign: 'center',
              }}>
                Tap to scan with Face ID
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)', marginTop: 6,
              }}>
                Super Admin • Camera required
              </p>
            </div>
          )}

          <div className="auth-page__divider">
            <div className="auth-page__divider-line" />
            <span className="auth-page__divider-text">or</span>
            <div className="auth-page__divider-line" />
          </div>

          <button className="auth-page__google-btn" onClick={handleStartScan}>
            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-page__footer-text">
            Don't have an account?{' '}
            <a className="auth-page__link" onClick={() => history.push('/invite')}>Sign up</a>
          </p>
        </div>

        <p className="auth-page__terms">
          By continuing, you agree to our <a className="auth-page__terms-link" href="#terms">Terms of Service</a> and <a className="auth-page__terms-link" href="#privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
