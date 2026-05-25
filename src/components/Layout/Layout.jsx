import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopNav from '../TopNav/TopNav';
import AIChatBot from '../AIChatBot/AIChatBot';
import ModeSwitch from '../ModeSwitch/ModeSwitch';
import { useAuth } from '../../modules/Auth/store/authContext';
import { handGestureService } from '../../services/handGesture';
import HandGestureToggle from '../HandGestureToggle/HandGestureToggle';
import GestureToast from '../GestureToast/GestureToast';

const Layout = ({ children }) => {
  const history = useHistory();
  const { logout } = useAuth();

  useEffect(() => {
    let active = true;

    const handleGesture = (gesture) => {
      if (!active) return;
      if (gesture === 'swipe_left') {
        const prevPage = handGestureService.getPrevPage();
        history.push(prevPage);
      } else if (gesture === 'swipe_right') {
        const page = handGestureService.getNextPage();
        history.push(page);
      } else if (gesture === 'fist') {
        history.push('/dashboard');
      } else if (gesture === 'pinch') {
        logout();
        history.push('/login');
      }
    };

    handGestureService.addListener(handleGesture);

    return () => {
      active = false;
      handGestureService.removeListener(handleGesture);
    };
  }, []);

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
      <HandGestureToggle />
      <GestureToast />
    </>
  );
};

export default Layout;
