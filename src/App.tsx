import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHR from './pages/admin/AdminHR';
import AdminReports from './pages/admin/AdminReports';
import AdminSupport from './pages/admin/AdminSupport';
import SellerDashboard from './pages/seller/SellerDashboard';
import UserDashboard from './pages/user/UserDashboard';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import FAQPage from './pages/legal/FAQPage';
import ContactPage from './pages/legal/ContactPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/properties" element={<Layout><PropertiesPage /></Layout>} />
            <Route path="/property/:id" element={<Layout><PropertyDetailsPage /></Layout>} />
            <Route path="/login" element={<Layout hideFooter><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout hideFooter><RegisterPage /></Layout>} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['buyer']}>
                <Layout><UserDashboard /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Protected Seller Routes */}
            <Route path="/seller-dashboard" element={
              <ProtectedRoute roles={['seller']}>
                <Layout><SellerDashboard /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/listings" element={
              <ProtectedRoute roles={['admin']}>
                <AdminListings />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/hr" element={
              <ProtectedRoute roles={['admin']}>
                <AdminHR />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute roles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            } />
            <Route path="/admin/support" element={
              <ProtectedRoute roles={['admin']}>
                <AdminSupport />
              </ProtectedRoute>
            } />

            {/* Redirect old seller route */}
            <Route path="/seller/*" element={<Navigate to="/seller-dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;