import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import CategoryPage from './pages/CategoryPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import WishlistPage from './pages/WishlistPage';
import NavBar from './components/NavBar';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* HomePage — No NavBar */}
            <Route path="/" element={<HomePage />} />

            {/* Routes with NavBar */}
            <Route path="/product/:id" element={<><NavBar /><ProductDetailsPage /></>} />
            <Route path="/login" element={<><NavBar /><LoginPage /></>} />
            <Route path="/register" element={<><NavBar /><RegisterPage /></>} />
            <Route path="/category/:categoryName" element={<><NavBar /><CategoryPage /></>} />
            <Route path="/orders" element={<><NavBar /><MyOrdersPage /></>} />
            <Route path="/forgot-password" element={<><NavBar /><ForgotPasswordPage /></>} />
            <Route path="/update-password" element={<><NavBar /><UpdatePasswordPage /></>} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/wishlist" element={<><NavBar /><WishlistPage /></>} />

            {/* Protected route: Customer/Artisan/Admin can access cart */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
                  <>
                    <NavBar />
                    <CartPage />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <>
                    <NavBar />
                    <AdminDashboard />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Artisan only */}
            <Route
              path="/artisan/dashboard"
              element={
                <ProtectedRoute allowedRoles={['artisan']}>
                  <>
                    <NavBar />
                    <ArtisanDashboard />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
