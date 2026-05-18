import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import store from './store';
import theme from './theme';
import { AuthProvider } from './modules/Auth/store/authContext';
import { ThemeContextProvider } from './styles/ThemeContext';
import { BUProvider } from './modules/BusinessUnit/store/buContext';
import { ModeProvider } from './store/ModeContext';
import './styles/global.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <BUProvider>
            <ModeProvider>
              <ThemeContextProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
                </ThemeProvider>
              </ThemeContextProvider>
            </ModeProvider>
          </BUProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
