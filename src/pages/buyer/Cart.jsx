import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, loading } = useCart()
  const navigate = useNavigate()

  const shipping = cart.total >= 500 ? 0 : 49
  const orderTotal = cart.total + shipping

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontWeight: 800, marginBottom: '.5rem' }}>Your cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Add some books to get started!</p>
        <Link to="/books" className="btn btn-primary btn-lg">Browse Books</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/books" style={{ color: '#64748b' }}><FiArrowLeft size={20} /></Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Shopping Cart ({cart.totalItems} items)</h1>
      </div>

      <div style={styles.layout}>
        {/* Items */}
        <div style={styles.items}>
          {cart.items.map(item => (
            <div key={item.bookId} style={styles.item}>
              <img
                src={item.coverImageUrl || `https://via.placeholder.com/80x110/2563eb/fff?text=Book`}
                alt={item.title}
                style={styles.itemImg}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.25rem' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '.85rem', marginBottom: '.75rem' }}>{item.author}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={styles.qtyControl}>
                    <button style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.bookId, item.quantity - 1)}>-</button>
                    <span style={{ padding: '0 .75rem', fontWeight: 700 }}>{item.quantity}</span>
                    <button style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}>+</button>
                  </div>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.bookId)}>
                    <FiTrash2 size={16} /> Remove
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  ₹{(item.unitPrice * item.quantity).toFixed(2)}
                </div>
                <div style={{ color: '#64748b', fontSize: '.8rem' }}>₹{item.unitPrice} each</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h2 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Subtotal ({cart.totalItems} items)</span>
            <span>₹{cart.total.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? '#16a34a' : '' }}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          {cart.total < 500 && (
            <div style={styles.freeShippingHint}>
              Add ₹{(500 - cart.total).toFixed(0)} more for free shipping!
            </div>
          )}
          <div style={styles.divider} />
          <div style={{ ...styles.summaryRow, fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Total</span>
            <span>₹{orderTotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
            onClick={() => navigate('/checkout')}>
            <FiShoppingBag /> Proceed to Checkout
          </button>
          <Link to="/books" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '.875rem', color: '#64748b' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'flex-start' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' },
  itemImg: { width: 80, height: 110, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' },
  qtyBtn: { width: 32, height: 32, background: '#f8fafc', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
  removeBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, fontSize: '.82rem', cursor: 'pointer' },
  summary: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem', position: 'sticky', top: 80 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem', fontSize: '.9rem' },
  freeShippingHint: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '.6rem .75rem', fontSize: '.8rem', color: '#15803d', marginTop: '.5rem', marginBottom: '.5rem' },
  divider: { height: 1, background: '#e2e8f0', margin: '.75rem 0' },
}
