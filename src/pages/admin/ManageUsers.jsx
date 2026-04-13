import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function ManageUsers() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/users').then(r => setUsers(r.data || [])).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (userId, status) => {
    try {
      await api.patch(`/api/users/${userId}/status`, { status })
      setUsers(u => u.map(user => user.id === userId ? { ...user, status } : user))
      toast.success(`User ${status.toLowerCase().replace('_',' ')}`)
    } catch { toast.error('Action failed') }
  }

  if (loading) return <Loader />

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Manage Users</h1>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Name','Email','Role','Status','Actions'].map(h => (
                <th key={h} style={{ padding: '.75rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '.8rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem', fontWeight: 600 }}>{user.name}</td>
                <td style={{ padding: '.75rem', color: '#64748b' }}>{user.email}</td>
                <td style={{ padding: '.75rem' }}>
                  <span className={`badge ${user.role === 'ADMIN' ? 'badge-red' : user.role === 'SELLER' ? 'badge-blue' : 'badge-green'}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '.75rem' }}>
                  <span className={`badge ${user.status === 'ACTIVE' ? 'badge-green' : user.status === 'PENDING_APPROVAL' ? 'badge-yellow' : 'badge-red'}`}>
                    {user.status?.replace('_',' ')}
                  </span>
                </td>
                <td style={{ padding: '.75rem' }}>
                  <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                    {user.status === 'PENDING_APPROVAL' && (
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(user.id, 'ACTIVE')}>Approve</button>
                    )}
                    {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(user.id, 'SUSPENDED')}>Suspend</button>
                    )}
                    {user.status === 'SUSPENDED' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(user.id, 'ACTIVE')}>Restore</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
