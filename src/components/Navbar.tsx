/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, Building, Layers, Settings, LogIn, Bell } from 'lucide-react';
import { UserRole, Category } from '../types';
import { StateEngine } from '../data/seedData';

interface NavbarProps {
  currentRole: UserRole;
  cartCount: number;
  wishlistCount: number;
  onNavigate: (view: string) => void;
  activeView: string;
  onSearch: (term: string, category: string, mode: 'ALL' | 'RETAIL' | 'WHOLESALE') => void;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  activeNotificationsCount: number;
}

export default function Navbar({
  currentRole,
  cartCount,
  wishlistCount,
  onNavigate,
  activeView,
  onSearch,
  onOpenCart,
  onOpenNotifications,
  activeNotificationsCount
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [sellMode, setSellMode] = useState<'ALL' | 'RETAIL' | 'WHOLESALE'>('ALL');
  const categories = StateEngine.getCategories();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedCat, sellMode);
    onNavigate('products');
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('', 'All', 'ALL');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Upper Navigation Rail */}
      <div className="bg-slate-50 border-b border-slate-200 py-1.5 px-4 md:px-8 text-xs text-slate-500 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-blue-600">Call Support:</span> +91 1800 555 9999
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline">India's Premier B2B & B2C Open Marketplace</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => onNavigate('about')} className="hover:text-blue-600 transition-colors cursor-pointer">About Platform</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-blue-600 transition-colors cursor-pointer">Support Helpdesk</button>
          {currentRole !== 'CUSTOMER' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
              Go to Portal Panel
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="py-4 px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { clearSearch(); onNavigate('home'); }}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-800 block leading-none">VendorHub</span>
            <span className="text-[9px] font-mono text-orange-600 tracking-widest uppercase font-bold">Vibrant Palette</span>
          </div>
        </div>

        {/* Dynamic Search System */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-2xl items-center bg-slate-100 rounded-full px-4 py-1 border border-transparent focus-within:bg-white focus-within:border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all w-96">
          <div className="px-1 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search vendors, orders, or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 border-none"
          />
          
          {/* Sell Type Selector */}
          <select
            value={sellMode}
            onChange={(e) => setSellMode(e.target.value as any)}
            className="bg-transparent border-l border-slate-200 py-1.5 px-3 text-xs text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Trading</option>
            <option value="RETAIL">Retail Only</option>
            <option value="WHOLESALE">Wholesale Only</option>
          </select>

          {/* Category Filter dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-200/50 border-l border-slate-200 py-1.5 px-3 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer rounded-r-full"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 py-2 rounded-full ml-2 transition-colors cursor-pointer">
            Search
          </button>
        </form>

        {/* User Interaction Icons */}
        <div className="flex items-center gap-1.5 md:gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 cursor-pointer transition-all ${
              activeView === 'dashboard' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentRole === 'ADMIN' ? 'Admin Panel' : currentRole === 'VENDOR' ? 'Vendor Portal' : 'My Dashboard'}
          </button>

          {/* Compact Search Trigger for Mobile */}
          <button
            onClick={() => onNavigate('products')}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications Indicator */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
          >
            <Bell className="h-5.5 w-5.5" />
            {activeNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
          >
            <Heart className="h-5.5 w-5.5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-bold rounded-full text-[9px] h-4 w-4 flex flex-center items-center justify-center border border-white animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Basket Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-xl flex items-center gap-1.5 ml-1 cursor-pointer transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-bold text-xs">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Categories Toolbar Panel */}
      <nav className="border-t border-slate-200 bg-white py-2 px-4 md:px-8 flex gap-5 overflow-x-auto scrollbar-none text-xs font-semibold text-slate-600">
        <button
          onClick={() => { clearSearch(); onNavigate('home'); }}
          className={`hover:text-blue-600 cursor-pointer whitespace-nowrap transition-colors ${activeView === 'home' ? 'text-blue-600 font-bold' : ''}`}
        >
          Homepage Catalog
        </button>
        <button
          onClick={() => { onSearch('', 'All', 'ALL'); onNavigate('products'); }}
          className={`hover:text-blue-600 cursor-pointer whitespace-nowrap transition-colors ${activeView === 'products' ? 'text-blue-600 font-bold' : ''}`}
        >
          Browse Infinite Products
        </button>
        <div className="h-4 w-[1px] bg-slate-200 self-center"></div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { onSearch('', cat.name, 'ALL'); onNavigate('products'); }}
            className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            {cat.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
