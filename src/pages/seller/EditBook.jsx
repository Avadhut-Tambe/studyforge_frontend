import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { bookApi } from '../../api/bookApi'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function EditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading]   = useState(true)
  const [saving,  setSaving]    = useState(false)
  const [deleting,setDeleting]  = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    bookApi.getBook(id).then(r => {
      const b = r.data
      reset({ ...b, price: b.price, originalPrice: b.originalPrice || '', stock: b.stock })
    }).finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await bookApi.updateBook(id, { ...data, price: parseFloat(data.price), stock: parseInt(data.stock) })
      toast.success('Book updated!')
      navigate('/seller')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this book listing? This cannot be undone.')) return
    setDeleting(true)
    try {
      await bookApi.deleteBook(id)
      toast.success('Book deleted')
      navigate('/seller')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Edit Book</h1>
        <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Listing'}
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Title</label>
            <input className="form-input" {...register('title', { required: true })} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Author</label>
              <input className="form-input" {...register('author', { required: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">ISBN</label>
              <input className="form-input" {...register('isbn')} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" step="0.01" {...register('price', { required: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">MRP (₹)</label>
              <input className="form-input" type="number" step="0.01" {...register('originalPrice')} />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input className="form-input" type="number" {...register('stock', { required: true })} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" {...register('coverImageUrl')} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/seller')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
