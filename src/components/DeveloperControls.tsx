/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, User, ShoppingBag } from 'lucide-react';
import { UserRole } from '../types';

interface DeveloperControlsProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentUser: { name: string; email: string };
}

export default function DeveloperControls({
  currentRole,
  onChangeRole,
  currentUser
}: DeveloperControlsProps) {
  return (
    <div className="bg-gray-900 text-gray-100 px-4 py-2 flex flex-wrap gap-3 items-center justify-between border-b border-gray-800 text-xs font-mono relative z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-gray-400">Environment:</span>
        <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-200 border border-gray-700 font-semibold flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Active Sandbox Mode
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-400">Acting Profile:</span>
        <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded text-gray-200 border border-gray-700">
          {currentRole === 'ADMIN' && <Shield className="h-3.5 w-3.5 text-blue-400" />}
          {currentRole === 'VENDOR' && <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />}
          {currentRole === 'CUSTOMER' && <User className="h-3.5 w-3.5 text-amber-500" />}
          <span className="font-semibold text-gray-100">{currentUser.name} ({currentRole})</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-400">Switch Role:</span>
        <div className="inline-flex rounded-md shadow-xs bg-gray-800 p-0.5 border border-gray-700">
          <button
            onClick={() => onChangeRole('CUSTOMER')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              currentRole === 'CUSTOMER'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => onChangeRole('VENDOR')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              currentRole === 'VENDOR'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Vendor
          </button>
          <button
            onClick={() => onChangeRole('ADMIN')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              currentRole === 'ADMIN'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Platform Admin
          </button>
        </div>
      </div>
    </div>
  );
}
