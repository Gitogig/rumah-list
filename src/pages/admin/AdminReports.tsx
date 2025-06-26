import React, { useState } from 'react';
import { TrendingUp, Download, Calendar, DollarSign, Users, Building } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Chart from '../../components/admin/Chart';

const AdminReports: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const revenueData = [
    { name: 'Jan', revenue: 65000, users: 1200, listings: 45 },
    { name: 'Feb', revenue: 78000, users: 1350, listings: 52 },
    { name: 'Mar', revenue: 90000, users: 1500, listings: 61 },
    { name: 'Apr', revenue: 95000, users: 1650, listings: 58 },
    { name: 'May', revenue: 110000, users: 1800, listings: 67 },
    { name: 'Jun', revenue: 125000, users: 2000, listings: 73 },
  ];

  const customerReports = [
    { id: '1', user: 'Ahmad Rahman', property: 'KLCC Apartment', issue: 'Payment Issue', status: 'Open', date: '2024-01-15' },
    { id: '2', user: 'Sarah Lim', property: 'PJ House', issue: 'Property Dispute', status: 'In Review', date: '2024-01-14' },
    { id: '3', user: 'David Tan', property: 'Bangsar Studio', issue: 'Listing Error', status: 'Closed', date: '2024-01-13' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'Open': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'In Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Closed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track performance and customer feedback
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  RM 125K
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
                <div className="text-xs text-green-600 dark:text-green-400">+23% vs last month</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2,000</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">+11% vs last month</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">73</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New Listings</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">+9% vs last month</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                <div className="text-xs text-amber-600 dark:text-amber-400">+2% vs last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Growth
            </h3>
            <Chart data={revenueData} dataKey="revenue" isDarkMode={isDarkMode} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Growth
            </h3>
            <Chart data={revenueData} dataKey="users" isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Google Analytics Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Website Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">45,678</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Page Views</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">+15% this month</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12,345</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">+8% this month</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">+0.5% this month</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              View Full Analytics
            </button>
          </div>
        </div>

        {/* Customer Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Reports
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {report.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {report.property}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {report.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-amber-600 hover:text-amber-700 mr-3">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;