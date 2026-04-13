import React from 'react'

export default function Loader({ size = 'md', text = '' }) {
  const sz = size === 'sm' ? 24 : size === 'lg' ? 56 : 36
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '3rem' }}>
      <div style={{
        width: sz, height: sz,
        border: '3px solid #e2e8f0',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
      }} />
      {text && <p style={{ color: '#64748b', fontSize: '.9rem' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
