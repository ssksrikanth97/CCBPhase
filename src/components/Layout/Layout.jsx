import React from 'react';
import TopNav from '../TopNav/TopNav';
import AIChatBot from '../AIChatBot/AIChatBot';

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
    </>
  );
};

export default Layout;
