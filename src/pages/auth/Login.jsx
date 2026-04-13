import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data.email, data.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      if (user.role === 'ADMIN')  return navigate('/admin')
      if (user.role === 'SELLER') return navigate('/seller')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logo}>📚</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.sub}>Sign in to your BookStore account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${errors.password ? 'error' : ''}`}
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }}
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}><span>Demo accounts</span></div>
        <div style={styles.demoHint}>
          <div><strong>Buyer:</strong> buyer@demo.com / password123</div>
          <div><strong>Seller:</strong> seller@demo.com / password123</div>
          <div><strong>Admin:</strong> admin@demo.com / password123</div>
        </div>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '2.5rem', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,.08)' },
  logoArea: { textAlign: 'center', marginBottom: '1.75rem' },
  logo: { fontSize: '2.5rem', marginBottom: '.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' },
  sub: { color: '#64748b', fontSize: '.9rem', marginTop: '.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' },
  divider: {
    textAlign: 'center', margin: '1.25rem 0 .75rem',
    position: 'relative', color: '#94a3b8', fontSize: '.8rem',
  },
  demoHint: { background: '#f8fafc', borderRadius: 8, padding: '.75rem 1rem', fontSize: '.8rem', color: '#475569', lineHeight: 1.8 },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '.875rem', color: '#64748b' },
}
