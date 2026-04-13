import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { bookApi } from '../../api/bookApi'
import toast from 'react-hot-toast'

const STREAMS   = ['Science', 'Commerce', 'Arts', 'Vocational']
const GRADES    = ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12','Undergraduate','Postgraduate']
const SUBJECTS  = ['Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Geography','Economics','Accountancy','Computer Science','Political Science']
const CATEGORIES= ['Textbook','Reference','Novel','Guide','Question Bank','Sample Papers']

export default function AddBook() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        price:         parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        stock:         parseInt(data.stock),
        pages:         parseInt(data.pages) || 0,
        featured:      data.featured === 'true',
        comingSoon:    data.comingSoon === 'true',
      }
      await bookApi.createBook(payload)
      toast.success('Book listed successfully!')
      navigate('/seller')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 760 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Add New Book</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div className="card">
          <h2 style={sectionTitle}>Basic Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className={`form-input ${errors.title ? 'error' : ''}`}
                {...register('title', { required: 'Title is required' })} placeholder="e.g. NCERT Mathematics Class 10" />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Author *</label>
                <input className={`form-input ${errors.author ? 'error' : ''}`}
                  {...register('author', { required: 'Author is required' })} placeholder="Author name" />
                {errors.author && <span className="form-error">{errors.author.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input className="form-input" {...register('isbn')} placeholder="978-XXXXXXXXXX" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} style={{ resize: 'vertical' }}
                {...register('description')} placeholder="Describe this book..." />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={sectionTitle}>Pricing & Stock</h2>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input className={`form-input ${errors.price ? 'error' : ''}`} type="number" step="0.01"
                {...register('price', { required: 'Price is required', min: { value: 1, message: 'Must be > 0' } })} placeholder="299.00" />
              {errors.price && <span className="form-error">{errors.price.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">MRP (₹)</label>
              <input className="form-input" type="number" step="0.01"
                {...register('originalPrice')} placeholder="399.00" />
              <span className="form-hint">For showing discount</span>
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input className={`form-input ${errors.stock ? 'error' : ''}`} type="number"
                {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } })} placeholder="50" />
              {errors.stock && <span className="form-error">{errors.stock.message}</span>}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={sectionTitle}>Classification</h2>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Stream</label>
              <select className="form-input" {...register('stream')}>
                <option value="">-- Select Stream --</option>
                {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Grade / Class</label>
              <select className="form-input" {...register('grade')}>
                <option value="">-- Select Grade --</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select className="form-input" {...register('subject')}>
                <option value="">-- Select Subject --</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" {...register('category')}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={sectionTitle}>Book Details</h2>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Publisher</label>
              <input className="form-input" {...register('publisher')} placeholder="NCERT" />
            </div>
            <div className="form-group">
              <label className="form-label">Published Year</label>
              <input className="form-input" {...register('publishedYear')} placeholder="2023" />
            </div>
            <div className="form-group">
              <label className="form-label">Language</label>
              <input className="form-input" {...register('language')} placeholder="English" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={sectionTitle}>Images</h2>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" {...register('coverImageUrl')} placeholder="https://..." />
            <span className="form-hint">Paste a direct link to the book cover image</span>
          </div>
        </div>

        <div className="card">
          <h2 style={sectionTitle}>Listing Options</h2>
          <div className="grid-2">
            <label style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }}>
              <input type="checkbox" value="true" {...register('comingSoon')} style={{ width: 18, height: 18 }} />
              <div>
                <div style={{ fontWeight: 600 }}>Mark as Coming Soon</div>
                <div style={{ fontSize: '.78rem', color: '#64748b' }}>Won't be available for purchase</div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
            style={{ justifyContent: 'center', flex: 1 }}>
            {loading ? 'Publishing...' : 'Publish Book'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/seller')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

const sectionTitle = { fontWeight: 800, fontSize: '.95rem', marginBottom: '1.25rem', color: '#1e293b' }
