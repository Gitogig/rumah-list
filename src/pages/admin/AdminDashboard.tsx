import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Users, Building, DollarSign, AlertCircle, TrendingUp,
  Moon, Sun, Menu, X, Bell, Settings, LogOut, Search, TrendingDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyService } from '../../lib/propertyService';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import Chart from '../../components/admin/Chart';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalSellers: 0,
    pendingApprovals: 0,
    activeListings: 0,
    suspendedProperties: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0,
    newPropertiesThisMonth: 0,
    propertyGrowthPercentage: 0,
    userGrowthPercentage: 0,
    approvalChangePercentage: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time subscriptions
    const propertiesSubscription = PropertyService.subscribeToProperties(() => {
      loadDashboardData();
    });

    const usersSubscription = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      propertiesSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load admin statistics
      const stats = await PropertyService.getAdminStats();
      setAdminStats(stats);

      // Load recent properties
      const properties = await PropertyService.getProperties({ status: undefined });
      setRecentProperties(properties.slice(0, 5));

      // Load recent users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (usersError) throw usersError;
      setRecentUsers(users || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Listings',
      value: adminStats.totalProperties.toString(),
      change: `${adminStats.propertyGrowthPercentage >= 0 ? '+' : ''}${adminStats.propertyGrowthPercentage}%`,
      changeType: adminStats.propertyGrowthPercentage >= 0 ? 'positive' as const : 'negative' as const,
      icon: Building
    },
    {
      title: 'Total Users',
      value: adminStats.totalUsers.toLocaleString(),
      change: `${adminStats.userGrowthPercentage >= 0 ? '+' : ''}${adminStats.userGrowthPercentage}%`,
      changeType: adminStats.userGrowthPercentage >= 0 ? 'positive' as const : 'negative' as const,
      icon: Users
    },
    {
      title: 'Monthly Revenue',
      value: `RM ${(adminStats.monthlyRevenue / 1000).toFixed(0)}K`,
      change: '+23%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'Pending Approvals',
      value: adminStats.pendingApprovals.toString(),
      change: `${adminStats.approvalChangePercentage >= 0 ? '+' : ''}${adminStats.approvalChangePercentage}%`,
      changeType: adminStats.approvalChangePercentage <= 0 ? 'positive' as const : 'negative' as const,
      icon: AlertCircle
    }
  ];

  const chartData = [
    { name: 'Jan', revenue: 65000, listings: 45, users: 1200 },
    { name: 'Feb', revenue: 78000, listings: 52, users: 1350 },
    { name: 'Mar', revenue: 90000, listings: 61, users: 1500 },
    { name: 'Apr', revenue: 95000, listings: 58, users: 1650 },
    { name: 'May', revenue: 110000, listings: 67, users: 1800 },
    { name: 'Jun', revenue: adminStats.monthlyRevenue, listings: adminStats.totalProperties, users: adminStats.totalUsers },
  ];

  if (isLoading) {
    return (
      <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {user?.name}. Here's what's happening with RumahList.my today.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button 
              onClick={loadDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Data
            </button>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} isDarkMode={isDarkMode} />
          ))}
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {adminStats.activeListings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Listings</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {adminStats.totalSellers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Sellers</div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {adminStats.suspendedProperties}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Suspended</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Trend
            </h3>
            <Chart data={chartData} dataKey="revenue" isDarkMode={isDarkMode} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Growth
            </h3>
            <Chart data={chartData} dataKey="users" isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Listings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Listings
              </h3>
              <Link 
                to="/admin/listings"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentProperties.map((listing) => (
                <div key={listing.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images.find(img => img.is_featured)?.image_url || listing.images[0].image_url}
                      alt={listing.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {listing.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {listing.city}, {listing.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      RM {listing.price.toLocaleString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      listing.listing_type === 'rent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {listing.listing_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Users
              </h3>
              <Link 
                to="/admin/users"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'seller' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : user.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/listings"
              className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Building className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Manage Listings
              </span>
            </Link>
            <Link
              to="/admin/users"
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Manage Users
              </span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                View Reports
              </span>
            </Link>
            <Link
              to="/admin/support"
              className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Support Center
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;