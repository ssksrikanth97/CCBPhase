import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import Aurora from '../../../components/Aurora/Aurora';
import DotField from '../../../components/DotField/DotField';

const InvitePage = () => {
  const history = useHistory();
  const { colors, activeTheme } = useThemeContext();
  const [inviteCode, setInviteCode] = useState('');

  const handleAccess = (e) => {
    e.preventDefault();
    if (inviteCode.trim()) history.push('/login');
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

        <div className="auth-page__card" style={{ maxWidth: 520 }}>
          <h1 className="auth-page__title">Invite-Only Access</h1>
          <p className="auth-page__subtitle">
            Currently EV Phase is invite-only in <strong style={{ color: 'var(--text-primary)' }}>India</strong>
          </p>

          <form onSubmit={handleAccess}>
            <div className="auth-page__field-group">
              <div className="auth-page__label-row">
                <label className="auth-page__label">Enter your invite code</label>
              </div>
              <div className="auth-page__input-wrapper">
                <input
                  className="auth-page__input"
                  type="text"
                  placeholder="Enter invite code..."
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  style={{ textAlign: 'center', borderRadius: 'var(--radius-pill)', padding: '16px 20px' }}
                  aria-label="Invite code"
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-page__submit-btn"
              style={{ borderRadius: 'var(--radius-pill)', padding: 16, opacity: inviteCode.trim() ? 1 : 0.6 }}
              disabled={!inviteCode.trim()}
            >
              Access Blink
            </button>
          </form>

          <p className="auth-page__footer-text" style={{ marginTop: 'var(--space-2xl)' }}>
            Don't have an invite code? Contact someone who uses EV Phase to get one.
          </p>
          <p className="auth-page__footer-text" style={{ marginTop: 'var(--space-sm)' }}>
            Already have an account?{' '}
            <a className="auth-page__link" onClick={() => history.push('/login')}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
