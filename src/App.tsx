import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load providers and components
const AuthProvider = lazy(() => import('./contexts/AuthContext').then(module => ({ default: module.AuthProvider })));
const LanguageProvider = lazy(() => import('./contexts/LanguageContext').then(module => ({ default: module.LanguageProvider })));
const AppearanceProvider = lazy(() => import('./contexts/AppearanceContext').then(module => ({ default: module.AppearanceProvider })));
const ThemeProvider = lazy(() => import('./contexts/ThemeContext').then(module => ({ default: module.ThemeProvider })));
const Layout = lazy(() => import('./components/common/Layout'));
const LoadingState = lazy(() => import('./components/common/LoadingState'));
const ErrorBoundary = lazy(() => import('./components/common/ErrorBoundary'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));

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
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'));
const AdminAppearances = lazy(() => import('./pages/admin/AdminAppearances'));
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const FAQPage = lazy(() => import('./pages/legal/FAQPage'));
const ContactPage = lazy(() => import('./pages/legal/ContactPage'));

// Simple loading component
const SimpleLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<SimpleLoading />}>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>
              <AppearanceProvider>
                <Router>
                  <Suspense fallback={<SimpleLoading />}>
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
                    <Route path="/admin/appearances" element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminAppearances />
                      </ProtectedRoute>
                    } />

                    {/* Redirect old seller route */}
                    <Route path="/seller/*" element={<Navigate to="/seller-dashboard" replace />} />
                  </Routes>
                  </Suspense>
                </Router>
              </AppearanceProvider>
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;