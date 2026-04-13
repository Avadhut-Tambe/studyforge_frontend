import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bookApi } from '../../api/bookApi'
import { wishlistApi } from '../../api/orderApi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar } from 'react-icons/fi'

export default function BookDetail() {
  const { id } = useParams()
  const [book,     setBook]     = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading,  setLoading]  = useState(true)
  const { addToCart } = useCart()
  const { isAuthenticated, isBuyer } = useAuth()

  useEffect(() => {
    bookApi.getBook(id)
      .then(r => setBook(r.data))
      .catch(() => toast.error('Book not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return }
    addToCart(book, quantity)
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return }
    try { await wishlistApi.addToWishlist(book.id); toast.success('Saved to wishlist!') }
    catch { toast.error('Failed to save') }
  }

  if (loading) return <Loader text="Loading book details..." />
  if (!book)   return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Book not found</div>

  const discount = book.originalPrice && book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100) : 0

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link to="/books" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', marginBottom: '1.5rem', fontSize: '.875rem' }}>
        <FiArrowLeft /> Back to Books
      </Link>

      <div style={styles.layout}>
        {/* Left — Cover */}
        <div style={styles.imageSection}>
          <img
            src={book.coverImageUrl || `https://via.placeholder.com/300x420/2563eb/fff?text=${encodeURIComponent(book.title.substring(0,8))}`}
            alt={book.title}
            style={styles.coverImg}
          />
          {discount > 0 && <div className="badge badge-red" style={{ marginTop: '.75rem', justifyContent: 'center' }}>{discount}% OFF</div>}
        </div>

        {/* Right — Details */}
        <div style={styles.detailSection}>
          {book.grade    && <span className="badge badge-blue" style={{ marginBottom: '.5rem' }}>{book.grade}</span>}
          {book.featured && <span className="badge badge-green" style={{ marginBottom: '.5rem', marginLeft: 6 }}>Featured</span>}

          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.author}>by <strong>{book.author}</strong></p>

          {/* Rating */}
          {book.totalRatings > 0 && (
            <div style={styles.ratingRow}>
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} size={16}
                  fill={i <= Math.round(book.averageRating) ? '#f59e0b' : 'none'}
                  color={i <= Math.round(book.averageRating) ? '#f59e0b' : '#d1d5db'}
                />
              ))}
              <span style={{ fontWeight: 700 }}>{book.averageRating?.toFixed(1)}</span>
              <span style={{ color: '#64748b' }}>({book.totalRatings} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div style={styles.priceRow}>
            <span style={styles.price}>₹{Number(book.price).toFixed(2)}</span>
            {discount > 0 && (
              <>
                <span style={styles.originalPrice}>₹{Number(book.originalPrice).toFixed(2)}</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>Save {discount}%</span>
              </>
            )}
          </div>

          {/* Meta tags */}
          <div style={styles.tags}>
            {book.stream    && <span className="badge badge-blue">{book.stream}</span>}
            {book.subject   && <span className="badge badge-green">{book.subject}</span>}
            {book.category  && <span className="badge badge-gray">{book.category}</span>}
            {book.publisher && <span className="badge badge-gray">{book.publisher}</span>}
          </div>

          {/* Stock */}
          <div style={{ fontSize: '.875rem', marginBottom: '1rem' }}>
            {book.stock > 10
              ? <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ In Stock</span>
              : book.stock > 0
              ? <span style={{ color: '#d97706', fontWeight: 600 }}>Only {book.stock} left!</span>
              : <span style={{ color: '#dc2626', fontWeight: 600 }}>Out of Stock</span>
            }
          </div>

          {/* Quantity + CTA */}
          {!book.comingSoon && book.stock > 0 && (
            <>
              <div style={styles.qtyRow}>
                <label style={{ fontWeight: 600, fontSize: '.875rem' }}>Quantity:</label>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <span style={styles.qtyNum}>{quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}>+</button>
                </div>
              </div>
              <div style={styles.ctaRow}>
                <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleAddToCart}>
                  <FiShoppingCart /> Add to Cart
                </button>
                {isBuyer && (
                  <button className="btn btn-secondary" style={{ flexShrink: 0 }} onClick={handleWishlist}>
                    <FiHeart />
                  </button>
                )}
              </div>
            </>
          )}

          {book.comingSoon && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1rem', fontSize: '.9rem', color: '#15803d' }}>
              This book is coming soon! Save it to your wishlist to be notified.
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>About this book</h2>
          <p style={{ color: '#334155', lineHeight: 1.8 }}>{book.description}</p>
        </div>
      )}

      {/* Book Details Table */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Book Details</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <tbody>
            {[
              ['ISBN',        book.isbn],
              ['Publisher',   book.publisher],
              ['Year',        book.publishedYear],
              ['Language',    book.language],
              ['Pages',       book.pages],
              ['Grade',       book.grade],
              ['Subject',     book.subject],
              ['Stream',      book.stream],
            ].filter(([,v]) => v).map(([k, v]) => (
              <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.6rem 0', fontWeight: 600, color: '#475569', width: 140 }}>{k}</td>
                <td style={{ padding: '.6rem 0', color: '#1e293b' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'flex-start' },
  imageSection: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  coverImg: { width: '100%', maxWidth: 300, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,.15)', objectFit: 'cover' },
  detailSection: { display: 'flex', flexDirection: 'column', gap: '.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', lineHeight: 1.3 },
  author: { color: '#475569', fontSize: '1rem' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '.875rem', color: '#1e293b', margin: '.25rem 0' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '.5rem 0 .75rem' },
  price: { fontSize: '2rem', fontWeight: 900, color: '#1e293b' },
  originalPrice: { fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' },
  tags: { display: 'flex', gap: '.5rem', flexWrap: 'wrap', margin: '.5rem 0' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.75rem' },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' },
  qtyBtn: { width: 36, height: 36, background: '#f8fafc', border: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' },
  qtyNum: { padding: '0 1rem', fontWeight: 700, fontSize: '1rem' },
  ctaRow: { display: 'flex', gap: '1rem', marginTop: '.5rem' },
}
