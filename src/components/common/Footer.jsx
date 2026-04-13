import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div>
            <div style={styles.brand}>📚 BookStore</div>
            <p style={styles.tagline}>Your one-stop destination for school books, textbooks, and reference materials.</p>
          </div>
          <div>
            <div style={styles.heading}>Shop</div>
            <Link to="/books" style={styles.link}>All Books</Link>
            <Link to="/books?stream=Science" style={styles.link}>Science</Link>
            <Link to="/books?stream=Commerce" style={styles.link}>Commerce</Link>
            <Link to="/books?stream=Arts" style={styles.link}>Arts</Link>
          </div>
          <div>
            <div style={styles.heading}>Account</div>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/orders"   style={styles.link}>My Orders</Link>
            <Link to="/wishlist" style={styles.link}>Wishlist</Link>
          </div>
          <div>
            <div style={styles.heading}>Tools</div>
            <Link to="/study-schedule" style={styles.link}>Study Planner</Link>
            <Link to="/register?role=SELLER" style={styles.link}>Sell Books</Link>
          </div>
        </div>
        <div style={styles.bottom}>
          <span>© {new Date().getFullYear()} BookStore. All rights reserved.</span>
          <span style={{ color: '#64748b' }}>Built with React + Spring Boot + Firebase</span>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: { background: '#1e293b', color: '#94a3b8', padding: '3rem 0 1.5rem', marginTop: '4rem' },
  grid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', marginBottom: '2rem' },
  brand:  { fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '.5rem' },
  tagline:{ fontSize: '.85rem', lineHeight: 1.5 },
  heading:{ fontWeight: 700, color: '#e2e8f0', marginBottom: '.75rem', fontSize: '.9rem', textTransform: 'uppercase', letterSpacing: .5 },
  link:   { display: 'block', color: '#94a3b8', fontSize: '.875rem', marginBottom: '.4rem', transition: 'color .15s' },
  bottom: { borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', fontSize: '.8rem' },
}
