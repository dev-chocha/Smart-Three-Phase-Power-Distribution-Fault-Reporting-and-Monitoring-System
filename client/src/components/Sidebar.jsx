import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FiGrid,
  FiAlertTriangle,
  FiList,
  FiZap,
  FiCalendar,
  FiCheckSquare,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const citizenLinks = [
    { name: 'Dashboard', path: '/citizen/dashboard', icon: FiGrid },
    { name: 'Report Fault', path: '/citizen/report-fault', icon: FiAlertTriangle },
    { name: 'My Fault Reports', path: '/citizen/my-faults', icon: FiList },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Manage Complaints', path: '/admin/faults', icon: FiCheckSquare },
    { name: 'Grid Control & Schedule', path: '/admin/power-schedule', icon: FiZap },
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="space-y-1.5">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;