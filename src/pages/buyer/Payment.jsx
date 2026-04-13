import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { paymentApi } from '../../api/paymentApi'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)

  const { order, payMethod } = location.state || {}
  const { register, handleSubmit, formState: { errors } } = useForm()

  if (!order) {
    navigate('/cart')
    return null
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        orderId:    order.id,
        amount:     order.total,
        method:     payMethod,
        cardNumber: data.cardNumber?.replace(/\s/g, ''),
        cardExpiry: data.cardExpiry,
        cardCvv:    data.cardCvv,
        cardHolder: data.cardHolder,
        upiId:      data.upiId,
      }
      const { data: res } = await paymentApi.processPayment(payload)
      setResult(res)
      if (res.status === 'SUCCESS') {
        await clearCart()
        toast.success('Payment successful!')
      } else {
        toast.error('Payment failed. Please try again.')
      }
    } catch (err) {
      toast.error('Payment processing error')
    } finally {
      setLoading(false)
    }
  }

  // Payment success screen
  if (result?.status === 'SUCCESS') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16a34a', marginBottom: '.5rem' }}>Payment Successful!</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Your order has been placed successfully.</p>

        <div className="card" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <span style={{ color: '#64748b' }}>Order ID</span>
            <span style={{ fontWeight: 700, fontSize: '.875rem' }}>{order.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <span style={{ color: '#64748b' }}>Tracking ID</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{order.trackingId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <span style={{ color: '#64748b' }}>Amount Paid</span>
            <span style={{ fontWeight: 700 }}>₹{Number(order.total).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Payment ID</span>
            <span style={{ fontWeight: 700, fontSize: '.8rem', fontFamily: 'monospace' }}>{result.paymentId}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/orders')}>View Orders</button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    )
  }

  // Payment failure screen
  if (result?.status === 'FAILED') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#dc2626', marginBottom: '.5rem' }}>Payment Failed</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>{result.message}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/cart')}>Back to Cart</button>
          <button className="btn btn-primary" onClick={() => setResult(null)}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.5rem' }}>Complete Payment</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Amount to pay: <strong>₹{Number(order.total).toFixed(2)}</strong></p>

      {/* Demo notice */}
      <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', fontSize: '.85rem', color: '#713f12' }}>
        <strong>Demo Mode:</strong> This is a simulated payment. No real money is charged.
        Use CVV <strong>000</strong> to simulate failure, or any other 3-digit CVV for success.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {payMethod === 'CARD' && (
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '.95rem' }}>Card Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                  placeholder="4111 1111 1111 1111"
                  maxLength={19}
                  {...register('cardNumber', {
                    required: 'Card number is required',
                    pattern: { value: /[\d\s]{16,19}/, message: 'Invalid card number' },
                  })}
                  onChange={e => {
                    // Auto-format with spaces
                    e.target.value = e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()
                  }}
                />
                {errors.cardNumber && <span className="form-error">{errors.cardNumber.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input className={`form-input ${errors.cardHolder ? 'error' : ''}`}
                  placeholder="JOHN DOE"
                  {...register('cardHolder', { required: 'Required' })} />
                {errors.cardHolder && <span className="form-error">{errors.cardHolder.message}</span>}
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Expiry (MM/YY)</label>
                  <input className={`form-input ${errors.cardExpiry ? 'error' : ''}`}
                    placeholder="12/27" maxLength={5}
                    {...register('cardExpiry', {
                      required: 'Required',
                      pattern: { value: /^\d{2}\/\d{2}$/, message: 'MM/YY format' },
                    })} />
                  {errors.cardExpiry && <span className="form-error">{errors.cardExpiry.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className={`form-input ${errors.cardCvv ? 'error' : ''}`}
                    type="password" placeholder="•••" maxLength={3}
                    {...register('cardCvv', {
                      required: 'Required',
                      pattern: { value: /^\d{3}$/, message: '3 digits' },
                    })} />
                  {errors.cardCvv && <span className="form-error">{errors.cardCvv.message}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {payMethod === 'UPI' && (
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '.95rem' }}>UPI Payment</h2>
            <div className="form-group">
              <label className="form-label">UPI ID</label>
              <input className={`form-input ${errors.upiId ? 'error' : ''}`}
                placeholder="yourname@upi"
                {...register('upiId', {
                  required: 'UPI ID is required',
                  pattern: { value: /\w+@\w+/, message: 'Invalid UPI ID format' },
                })} />
              {errors.upiId && <span className="form-error">{errors.upiId.message}</span>}
              <span className="form-hint">Example: john@paytm, user@okaxis</span>
            </div>
          </div>
        )}

        {payMethod === 'NETBANKING' && (
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '.95rem' }}>Net Banking</h2>
            <div className="form-group">
              <label className="form-label">Select Bank</label>
              <select className="form-input" {...register('bank', { required: 'Select a bank' })}>
                <option value="">-- Select Bank --</option>
                {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Bank','Punjab National Bank'].map(b =>
                  <option key={b} value={b}>{b}</option>
                )}
              </select>
            </div>
            <p style={{ fontSize: '.82rem', color: '#64748b', marginTop: '.75rem' }}>
              You will be redirected to your bank's secure page (simulated).
            </p>
          </div>
        )}

        {payMethod === 'COD' && (
          <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>💵</div>
            <h2 style={{ fontWeight: 700, marginBottom: '.5rem' }}>Cash on Delivery</h2>
            <p style={{ fontSize: '.875rem', color: '#475569' }}>
              Pay ₹{Number(order.total).toFixed(2)} in cash when your order is delivered.
            </p>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg"
          style={{ justifyContent: 'center' }} disabled={loading}>
          {loading ? (
            <><span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Processing payment...</>
          ) : `Pay ₹${Number(order.total).toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}
