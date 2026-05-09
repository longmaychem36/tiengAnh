import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div style={{ width: '100%', marginBottom: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
        <span>Tiến độ</span>
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{current} / {total}</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
};

export default ProgressBar;
