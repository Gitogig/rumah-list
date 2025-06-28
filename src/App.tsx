import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/common/Layout';
import LoadingState from './components/common/LoadingState';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminListings = lazy(() => import('./pages/admin/AdminListings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminHR = lazy(() => import('./pages/admin/AdminHR'));
const AdminAppearances = lazy(() => import('./pages/admin/AdminAppearances'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'));
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const FAQPage = lazy(() => import('./pages/legal/FAQPage'));
const ContactPage = lazy(() => import('./pages/legal/ContactPage'));

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingState message="Loading page..." />}>
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
                <Route path="/admin/appearances" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminAppearances />
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
            </Suspense>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;