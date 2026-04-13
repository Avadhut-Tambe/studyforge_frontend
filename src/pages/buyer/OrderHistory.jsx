import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderApi } from '../../api/orderApi'
import Loader from '../../components/common/Loader'
import { format } from 'date-fns'

const STATUS_COLORS = {
  PENDING:            'badge-yellow',
  PAYMENT_PROCESSING: 'badge-yellow',
  PAYMENT_FAILED:     'badge-red',
  CONFIRMED:          'badge-blue',
  PROCESSING:         'badge-blue',
  SHIPPED:            'badge-blue',
  DELIVERED:          'badge-green',
  CANCELLED:          'badge-red',
  REFUNDED:           'badge-gray',
}

export default function OrderHistory() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderApi.getOrders()
      .then(r => setOrders(r.data || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading orders..." />

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <p style={{ fontWeight: 600 }}>No orders yet</p>
          <p style={{ fontSize: '.875rem' }}>Start shopping to place your first order!</p>
          <Link to="/books" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Browse Books</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#64748b' }}>
                    Order #{order.id?.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '.8rem', color: '#94a3b8', marginTop: '.25rem' }}>
                    {order.createdAt ? format(new Date(order.createdAt * 1000 || order.createdAt), 'PPP') : 'N/A'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem' }}>
                  <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gray'}`}>
                    {order.status?.replace('_', ' ')}
                  </span>
                  <span style={{ fontWeight: 800 }}>₹{Number(order.total).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {order.items?.slice(0, 4).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: '#f8fafc', borderRadius: 8, padding: '.4rem .75rem' }}>
                    <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{item.title}</span>
                    <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>×{item.quantity}</span>
                  </div>
                ))}
                {order.items?.length > 4 && (
                  <div style={{ fontSize: '.82rem', color: '#64748b', alignSelf: 'center' }}>+{order.items.length - 4} more</div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {order.trackingId && (
                  <div style={{ fontSize: '.8rem', color: '#64748b' }}>
                    Tracking: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{order.trackingId}</span>
                  </div>
                )}
                <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
