import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[
          { to: '/admin/users', label: 'Manage Users',        icon: '👥', desc: 'View, approve, suspend users' },
          { to: '/admin/books', label: 'Manage Books',        icon: '📚', desc: 'Review and manage catalog'    },
          { to: '/books',       label: 'Browse Catalog',      icon: '🔍', desc: 'View as customer'             },
        ].map(card => (
          <Link key={card.to} to={card.to} className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', textDecoration: 'none', transition: 'box-shadow .2s' }}>
            <span style={{ fontSize: '2rem' }}>{card.icon}</span>
            <span style={{ fontWeight: 800 }}>{card.label}</span>
            <span style={{ fontSize: '.82rem', color: '#64748b' }}>{card.desc}</span>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Platform Overview</h2>
        <p style={{ color: '#64748b', fontSize: '.9rem' }}>
          Connect to Firestore and add aggregation queries to populate real analytics here.
          Recommended: use Firebase Functions to pre-aggregate counts daily into a <code>analytics</code> collection.
        </p>
      </div>
    </div>
  )
}
