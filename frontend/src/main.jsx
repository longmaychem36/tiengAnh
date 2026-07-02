import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ConfirmExitProvider from './components/common/ConfirmExitProvider';
import App from './App';
import './index.css';
import './App.css';
import './styles/learningSession.css';
import './styles/speakingConversation.css';
import './styles/admin.css';

const TOAST_DURATION_MS = 3000;
const TOAST_REMOVE_DELAY_MS = 400;

function ManagedToaster() {
  const { toasts } = useToasterStore();
  const timersRef = React.useRef(new Map());

  React.useEffect(() => {
    const visibleIds = new Set(toasts.map((item) => item.id));
    const seenMessages = new Set();

    for (const [id, timers] of timersRef.current) {
      if (!visibleIds.has(id)) {
        clearTimeout(timers.dismiss);
        clearTimeout(timers.remove);
        timersRef.current.delete(id);
      }
    }

    toasts.forEach((item) => {
      const messageKey = typeof item.message === 'string'
        ? `${item.type}:${item.message}`
        : null;

      if (messageKey && seenMessages.has(messageKey)) {
        const timers = timersRef.current.get(item.id);
        if (timers) {
          clearTimeout(timers.dismiss);
          clearTimeout(timers.remove);
          timersRef.current.delete(item.id);
        }
        toast.remove(item.id);
        return;
      }
      if (messageKey) seenMessages.add(messageKey);

      if (timersRef.current.has(item.id) || item.duration === Infinity) return;

      const duration = Number.isFinite(item.duration) ? item.duration : TOAST_DURATION_MS;
      const elapsed = Date.now() - item.createdAt;
      const remaining = Math.max(0, duration - elapsed);
      const dismissTimer = setTimeout(() => toast.dismiss(item.id), remaining);
      const removeTimer = setTimeout(() => {
        toast.remove(item.id);
        timersRef.current.delete(item.id);
      }, remaining + TOAST_REMOVE_DELAY_MS);

      timersRef.current.set(item.id, { dismiss: dismissTimer, remove: removeTimer });
    });
  }, [toasts]);

  React.useEffect(() => () => {
    timersRef.current.forEach((timers) => {
      clearTimeout(timers.dismiss);
      clearTimeout(timers.remove);
    });
    timersRef.current.clear();
  }, []);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: TOAST_DURATION_MS,
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
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfirmExitProvider>
          <App />
          <ManagedToaster />
        </ConfirmExitProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
