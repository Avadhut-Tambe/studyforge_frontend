import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderApi } from '../../api/orderApi'
import Loader from '../../components/common/Loader'

const STATUS_STEPS = ['CONFIRMED','PROCESSING','SHIPPED','DELIVERED']

export default function OrderDetail() {
  const { id }    = useParams()
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderApi.getOrder(id).then(r => setOrder(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!order)  return <div className="container" style={{ padding: '3rem' }}>Order not found</div>

  const stepIdx = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <Link to="/orders" style={{ color: '#64748b', fontSize: '.875rem' }}>← Back to Orders</Link>
      <h1 style={{ fontWeight: 800, marginTop: '1rem', marginBottom: '.5rem' }}>
        Order #{order.id?.slice(-8).toUpperCase()}
      </h1>
      <div style={{ color: '#64748b', fontSize: '.875rem', marginBottom: '2rem' }}>
        Tracking ID: <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{order.trackingId}</strong>
      </div>

      {/* Progress */}
      {stepIdx >= 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 16, left: '8%', right: '8%', height: 2, background: '#e2e8f0', zIndex: 0 }} />
            {STATUS_STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem', zIndex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= stepIdx ? '#2563eb' : '#e2e8f0',
                  color: i <= stepIdx ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: '.8rem',
                }}>{i < stepIdx ? '✓' : i + 1}</div>
                <span style={{ fontSize: '.72rem', fontWeight: i === stepIdx ? 700 : 400, color: i <= stepIdx ? '#2563eb' : '#94a3b8', textAlign: 'center' }}>
                  {s.replace('_',' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '.95rem' }}>Items Ordered</h2>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{item.title}</div>
              <div style={{ color: '#64748b', fontSize: '.8rem' }}>by {item.author} × {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 700 }}>₹{Number(item.totalPrice).toFixed(2)}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.75rem', fontWeight: 800 }}>
          <span>Total</span><span>₹{Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '.75rem', fontSize: '.95rem' }}>Shipping Address</h2>
          <p style={{ fontSize: '.875rem', lineHeight: 1.7, color: '#334155' }}>
            {order.shippingAddress.name}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </p>
        </div>
      )}
    </div>
  )
}
