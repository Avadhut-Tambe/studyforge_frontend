import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookApi } from '../../api/bookApi'
import BookCard from '../../components/book/BookCard'
import BookFilters from '../../components/book/BookFilters'
import Loader from '../../components/common/Loader'
import { FiGrid, FiList } from 'react-icons/fi'

export default function BookList() {
  const [searchParams] = useSearchParams()
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    query:     searchParams.get('query')  || '',
    stream:    searchParams.get('stream') || '',
    grade:     searchParams.get('grade')  || '',
    subject:   searchParams.get('subject')|| '',
    category:  '',
    minPrice:  '',
    maxPrice:  '',
    minRating: '',
    sortBy:    'createdAt',
    sortDir:   'desc',
  })

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.query)     params.query     = filters.query
      if (filters.stream)    params.stream    = filters.stream
      if (filters.grade)     params.grade     = filters.grade
      if (filters.subject)   params.subject   = filters.subject
      if (filters.category)  params.category  = filters.category
      if (filters.minPrice)  params.minPrice  = filters.minPrice
      if (filters.maxPrice)  params.maxPrice  = filters.maxPrice
      if (filters.minRating) params.minRating = filters.minRating
      params.sortBy  = filters.sortBy
      params.sortDir = filters.sortDir
      params.size    = 48

      const { data } = await bookApi.getBooks(params)
      setBooks(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {filters.query ? `Results for "${filters.query}"` : 'All Books'}
          </h1>
          <p style={{ color: '#64748b', marginTop: '.25rem', fontSize: '.9rem' }}>
            {books.length} books found
          </p>
        </div>
        <select style={styles.sortSelect}
          value={`${filters.sortBy}:${filters.sortDir}`}
          onChange={e => {
            const [sortBy, sortDir] = e.target.value.split(':')
            setFilters(f => ({ ...f, sortBy, sortDir }))
          }}>
          <option value="createdAt:desc">Newest First</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
          <option value="averageRating:desc">Top Rated</option>
          <option value="title:asc">Title: A-Z</option>
        </select>
      </div>

      <div style={styles.layout}>
        <BookFilters filters={filters} onChange={setFilters} />
        <div style={{ flex: 1 }}>
          {loading ? <Loader text="Loading books..." /> : books.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>📚</div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No books found</p>
              <p style={{ color: '#64748b', fontSize: '.9rem' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid-4">
              {books.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  sortSelect: { padding: '.45rem .75rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '.875rem', outline: 'none' },
  layout: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  empty: { textAlign: 'center', padding: '4rem 2rem', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem' },
}
