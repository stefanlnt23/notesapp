import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  NewspaperIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: HomeIcon },
  { name: 'Blog Posts', path: '/admin/blog', icon: NewspaperIcon },
  { name: 'Services', path: '/admin/services', icon: WrenchScrewdriverIcon },
  { name: 'Projects', path: '/admin/projects', icon: FolderIcon },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // TODO: Implement sign out logic
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-light transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="text-xl font-heading font-bold">
            <span className="gradient-text">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                  isActive
                    ? 'bg-secondary/10 text-secondary'
                    : 'text-gray-400 hover:text-secondary hover:bg-secondary/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 h-8 bg-secondary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="absolute bottom-8 left-4 right-4 flex items-center justify-center space-x-2 px-4 py-2 text-gray-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors duration-300"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-primary-light shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-secondary"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <div className="text-gray-400">
              Welcome back, <span className="text-secondary">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
