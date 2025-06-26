import React, { useState } from 'react';
import { Users, UserPlus, MessageCircle, Settings, Crown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminHR: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [employees, setEmployees] = useState([
    { id: '1', name: 'Sarah Admin', email: 'sarah@rumahlist.my', role: 'Admin', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Ahmad Moderator', email: 'ahmad@rumahlist.my', role: 'Moderator', status: 'active', joinDate: '2024-02-01' },
    { id: '3', name: 'Priya Support', email: 'priya@rumahlist.my', role: 'Support', status: 'active', joinDate: '2024-01-20' },
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'moderator'
  });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAdmin,
      role: newAdmin.role.charAt(0).toUpperCase() + newAdmin.role.slice(1),
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, employee]);
    setNewAdmin({ name: '', email: '', role: 'moderator' });
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  return (
    <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              HR Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage team members and administrative access
            </p>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {employees.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Staff</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
                <Crown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {employees.filter(e => e.role === 'Admin').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {employees.filter(e => e.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Admin */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Team Member
          </h3>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
            <select
              value={newAdmin.role}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
            </select>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Member
            </button>
          </form>
        </div>

        {/* Team Members List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.role === 'Admin' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          : employee.role === 'Moderator'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Chat Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Communication
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Slack Integration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Connect team chat</p>
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Connect Slack
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">WhatsApp Business</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Team coordination</p>
              <button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Setup WhatsApp
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Microsoft Teams</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Video meetings</p>
              <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Connect Teams
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHR;