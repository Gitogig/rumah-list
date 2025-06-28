import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  logo?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, title, logo }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      {(logo || title) && (
        <div className="p-6 border-b border-gray-200">
          {logo || (
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          )}
        </div>
      )}
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;