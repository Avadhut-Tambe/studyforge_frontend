import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { wishlistApi } from '../../api/orderApi'
import { bookApi } from '../../api/bookApi'
import BookCard from '../../components/book/BookCard'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: bookIds } = await wishlistApi.getWishlist()
        if (bookIds.length === 0) { setLoading(false); return }
        const bookDetails = await Promise.all(bookIds.map(id => bookApi.getBook(id).then(r => r.data).catch(() => null)))
        setBooks(bookDetails.filter(Boolean))
      } catch (e) { toast.error('Failed to load wishlist') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const removeItem = async (bookId) => {
    try {
      await wishlistApi.removeFromList(bookId)
      setBooks(b => b.filter(book => book.id !== bookId))
      toast.success('Removed from wishlist')
    } catch { toast.error('Failed to remove') }
  }

  if (loading) return <Loader text="Loading wishlist..." />

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        My Wishlist ({books.length} items)
      </h1>
      {books.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
          <p style={{ fontWeight: 600, marginBottom: '.5rem' }}>Your wishlist is empty</p>
          <Link to="/books" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>Explore Books</Link>
        </div>
      ) : (
        <div className="grid-4">
          {books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  )
}
