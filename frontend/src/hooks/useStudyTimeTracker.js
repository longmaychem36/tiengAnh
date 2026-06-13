import { useEffect, useRef } from 'react';
import { studyTimeApi } from '../api/studyTimeApi';

const HEARTBEAT_MS = 30000;
const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
const MAX_REPORT_SECONDS = 60;

const ACTIVITY_EVENTS = [
  'click',
  'keydown',
  'mousedown',
  'mousemove',
  'pointerdown',
  'scroll',
  'touchstart',
  'wheel'
];

function isPageVisible(ignoreVisibility = false) {
  return ignoreVisibility || document.visibilityState === 'visible';
}

function isWindowFocused(ignoreFocus = false) {
  return ignoreFocus || document.hasFocus();
}

export function useStudyTimeTracker(enabled = true) {
  const lastInteractionAtRef = useRef(Date.now());
  const lastCountedAtRef = useRef(Date.now());
  const sendingRef = useRef(false);
  const pendingSecondsRef = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const reportActiveSeconds = ({ ignoreFocus = false, ignoreVisibility = false, keepalive = false } = {}) => {
      const now = Date.now();
      const recentlyActive = now - lastInteractionAtRef.current <= IDLE_TIMEOUT_MS;
      const canCount = isPageVisible(ignoreVisibility) && isWindowFocused(ignoreFocus) && recentlyActive;

      if (!canCount) {
        lastCountedAtRef.current = now;
        return;
      }

      const elapsedSeconds = Math.floor((now - lastCountedAtRef.current) / 1000);
      const activeSeconds = Math.max(0, Math.min(elapsedSeconds, MAX_REPORT_SECONDS));
      lastCountedAtRef.current = now;

      if (activeSeconds <= 0) return;

      if (keepalive) {
        studyTimeApi.heartbeatKeepalive(activeSeconds);
        return;
      }

      pendingSecondsRef.current += activeSeconds;
      if (sendingRef.current) return;

      sendingRef.current = true;
      const secondsToSend = pendingSecondsRef.current;
      pendingSecondsRef.current = 0;

      studyTimeApi.heartbeat(secondsToSend)
        .catch(() => {
          pendingSecondsRef.current += secondsToSend;
        })
        .finally(() => {
          sendingRef.current = false;
        });
    };

    const markActivity = () => {
      const now = Date.now();
      const wasIdle = now - lastInteractionAtRef.current > IDLE_TIMEOUT_MS;
      lastInteractionAtRef.current = now;

      if (wasIdle || !isPageVisible() || !isWindowFocused()) {
        lastCountedAtRef.current = now;
      }
    };

    const stopCountingNow = () => {
      reportActiveSeconds({ ignoreFocus: true, ignoreVisibility: true, keepalive: true });
      lastCountedAtRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        stopCountingNow();
      } else {
        const now = Date.now();
        lastInteractionAtRef.current = now;
        lastCountedAtRef.current = now;
      }
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, markActivity, { passive: true });
    });
    window.addEventListener('blur', stopCountingNow);
    window.addEventListener('pagehide', stopCountingNow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const timer = window.setInterval(() => reportActiveSeconds(), HEARTBEAT_MS);

    return () => {
      window.clearInterval(timer);
      stopCountingNow();

      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, markActivity);
      });
      window.removeEventListener('blur', stopCountingNow);
      window.removeEventListener('pagehide', stopCountingNow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);
}
