import React from 'react'
import { Link } from 'react-router-dom'

// Seller order visibility requires order-service to filter by sellerId in items.
// This is a placeholder — extend order-service to add /api/orders/seller endpoint.
export default function SellerOrders() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Seller Orders</h1>
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔧</div>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          This feature queries orders containing your books.<br />
          Extend the order-service with a <code>/api/orders/seller</code> endpoint that filters by sellerId.
        </p>
        <Link to="/seller" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  )
}
