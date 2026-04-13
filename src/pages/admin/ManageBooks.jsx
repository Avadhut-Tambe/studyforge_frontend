import React, { useState, useEffect } from 'react'
import { bookApi } from '../../api/bookApi'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function ManageBooks() {
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [query,   setQuery]   = useState('')

  useEffect(() => {
    bookApi.getBooks({ size: 100 }).then(r => setBooks(r.data || [])).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await bookApi.deleteBook(id)
      setBooks(b => b.filter(book => book.id !== id))
      toast.success('Book deleted')
    } catch { toast.error('Delete failed') }
  }

  const filtered = books.filter(b =>
    !query || b.title?.toLowerCase().includes(query.toLowerCase()) ||
    b.author?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Books</h1>
        <input className="form-input" style={{ maxWidth: 280 }} placeholder="Search by title or author..."
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {loading ? <Loader /> : (
        <div className="card">
          <p style={{ color: '#64748b', fontSize: '.875rem', marginBottom: '1rem' }}>
            {filtered.length} books
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Title', 'Author', 'Price', 'Stock', 'Seller', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '.65rem .75rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '.78rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(book => (
                <tr key={book.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '.65rem .75rem', fontWeight: 600, maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                  </td>
                  <td style={{ padding: '.65rem .75rem', color: '#64748b' }}>{book.author}</td>
                  <td style={{ padding: '.65rem .75rem' }}>₹{Number(book.price).toFixed(0)}</td>
                  <td style={{ padding: '.65rem .75rem' }}>
                    <span style={{ color: book.stock === 0 ? '#dc2626' : book.stock <= 5 ? '#d97706' : '#16a34a', fontWeight: 600 }}>
                      {book.stock}
                    </span>
                  </td>
                  <td style={{ padding: '.65rem .75rem', color: '#64748b', fontSize: '.78rem', fontFamily: 'monospace' }}>
                    {book.sellerId?.slice(-8)}
                  </td>
                  <td style={{ padding: '.65rem .75rem' }}>
                    <span className={`badge ${book.status === 'ACTIVE' ? 'badge-green' : book.status === 'COMING_SOON' ? 'badge-blue' : 'badge-gray'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td style={{ padding: '.65rem .75rem' }}>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.id, book.title)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
