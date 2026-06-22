import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ConfirmExitProvider from './components/common/ConfirmExitProvider';
import App from './App';
import './index.css';
import './App.css';
import './styles/learningSession.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfirmExitProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '14px'
              },
              success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
              error: { iconTheme: { primary: 'var(--color-error)', secondary: '#fff' } }
            }}
          />
        </ConfirmExitProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
