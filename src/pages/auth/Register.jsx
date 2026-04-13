import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [params]  = useSearchParams()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: params.get('role') || 'BUYER' }
  })
  const selectedRole = watch('role')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await registerUser(data)
      if (user.status === 'PENDING_APPROVAL') {
        toast.success('Seller account created! Awaiting admin approval.')
        navigate('/login')
      } else {
        toast.success(`Welcome, ${user.name.split(' ')[0]}!`)
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logo}>📚</div>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.sub}>Join BookStore today</p>
        </div>

        {/* Role selector */}
        <div style={styles.roleRow}>
          {['BUYER', 'SELLER'].map(r => (
            <label key={r} style={{
              ...styles.roleOption,
              ...(selectedRole === r ? styles.roleActive : {})
            }}>
              <input type="radio" value={r} {...register('role')} style={{ display: 'none' }} />
              <span style={{ fontSize: '1.2rem' }}>{r === 'BUYER' ? '🛒' : '📦'}</span>
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{r === 'BUYER' ? 'Buyer' : 'Seller'}</span>
              <span style={{ fontSize: '.75rem', color: '#64748b' }}>
                {r === 'BUYER' ? 'Browse & buy books' : 'List & sell books'}
              </span>
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="John Doe"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })} />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`}
              type="email" placeholder="you@example.com"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input className="form-input" type="tel" placeholder="+91 99999 99999"
              {...register('phone')} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className={`form-input ${errors.password ? 'error' : ''}`}
              type="password" placeholder="Min 8 characters"
              {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          {selectedRole === 'SELLER' && (
            <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '.75rem', fontSize: '.82rem', color: '#713f12' }}>
              Seller accounts require admin approval before you can list books.
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '.25rem' }}
            disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,.08)' },
  logoArea: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: '2.5rem', marginBottom: '.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' },
  sub: { color: '#64748b', fontSize: '.9rem', marginTop: '.25rem' },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' },
  roleOption: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '1rem', borderRadius: 10, border: '2px solid #e2e8f0',
    cursor: 'pointer', transition: 'all .15s', textAlign: 'center',
  },
  roleActive: { border: '2px solid #2563eb', background: '#eff6ff' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' },
  footer: { textAlign: 'center', fontSize: '.875rem', color: '#64748b' },
}
