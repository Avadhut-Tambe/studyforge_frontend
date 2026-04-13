import React from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { wishlistApi } from '../../api/orderApi'
import toast from 'react-hot-toast'

export default function BookCard({ book }) {
  const { addToCart } = useCart()
  const { isAuthenticated, isBuyer } = useAuth()

  const discount = book.originalPrice && book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100) : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    addToCart(book)
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login'); return }
    try {
      await wishlistApi.addToWishlist(book.id)
      toast.success('Added to wishlist!')
    } catch { toast.error('Failed') }
  }

  return (
    <Link to={`/books/${book.id}`} style={styles.card}>
      {/* Cover */}
      <div style={styles.imgWrap}>
        <img
          src={book.coverImageUrl || `https://via.placeholder.com/200x280/2563eb/ffffff?text=${encodeURIComponent(book.title?.substring(0,10))}`}
          alt={book.title}
          style={styles.img}
        />
        {discount > 0 && <span style={styles.discountBadge}>{discount}% OFF</span>}
        {book.comingSoon && <span style={styles.comingSoonBadge}>Coming Soon</span>}
        {book.featured && !book.comingSoon && <span style={styles.featuredBadge}>Featured</span>}

        <div style={styles.actions}>
          {isBuyer && (
            <button style={styles.actionBtn} onClick={handleWishlist} title="Add to Wishlist">
              <FiHeart size={16} />
            </button>
          )}
          {!book.comingSoon && book.stock > 0 && (
            <button style={{ ...styles.actionBtn, background: '#2563eb', color: '#fff' }}
              onClick={handleAddToCart} title="Add to Cart">
              <FiShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={styles.info}>
        {book.grade && <span style={styles.grade}>{book.grade}</span>}
        <h3 style={styles.title} title={book.title}>{book.title}</h3>
        <p style={styles.author}>{book.author}</p>

        {book.averageRating > 0 && (
          <div style={styles.rating}>
            <FiStar size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{book.averageRating.toFixed(1)}</span>
            <span style={{ color: '#94a3b8' }}>({book.totalRatings})</span>
          </div>
        )}

        <div style={styles.priceRow}>
          <span style={styles.price}>₹{Number(book.price).toFixed(0)}</span>
          {discount > 0 && (
            <span style={styles.originalPrice}>₹{Number(book.originalPrice).toFixed(0)}</span>
          )}
        </div>

        {book.stock === 0 && !book.comingSoon && (
          <span style={styles.outOfStock}>Out of Stock</span>
        )}
      </div>
    </Link>
  )
}

const styles = {
  card: {
    display: 'flex', flexDirection: 'column',
    background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0',
    overflow: 'hidden', transition: 'all .2s', cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,.06)',
  },
  imgWrap: {
    position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f1f5f9',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    background: '#dc2626', color: '#fff', padding: '2px 8px',
    borderRadius: 4, fontSize: '.72rem', fontWeight: 700,
  },
  featuredBadge: {
    position: 'absolute', top: 8, left: 8,
    background: '#2563eb', color: '#fff', padding: '2px 8px',
    borderRadius: 4, fontSize: '.72rem', fontWeight: 700,
  },
  comingSoonBadge: {
    position: 'absolute', top: 8, left: 8,
    background: '#7c3aed', color: '#fff', padding: '2px 8px',
    borderRadius: 4, fontSize: '.72rem', fontWeight: 700,
  },
  actions: {
    position: 'absolute', bottom: 8, right: 8,
    display: 'flex', flexDirection: 'column', gap: 6, opacity: 0, transition: 'opacity .2s',
  },
  actionBtn: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#fff', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,.1)', transition: 'all .15s',
  },
  info: { padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.3rem' },
  grade: { fontSize: '.72rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase' },
  title: { fontSize: '.9rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3,
    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  author: { fontSize: '.8rem', color: '#64748b' },
  rating: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '.8rem', color: '#1e293b' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.25rem' },
  price: { fontWeight: 800, fontSize: '1rem', color: '#1e293b' },
  originalPrice: { fontSize: '.8rem', color: '#94a3b8', textDecoration: 'line-through' },
  outOfStock: { fontSize: '.75rem', color: '#dc2626', fontWeight: 600 },
}
