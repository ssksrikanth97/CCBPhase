import React from 'react';
import TopNav from '../TopNav/TopNav';
import AIChatBot from '../AIChatBot/AIChatBot';
import ModeSwitch from '../ModeSwitch/ModeSwitch';

const Layout = ({ children }) => {
  return (
    <>
      <div className="layout">
        <TopNav />
        <main className="layout__content" style={{ paddingTop: 'var(--space-2xl)' }}>
          {children}
        </main>
      </div>
      <AIChatBot />
      <ModeSwitch />
    </>
  );
};

export default Layout;
