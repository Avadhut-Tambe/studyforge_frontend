import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiHeart } from 'react-icons/fi'

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isSeller } = useAuth()
  const { cart } = useCart()
  const [search,    setSearch]    = useState('')
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/books?query=${encodeURIComponent(search.trim())}`)
  }

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>📚</span>
          <span>BookStore</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            style={styles.searchInput}
            placeholder="Search books, authors, ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" style={styles.searchBtn} aria-label="Search">
            <FiSearch size={18} />
          </button>
        </form>

        {/* Desktop Nav */}
        <div style={styles.navLinks}>
          <Link to="/books" style={styles.navLink}>Books</Link>
          <Link to="/study-schedule" style={styles.navLink}>Study Planner</Link>

          {isAuthenticated ? (
            <>
              {!isAdmin && !isSeller && (
                <>
                  <Link to="/wishlist" style={styles.iconBtn} aria-label="Wishlist">
                    <FiHeart size={20} />
                  </Link>
                  <Link to="/cart" style={styles.cartBtn}>
                    <FiShoppingCart size={20} />
                    {cart.totalItems > 0 && (
                      <span style={styles.cartBadge}>{cart.totalItems}</span>
                    )}
                  </Link>
                </>
              )}

              <div style={{ position: 'relative' }}>
                <button style={styles.avatarBtn}
                  onClick={() => setDropOpen(p => !p)}>
                  <FiUser size={18} />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropHeader}>
                      <div style={styles.dropName}>{user.name}</div>
                      <div style={styles.dropRole}>{user.role}</div>
                    </div>
                    <div style={styles.dropDivider} />
                    {isSeller && <>
                      <Link to="/seller"            style={styles.dropItem} onClick={() => setDropOpen(false)}>Dashboard</Link>
                      <Link to="/seller/books/add"  style={styles.dropItem} onClick={() => setDropOpen(false)}>Add Book</Link>
                      <Link to="/seller/orders"     style={styles.dropItem} onClick={() => setDropOpen(false)}>My Orders</Link>
                    </>}
                    {isAdmin && <>
                      <Link to="/admin"             style={styles.dropItem} onClick={() => setDropOpen(false)}>Admin Panel</Link>
                      <Link to="/admin/users"       style={styles.dropItem} onClick={() => setDropOpen(false)}>Users</Link>
                    </>}
                    {!isAdmin && !isSeller && (
                      <Link to="/orders"            style={styles.dropItem} onClick={() => setDropOpen(false)}>My Orders</Link>
                    )}
                    <div style={styles.dropDivider} />
                    <button style={{ ...styles.dropItem, color: '#dc2626', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                      onClick={() => { logout(); setDropOpen(false) }}>
                      <FiLogOut size={14} style={{ marginRight: 6 }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(p => !p)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, padding: '0 1rem 1rem' }}>
            <input className="form-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-primary btn-sm"><FiSearch /></button>
          </form>
          <Link to="/books"          style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Books</Link>
          <Link to="/study-schedule" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Study Planner</Link>
          {isAuthenticated ? (
            <>
              {!isAdmin && !isSeller && <>
                <Link to="/cart"    style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart ({cart.totalItems})</Link>
                <Link to="/wishlist"style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Wishlist</Link>
                <Link to="/orders"  style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Orders</Link>
              </>}
              {isSeller && <>
                <Link to="/seller"          style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/seller/books/add"style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Add Book</Link>
              </>}
              {isAdmin && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', color: '#dc2626' }}
                onClick={() => { logout(); setMenuOpen(false) }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    background: '#fff', borderBottom: '1px solid #e2e8f0',
    position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,.06)',
  },
  inner: {
    display: 'flex', alignItems: 'center', gap: '1.25rem',
    height: 64, position: 'relative',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '.5rem',
    fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', flexShrink: 0,
  },
  logoIcon: { fontSize: '1.4rem' },
  searchForm: {
    display: 'flex', flex: 1, maxWidth: 480, position: 'relative',
  },
  searchInput: {
    flex: 1, padding: '.5rem 3rem .5rem 1rem',
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: '.9rem', outline: 'none',
    background: '#f8fafc',
  },
  searchBtn: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#64748b', display: 'flex',
    alignItems: 'center',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '.75rem' },
  navLink: { fontWeight: 500, color: '#334155', fontSize: '.9rem', padding: '.25rem .5rem' },
  iconBtn: { color: '#334155', display: 'flex', alignItems: 'center', padding: '.25rem' },
  cartBtn: {
    position: 'relative', color: '#334155', display: 'flex', alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute', top: -8, right: -8, background: '#2563eb', color: '#fff',
    borderRadius: '50%', width: 18, height: 18, fontSize: '.7rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  avatarBtn: {
    display: 'flex', alignItems: 'center', gap: '.4rem',
    background: '#f1f5f9', border: 'none', borderRadius: 8,
    padding: '.4rem .75rem', fontWeight: 600, fontSize: '.85rem', color: '#1e293b',
  },
  dropdown: {
    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,.1)', minWidth: 200, zIndex: 200,
    overflow: 'hidden',
  },
  dropHeader: { padding: '.75rem 1rem' },
  dropName: { fontWeight: 700, fontSize: '.9rem' },
  dropRole: { fontSize: '.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: .5 },
  dropDivider: { height: 1, background: '#e2e8f0', margin: '0' },
  dropItem: {
    display: 'flex', alignItems: 'center', padding: '.6rem 1rem',
    fontSize: '.875rem', color: '#334155', cursor: 'pointer',
    transition: 'background .15s',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    '@media(max-width:768px)': { display: 'flex' },
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column', background: '#fff',
    borderTop: '1px solid #e2e8f0', padding: '1rem 0',
  },
  mobileLink: {
    display: 'block', padding: '.75rem 1.5rem', fontSize: '.95rem',
    color: '#334155', fontWeight: 500, borderBottom: '1px solid #f1f5f9',
  },
}
