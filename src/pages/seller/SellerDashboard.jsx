import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookApi } from '../../api/bookApi'
import { orderApi } from '../../api/orderApi'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../context/AuthContext'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookApi.getMyBooks().then(r => setBooks(r.data || [])).finally(() => setLoading(false))
  }, [])

  const totalStock = books.reduce((sum, b) => sum + b.stock, 0)
  const activeBooks = books.filter(b => b.status === 'ACTIVE').length

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Seller Dashboard</h1>
          <p style={{ color: '#64748b' }}>Welcome, {user?.name}!</p>
        </div>
        <Link to="/seller/books/add" className="btn btn-primary">+ Add New Book</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Listings', value: books.length,  icon: '📚', color: '#dbeafe' },
          { label: 'Active Books',   value: activeBooks,    icon: '✅', color: '#dcfce7' },
          { label: 'Total Stock',    value: totalStock,     icon: '📦', color: '#fef9c3' },
          { label: 'Low Stock',      value: books.filter(b => b.stock > 0 && b.stock <= 5).length, icon: '⚠️', color: '#fee2e2' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ background: stat.color, border: 'none' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stat.value}</div>
            <div style={{ fontSize: '.82rem', color: '#475569', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { to: '/seller/books/add',  label: 'Add New Book',      icon: '➕' },
          { to: '/seller/inventory',  label: 'Manage Inventory',  icon: '📦' },
          { to: '/seller/orders',     label: 'View Orders',       icon: '🛒' },
        ].map(link => (
          <Link key={link.to} to={link.to} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', transition: 'box-shadow .2s' }}>
            <span style={{ fontSize: '1.75rem' }}>{link.icon}</span>
            <span style={{ fontWeight: 700 }}>{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Books */}
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>My Listings</h2>
        {loading ? <Loader size="sm" /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={th}>Title</th>
                <th style={th}>Price</th>
                <th style={th}>Stock</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.slice(0, 10).map(book => (
                <tr key={book.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={td}><span style={{ fontWeight: 600 }}>{book.title}</span></td>
                  <td style={td}>₹{Number(book.price).toFixed(2)}</td>
                  <td style={td}>
                    <span style={{ color: book.stock === 0 ? '#dc2626' : book.stock <= 5 ? '#d97706' : '#16a34a', fontWeight: 600 }}>
                      {book.stock}
                    </span>
                  </td>
                  <td style={td}>
                    <span className={`badge ${book.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{book.status}</span>
                  </td>
                  <td style={td}>
                    <Link to={`/seller/books/${book.id}/edit`} style={{ color: '#2563eb', fontWeight: 600, fontSize: '.8rem' }}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const th = { padding: '.6rem .75rem', textAlign: 'left', fontWeight: 700, fontSize: '.8rem' }
const td = { padding: '.6rem .75rem' }
