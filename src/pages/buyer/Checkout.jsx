import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../../context/CartContext'
import { orderApi } from '../../api/orderApi'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart } = useCart()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayMethod] = useState('CARD')

  const { register, handleSubmit, formState: { errors } } = useForm()

  const shipping    = cart.total >= 500 ? 0 : 49
  const orderTotal  = cart.total + shipping

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        shippingAddress: {
          name:    data.name,
          street:  data.street,
          city:    data.city,
          state:   data.state,
          pincode: data.pincode,
          phone:   data.phone,
        },
        paymentMethod: payMethod,
      }
      const { data: order } = await orderApi.checkout(payload)
      // Navigate to payment page with order info
      navigate('/payment', { state: { order, payMethod } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

      <div style={styles.layout}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Address */}
          <div className="card">
            <h2 style={styles.cardTitle}>Shipping Address</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className={`form-input ${errors.name ? 'error' : ''}`}
                    {...register('name', { required: 'Required' })} placeholder="John Doe" />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className={`form-input ${errors.phone ? 'error' : ''}`}
                    {...register('phone', { required: 'Required' })} placeholder="+91 99999 99999" />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className={`form-input ${errors.street ? 'error' : ''}`}
                  {...register('street', { required: 'Required' })} placeholder="123 Main Street, Apt 4B" />
                {errors.street && <span className="form-error">{errors.street.message}</span>}
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className={`form-input ${errors.city ? 'error' : ''}`}
                    {...register('city', { required: 'Required' })} placeholder="Mumbai" />
                  {errors.city && <span className="form-error">{errors.city.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className={`form-input ${errors.state ? 'error' : ''}`}
                    {...register('state', { required: 'Required' })} placeholder="Maharashtra" />
                  {errors.state && <span className="form-error">{errors.state.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className={`form-input ${errors.pincode ? 'error' : ''}`}
                    {...register('pincode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })}
                    placeholder="400001" maxLength={6} />
                  {errors.pincode && <span className="form-error">{errors.pincode.message}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <h2 style={styles.cardTitle}>Payment Method</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'CARD',       label: 'Credit / Debit Card', icon: '💳' },
                { id: 'UPI',        label: 'UPI',                  icon: '📱' },
                { id: 'NETBANKING', label: 'Net Banking',          icon: '🏦' },
                { id: 'COD',        label: 'Cash on Delivery',     icon: '💵' },
              ].map(m => (
                <label key={m.id} style={{
                  ...styles.payOption,
                  ...(payMethod === m.id ? styles.payActive : {}),
                }}>
                  <input type="radio" value={m.id} checked={payMethod === m.id}
                    onChange={() => setPayMethod(m.id)} style={{ display: 'none' }} />
                  <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '.82rem', textAlign: 'center' }}>{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg"
            style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Placing order...' : `Place Order — ₹${orderTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <h2 style={styles.cardTitle}>Order Summary</h2>
            {cart.items.map(item => (
              <div key={item.bookId} style={styles.summaryItem}>
                <span style={{ flex: 1, fontSize: '.875rem' }}>{item.title} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₹{(item.unitPrice * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.summaryRow}><span>Subtotal</span><span>₹{cart.total.toFixed(2)}</span></div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#16a34a' : '' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span><span>₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' },
  cardTitle: { fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', color: '#1e293b' },
  payOption: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem',
    padding: '1rem', borderRadius: 10, border: '2px solid #e2e8f0',
    cursor: 'pointer', transition: 'all .15s', textAlign: 'center',
  },
  payActive: { border: '2px solid #2563eb', background: '#eff6ff' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '.6rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', fontSize: '.9rem' },
  divider: { height: 1, background: '#e2e8f0', margin: '.75rem 0' },
}
