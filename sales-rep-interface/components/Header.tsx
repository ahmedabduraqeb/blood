'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function Header() {
  const { currentUser, users, setCurrentUser } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Navigation Menus */}
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Orders
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Reports
            </a>
          </nav>

          {/* Center: Logo and Site Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OrderHub Pro
            </h1>
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center space-x-3">
            {currentUser && (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
                </div>
                <div className="relative group">
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer hover:border-purple-500 transition-colors"
                  />
                  {/* User Switcher Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <p className="text-xs text-gray-500 px-3 py-2 font-semibold">Switch User</p>
                      {users.filter(u => u.role === 'sales_rep').map(user => (
                        <button
                          key={user.id}
                          onClick={() => setCurrentUser(user)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors ${
                            currentUser.id === user.id ? 'bg-blue-100' : ''
                          }`}
                        >
                          <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
