import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Trang này đang bị lỗi</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Vui lòng tải lại trang hoặc quay lại trang trước.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Tải lại
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
              Quay lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
