import React from 'react';
import TopNav from '../TopNav/TopNav';
import Sidebar from '../Sidebar/Sidebar';
import AIChatBot from '../AIChatBot/AIChatBot';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <TopNav />
      <div className="layout__body">
        <Sidebar />
        <main className="layout__content">{children}</main>
      </div>
      <AIChatBot />
    </div>
  );
};

export default Layout;
