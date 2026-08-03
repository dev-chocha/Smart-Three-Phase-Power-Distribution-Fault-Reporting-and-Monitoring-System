import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiPower, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2 rounded-lg text-slate-900">
            <FiPower className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wide block leading-none">SmartGrid</span>
            <span className="text-xs text-slate-400">Power Distribution Portal</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-full text-sm">
              <FiUser className="text-amber-400" />
              <span>{user.name}</span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full capitalize">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-sm px-3.5 py-1.5 rounded-md transition-all font-medium"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;