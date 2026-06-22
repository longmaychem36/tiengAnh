import { useEffect, useRef, useState } from 'react';
import { FiAlertTriangle, FiLogOut, FiX } from 'react-icons/fi';
import { CONFIRM_EXIT_EVENT } from '../../utils/confirmExit';

function ConfirmExitProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolverRef = useRef(null);

  useEffect(() => {
    const handleConfirmExit = (event) => {
      event.preventDefault();

      if (resolverRef.current) resolverRef.current(false);
      resolverRef.current = event.detail.resolve;
      setRequest({
        message: event.detail.message
      });
    };

    window.addEventListener(CONFIRM_EXIT_EVENT, handleConfirmExit);
    return () => window.removeEventListener(CONFIRM_EXIT_EVENT, handleConfirmExit);
  }, []);

  const close = (confirmed) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setRequest(null);
  };

  return (
    <>
      {children}
      {request && (
        <div className="confirm-exit-backdrop" role="presentation" onMouseDown={() => close(false)}>
          <section
            className="confirm-exit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-exit-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="confirm-exit-close" onClick={() => close(false)} aria-label="Đóng">
              <FiX />
            </button>

            <div className="confirm-exit-icon">
              <FiAlertTriangle />
            </div>

            <div className="confirm-exit-copy">
              <span>Rời phiên học</span>
              <h2 id="confirm-exit-title">Bạn có chắc muốn thoát?</h2>
              <p>{request.message}</p>
            </div>

            <div className="confirm-exit-actions">
              <button type="button" className="btn btn-secondary" onClick={() => close(false)}>
                Tiếp tục làm bài
              </button>
              <button type="button" className="btn btn-primary confirm-exit-danger" onClick={() => close(true)}>
                <FiLogOut /> Thoát
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default ConfirmExitProvider;
