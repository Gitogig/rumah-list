import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPropertyManager from '../../components/admin/AdminPropertyManager';

const AdminListings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <AdminPropertyManager />
    </AdminLayout>
  );
};

export default AdminListings;