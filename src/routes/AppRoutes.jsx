import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layout
import Navbar  from '../components/common/Navbar'
import Footer  from '../components/common/Footer'
import Loader  from '../components/common/Loader'

// Auth pages
import Login    from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Buyer pages
import Home          from '../pages/buyer/Home'
import BookList      from '../pages/buyer/BookList'
import BookDetail    from '../pages/buyer/BookDetail'
import Cart          from '../pages/buyer/Cart'
import Checkout      from '../pages/buyer/Checkout'
import Payment       from '../pages/buyer/Payment'
import OrderHistory  from '../pages/buyer/OrderHistory'
import OrderDetail   from '../pages/buyer/OrderDetail'
import Wishlist      from '../pages/buyer/Wishlist'
import StudySchedule from '../pages/buyer/StudySchedule'

// Seller pages
import SellerDashboard  from '../pages/seller/SellerDashboard'
import AddBook          from '../pages/seller/AddBook'
import EditBook         from '../pages/seller/EditBook'
import ManageInventory  from '../pages/seller/ManageInventory'
import SellerOrders     from '../pages/seller/SellerOrders'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsers    from '../pages/admin/ManageUsers'
import ManageBooks    from '../pages/admin/ManageBooks'

// Route guards
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <Loader />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function RoleRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/books"     element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />

          {/* Buyer */}
          <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/payment"  element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/orders"   element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/study-schedule" element={<PrivateRoute><StudySchedule /></PrivateRoute>} />

          {/* Seller */}
          <Route path="/seller" element={
            <RoleRoute roles={['SELLER']}><SellerDashboard /></RoleRoute>
          } />
          <Route path="/seller/books/add" element={
            <RoleRoute roles={['SELLER']}><AddBook /></RoleRoute>
          } />
          <Route path="/seller/books/:id/edit" element={
            <RoleRoute roles={['SELLER']}><EditBook /></RoleRoute>
          } />
          <Route path="/seller/inventory" element={
            <RoleRoute roles={['SELLER']}><ManageInventory /></RoleRoute>
          } />
          <Route path="/seller/orders" element={
            <RoleRoute roles={['SELLER']}><SellerOrders /></RoleRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute roles={['ADMIN']}><ManageUsers /></RoleRoute>
          } />
          <Route path="/admin/books" element={
            <RoleRoute roles={['ADMIN']}><ManageBooks /></RoleRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
