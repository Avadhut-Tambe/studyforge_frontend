import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bookApi } from '../../api/bookApi'
import BookCard from '../../components/book/BookCard'
import Loader from '../../components/common/Loader'

const STREAMS = [
  { name: 'Science',   icon: '🔬', color: '#dbeafe', textColor: '#1d4ed8' },
  { name: 'Commerce',  icon: '📊', color: '#dcfce7', textColor: '#16a34a' },
  { name: 'Arts',      icon: '🎨', color: '#fef9c3', textColor: '#a16207' },
  { name: 'Vocational',icon: '🔧', color: '#fce7f3', textColor: '#be185d' },
]

export default function Home() {
  const [featured,   setFeatured]   = useState([])
  const [comingSoon, setComingSoon] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feat, coming] = await Promise.all([
          bookApi.getFeatured(),
          bookApi.getBooks({ comingSoon: true, size: 6 }),
        ])
        setFeatured(feat.data || [])
        setComingSoon(coming.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/books?query=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Find the Right Book<br />for Every Class & Stream
            </h1>
            <p style={styles.heroSub}>
              Textbooks, references, guides — everything from Class 6 to Postgraduate.
              With a smart study schedule generator built in.
            </p>
            <form onSubmit={handleSearch} style={styles.heroSearch}>
              <input
                style={styles.heroInput}
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0, padding: '.75rem 1.75rem' }}>
                Search Books
              </button>
            </form>
            <div style={styles.heroLinks}>
              <Link to="/books?grade=Class 10" style={styles.quickLink}>Class 10 Books</Link>
              <Link to="/books?grade=Class 12" style={styles.quickLink}>Class 12 Books</Link>
              <Link to="/study-schedule"       style={styles.quickLink}>Study Planner</Link>
            </div>
          </div>
          <div style={styles.heroImg}>
            <div style={styles.heroIllustration}>📚</div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Streams */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Browse by Stream</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {STREAMS.map(s => (
              <Link key={s.name} to={`/books?stream=${s.name}`}
                style={{ ...styles.streamCard, background: s.color, color: s.textColor }}>
                <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{s.name}</span>
                <span style={{ fontSize: '.8rem', opacity: .8 }}>Explore books →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Books */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Books</h2>
            <Link to="/books?featured=true" style={styles.seeAll}>See all →</Link>
          </div>
          {loading ? <Loader /> : (
            featured.length === 0
              ? <p style={{ color: '#64748b' }}>No featured books yet.</p>
              : <div className="grid-4">
                  {featured.slice(0, 8).map(book => <BookCard key={book.id} book={book} />)}
                </div>
          )}
        </section>

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Coming Soon</h2>
              <span className="badge badge-blue">New Arrivals</span>
            </div>
            <div className="grid-4">
              {comingSoon.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {/* Study Planner CTA */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <span style={{ fontSize: '2.5rem' }}>📅</span>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '.35rem' }}>
                Smart Study Schedule Generator
              </h3>
              <p style={{ color: '#475569', fontSize: '.9rem' }}>
                Enter your subjects, available time, and exam date —
                we'll generate a personalized timetable you can download!
              </p>
            </div>
            <Link to="/study-schedule" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Generate Schedule
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '4rem 0 3rem' },
  heroInner: { display: 'flex', alignItems: 'center', gap: '3rem' },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#1e293b', lineHeight: 1.2, marginBottom: '1rem' },
  heroSub: { color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 500 },
  heroSearch: { display: 'flex', gap: 12, marginBottom: '1rem', maxWidth: 560 },
  heroInput: { flex: 1, padding: '.75rem 1.25rem', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: '1rem', outline: 'none', background: '#fff' },
  heroLinks: { display: 'flex', gap: '.75rem', flexWrap: 'wrap' },
  quickLink: { padding: '.35rem .85rem', background: 'rgba(37,99,235,.1)', color: '#2563eb', borderRadius: 999, fontSize: '.82rem', fontWeight: 600 },
  heroImg: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroIllustration: { fontSize: '8rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.1))' },
  section: { marginBottom: '3.5rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' },
  seeAll: { color: '#2563eb', fontWeight: 600, fontSize: '.875rem' },
  streamCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', padding: '1.5rem', borderRadius: 12, cursor: 'pointer', transition: 'transform .2s, box-shadow .2s', textDecoration: 'none' },
  ctaSection: { background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: 16, padding: '2.5rem', marginBottom: '3rem', color: '#fff' },
  ctaContent: { display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' },
}
