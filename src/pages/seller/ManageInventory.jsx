import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookApi } from '../../api/bookApi'
import Loader from '../../components/common/Loader'

export default function ManageInventory() {
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookApi.getMyBooks().then(r => setBooks(r.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Inventory</h1>
        <Link to="/seller/books/add" className="btn btn-primary">+ Add Book</Link>
      </div>
      {loading ? <Loader /> : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['Title','Author','Price','Stock','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '.75rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '.8rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '.75rem', fontWeight: 600 }}>{book.title}</td>
                  <td style={{ padding: '.75rem', color: '#64748b' }}>{book.author}</td>
                  <td style={{ padding: '.75rem' }}>₹{Number(book.price).toFixed(2)}</td>
                  <td style={{ padding: '.75rem' }}>
                    <span style={{ color: book.stock === 0 ? '#dc2626' : book.stock <= 5 ? '#d97706' : '#16a34a', fontWeight: 700 }}>
                      {book.stock} {book.stock <= 5 && book.stock > 0 ? '⚠️' : book.stock === 0 ? '❌' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '.75rem' }}>
                    <span className={`badge ${book.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{book.status}</span>
                  </td>
                  <td style={{ padding: '.75rem' }}>
                    <Link to={`/seller/books/${book.id}/edit`} style={{ color: '#2563eb', fontWeight: 600, fontSize: '.8rem' }}>Edit</Link>
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
