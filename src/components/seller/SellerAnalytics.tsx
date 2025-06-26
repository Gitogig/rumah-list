import React from 'react';
import { TrendingUp, Eye, MessageCircle, DollarSign, Building, Users } from 'lucide-react';

const SellerAnalytics: React.FC = () => {
  const stats = [
    {
      title: 'Total Listings',
      value: '12',
      change: '+2 this month',
      changeType: 'positive' as const,
      icon: Building,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Views',
      value: '1,247',
      change: '+18% vs last month',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Inquiries',
      value: '34',
      change: '+5 this week',
      changeType: 'positive' as const,
      icon: MessageCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Revenue',
      value: 'RM 45,000',
      change: '+12% vs last month',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const recentActivity = [
    { action: 'New inquiry for KLCC Apartment', time: '2 hours ago', type: 'inquiry' },
    { action: 'Property viewed 15 times today', time: '4 hours ago', type: 'view' },
    { action: 'Mont Kiara Condo listing approved', time: '1 day ago', type: 'approval' },
    { action: 'Payment received for PJ House', time: '2 days ago', type: 'payment' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
            <div className="text-xs text-green-600 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Analytics chart coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'inquiry' ? 'bg-blue-500' :
                  activity.type === 'view' ? 'bg-green-500' :
                  activity.type === 'approval' ? 'bg-purple-500' :
                  'bg-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;