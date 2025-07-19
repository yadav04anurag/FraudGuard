import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, Shield, Link, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const baseLinkClass = "flex items-center px-4 py-2.5 my-1 rounded-lg transition-colors";
  const activeLinkClass = "bg-indigo-600 text-white";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

  const getLinkClass = ({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

  const adminLinks = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Shield size={20} />, text: 'Fraud Apps', path: '/admin/apps' },
    { icon: <Link size={20} />, text: 'Fraud URLs', path: '/admin/urls' },
    { icon: <User size={20} />, text: 'Users', path: '/admin/users' },
  ];

  const userLinks = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/dashboard' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col flex-shrink-0">
      <div className="p-5 text-2xl font-bold border-b border-gray-700 flex items-center">
        <Shield size={28} className="mr-3 text-indigo-400"/> FraudGuard
      </div>
      <nav className="flex-grow p-4">
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} className={getLinkClass}>
            {link.icon}
            <span className="ml-4 font-medium">{link.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="mb-4">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition-colors">
          <LogOut size={20} />
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;