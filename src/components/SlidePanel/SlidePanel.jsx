import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import './SlidePanel.css';

const SlidePanel = ({ open, onClose, onExpand, title, children }) => {
  return (
    <>
      {open && <div className="slide-panel__overlay" onClick={onClose} />}
      <div className={`slide-panel ${open ? 'slide-panel--open' : ''}`}>
        <div className="slide-panel__header">
          <h2 className="slide-panel__title">{title}</h2>
          <div className="slide-panel__header-actions">
            {onExpand && (
              <button className="slide-panel__expand" onClick={onExpand} aria-label="Expand to full page">
                <FullscreenIcon style={{ fontSize: 18 }} />
              </button>
            )}
            <button className="slide-panel__close" onClick={onClose} aria-label="Close panel">
              <CloseIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
        <div className="slide-panel__body">
          {children}
        </div>
      </div>
    </>
  );
};

export default SlidePanel;
