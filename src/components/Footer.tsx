/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Award, Truck, BadgePercent } from 'lucide-react';

export default function Footer() {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail) {
      setSubscribed(true);
      setNewsEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16 border-t border-gray-800">
      {/* Guarantees Section */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-500 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Verified Vendors</h4>
              <p className="text-xs text-gray-400 mt-1">Every business is audited and background verified with active regulatory licenses.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="h-6 w-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Integrated Logistics</h4>
              <p className="text-xs text-gray-400 mt-1">Fast, trackable delivery networks spanning over 19,000 pincodes across India.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-amber-500 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Wholesale Protections</h4>
              <p className="text-xs text-gray-400 mt-1">Escrow payment mechanisms. Releases funds only upon physical quality confirmation.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BadgePercent className="h-6 w-6 text-rose-500 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Commercial Prices</h4>
              <p className="text-xs text-gray-400 mt-1">Direct from factory rates. Substantial price cuts for larger Volume orders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Footer Links */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded font-black text-sm">VH</div>
            <span className="text-lg font-bold text-white tracking-tight">VendorHub</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            VendorHub is a state-of-the-art multi-vendor B2B/B2C marketplace that unites local and international commercial manufacturers, wholesalers, and retail buyers under a secure, lightning-fast digital storefront.
          </p>
          <div className="flex gap-2 text-xs">
            <span className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded cursor-pointer text-gray-200 transition-colors">Android App</span>
            <span className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded cursor-pointer text-gray-200 transition-colors">iOS App</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-200 mb-4">Marketplace Channels</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer transition-colors">Wholesale Business Trade</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Retail Global E-Store</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Factory Supplier Catalogs</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Special Bulk Offers Directory</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Sponsored Banner Directory</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-200 mb-4">Corporate Links</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer transition-colors">Company Information</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Careers & Internship Logs</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Vendor Registration Form</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Investor Relations & Capital</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Platform Engineering Blogs</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-200 mb-4">Business Newsletter</h4>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Subscribe to receive direct inventory pricing guides, premium wholesale offers, and regulatory compliance updates.
          </p>
          {subscribed ? (
            <div className="bg-emerald-950/45 border border-emerald-900/30 text-emerald-400 rounded p-2 text-xs font-semibold">
              Thank you! You are now subscribed to Trade Alerts.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-1.5 overflow-hidden">
              <input
                type="email"
                required
                placeholder="Enter business email..."
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-xs px-3 py-2 rounded focus:outline-hidden focus:border-blue-500 text-white w-full"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors flex items-center shrink-0 cursor-pointer"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sub-Footer claims */}
      <div className="border-t border-gray-800 py-6 px-4 md:px-8 bg-gray-950 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 VendorHub Technologies Limited. All corporate rights reserved.</p>
          <div className="flex gap-5">
            <span className="hover:underline cursor-pointer">Security Code of Conduct</span>
            <span className="hover:underline cursor-pointer">Wholesale Legal Guidelines</span>
            <span className="hover:underline cursor-pointer">State Trade Licenses</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
