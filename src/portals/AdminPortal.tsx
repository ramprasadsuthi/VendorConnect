/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield, CheckCircle2, XCircle, Users, Package, AlertCircle, TrendingUp, 
  Tag, Percent, Layers, HelpCircle, Download, FileSpreadsheet, PercentSquare, Play
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, Cell
} from 'recharts';
import { Product, Vendor, Category, Coupon, Advertisement, SubCategory } from '../types';
import { StateEngine } from '../data/seedData';

interface AdminPortalProps {
  onNavigate: (view: string) => void;
}

export default function AdminPortal({
  onNavigate
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'SANDBOX' | 'VENDORS' | 'PRODUCTS' | 'CATEGORIES' | 'COUPONS' | 'PROMOTIONS' | 'REPORTS'>('SANDBOX');

  // Load state listings
  const vendors = StateEngine.getVendors();
  const products = StateEngine.getProducts();
  const categories = StateEngine.getCategories();
  const subCategories = StateEngine.getSubCategories();
  const coupons = StateEngine.getCoupons();
  const ads = StateEngine.getAdvertisements();
  const orders = StateEngine.getOrders();

  // Categories CRUD form state
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');

  // Coupon creator form state
  const [showCpnForm, setShowCpnForm] = useState(false);
  const [cpnCode, setCpnCode] = useState('');
  const [cpnType, setCpnType] = useState<'FLAT' | 'PERCENTAGE'>('PERCENTAGE');
  const [cpnVal, setCpnVal] = useState(10);
  const [cpnMin, setCpnMin] = useState(1000);
  const [cpnDesc, setCpnDesc] = useState('');

  // Commission configurations states
  const [globalCommission, setGlobalCommission] = useState(8); // 8% Default commission
  const [selectedRepType, setSelectedRepType] = useState<'SALES' | 'INVENTORY' | 'SUBSCRIBERS'>('SALES');

  // Math KPI details
  const totalRevenueVal = orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0);
  const platformCommissions = Number((totalRevenueVal * (globalCommission / 100)).toFixed(2));
  const activeVendorsCount = vendors.filter(v => v.status === 'APPROVED').length;
  const pendingVendorsCount = vendors.filter(v => v.status === 'PENDING').length;
  const pendingApprovalProdsCount = products.filter(p => p.status === 'PENDING_APPROVAL').length;

  // Actions: Vendor approvals
  const handleVendorApproval = (id: string, status: Vendor['status']) => {
    StateEngine.updateVendorStatus(id, status);
    alert(`Vendor status updated successfully to "${status}"`);
    window.location.reload();
  };

  // Actions: Product approvals
  const handleProductApproval = (id: string, status: Product['status']) => {
    StateEngine.updateProductStatus(id, status);
    alert(`Product status updated successfully to "${status}"`);
    window.location.reload();
  };

  // Actions: Create Category CRUD
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      description: catDesc,
      image: catImg || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
    };

    StateEngine.saveCategory(newCat);
    setShowCatForm(false);
    setCatName('');
    setCatDesc('');
    setCatImg('');
    alert('Category created successfully.');
  };

  // Actions: Create Coupons
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpnCode) return;

    const newCpn: Coupon = {
      id: `cpn-${Date.now()}`,
      code: cpnCode.toUpperCase().trim(),
      type: cpnType,
      value: Number(cpnVal),
      minOrderValue: Number(cpnMin),
      expiryDate: '2026-12-31',
      isActive: true,
      description: cpnDesc || `Get ${cpnVal} off on platform orders.`
    };

    StateEngine.saveCoupon(newCpn);
    setShowCpnForm(false);
    setCpnCode('');
    setCpnDesc('');
    alert('Discount coupon generated successfully.');
  };

  // CSV Exporter Mock download engine
  const handleDownloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (selectedRepType === 'SALES') {
      csvContent += "Order ID,Order Number,Date,Customer,Subtotal,GST Amount,Total,Payment method,Status\n";
      orders.forEach(o => {
        csvContent += `${o.id},${o.orderNumber},${o.createdAt.split('T')[0]},"${o.customerName}",${o.subtotal},${o.gstAmount},${o.total},${o.paymentMethod},${o.orderStatus}\n`;
      });
    } else if (selectedRepType === 'INVENTORY') {
      csvContent += "Product ID,SKU,Name,Vendor Name,Available Qty,Sold Qty,Wholesale price,Retail price\n";
      products.forEach(p => {
        csvContent += `${p.id},${p.sku},"${p.name}","${p.vendorName}",${p.availableQuantity},${p.soldQuantity},${p.wholesalePrice},${p.retailPrice}\n`;
      });
    } else {
      csvContent += "Vendor Name,Plan,Start Date,End Date,Status,Price\n";
      vendors.forEach(v => {
        const sub = StateEngine.getVendorSubscription(v.id);
        csvContent += `"${v.businessName}",${sub.planId},${sub.startDate},${sub.endDate},${sub.status},${sub.planId === 'starter' ? '999' : sub.planId === 'professional' ? '2999' : '9999'}\n`;
      });
    }

    const encodeUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodeUri);
    link.setAttribute("download", `vendorhub_report_${selectedRepType.toLowerCase()}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recharts Dashboard Mock trends
  const analyticsData = [
    { label: 'Jan', revenue: 14000, com: 1100 },
    { label: 'Feb', revenue: 22000, com: 1760 },
    { label: 'Mar', revenue: 35000, com: 2800 },
    { label: 'Apr', revenue: 47000, com: 3760 },
    { label: 'May', revenue: 64000, com: 5120 },
    { label: 'Jun', revenue: 98000, com: 7840 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Layout */}
      <aside className="lg:col-span-1 border border-slate-200 bg-white p-5 rounded-3xl space-y-4 h-fit shadow-xs">
        <div className="border-b border-slate-100 pb-4 text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800 leading-none">Security Admin Hub</h2>
          <span className="text-[10px] text-slate-400 block font-mono">Role: ROOT_PLATFORM_ADMIN</span>
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-800 text-[9px] uppercase px-2 py-0.5 rounded-full font-bold mt-2">
            Active RBAC Control
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 text-xs text-slate-700">
          <button
            onClick={() => setActiveTab('SANDBOX')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'SANDBOX' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><TrendingUp className="h-4.5 w-4.5 text-slate-450" /> Analytics Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('VENDORS')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'VENDORS' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Users className="h-4.5 w-4.5 text-slate-450" /> Vendor Audits</span>
            {pendingVendorsCount > 0 && <span className="bg-amber-100 text-amber-800 px-1.5 rounded font-black font-mono">{pendingVendorsCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'PRODUCTS' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Package className="h-4.5 w-4.5 text-slate-450" /> Product Approvals</span>
            {pendingApprovalProdsCount > 0 && <span className="bg-amber-100 text-amber-800 px-1.5 rounded font-black font-mono">{pendingApprovalProdsCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('CATEGORIES')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'CATEGORIES' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Layers className="h-4.5 w-4.5 text-slate-450" /> Category Manager</span>
            <span className="bg-slate-100 text-slate-500 font-mono px-1.5 rounded">{categories.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('COUPONS')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'COUPONS' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Tag className="h-4.5 w-4.5 text-slate-450" /> Coupon Generator</span>
            <span className="bg-slate-100 text-slate-500 font-mono px-1.5 rounded">{coupons.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('PROMOTIONS')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'PROMOTIONS' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><PercentSquare className="h-4.5 w-4.5 text-slate-450" /> Sponsored Placements</span>
            <span className="bg-emerald-50 text-emerald-800 font-mono px-1.5 rounded">{ads.length} Ads</span>
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'REPORTS' ? 'bg-rose-50 text-rose-600' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Download className="h-4.5 w-4.5" /> CSV Exporter</span>
          </button>
        </nav>
      </aside>

      {/* Primary detail view panel */}
      <main className="lg:col-span-3 space-y-6">

        {/* ==========================================
            SUB-VIEW: CENTRAL ANALYTICS DASHBOARD
           ========================================== */}
        {activeTab === 'SANDBOX' && (
          <div className="space-y-6">
            {/* KPI Cards top row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-emerald-500 text-xs font-bold font-mono">+12.5%</span>
                </div>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Revenue Pool</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">₹{totalRevenueVal.toFixed(2)}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                    <PercentSquare className="w-5 h-5" />
                  </div>
                  <span className="text-purple-500 text-xs font-bold font-mono">Commission</span>
                </div>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Platform Commission</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">₹{platformCommissions}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-blue-500 text-xs font-bold font-mono">Active</span>
                </div>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Verified Partners</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">{activeVendorsCount} Suppliers</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-amber-500 text-xs font-bold font-mono">Pending</span>
                </div>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pending items</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">{pendingVendorsCount + pendingApprovalProdsCount} items</p>
              </div>
            </div>

            {/* Interactive Commission Configuration Slider */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Configure Platform commission Fee</h3>
                <span className="bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded text-xs">{globalCommission}% Standard</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Platform commissions override default margins. Setting dynamic ratios applies directly during customer basket checkouts to raise company revenue streams.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={globalCommission}
                  onChange={(e) => setGlobalCommission(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[10px] font-mono text-gray-500 font-bold">Limit: 25% Max</span>
              </div>
            </div>

            {/* Recharts Area Plotting chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Monthly Revenue Growth Matrix</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="label" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Platform Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#adminGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: VENDOR VERIFICATION QUEUES
           ========================================== */}
        {activeTab === 'VENDORS' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Registered Supplier Businesses queue</h2>
              <p className="text-[11px] text-gray-400 mt-1">Review regulatory licenses, verify PAN and bank deposits coordinates, or suspend stores.</p>
            </div>

            <div className="space-y-4">
              {vendors.map((v) => (
                <div key={v.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-start text-xs gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-sm">{v.businessName}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          v.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-705'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-405 font-medium mt-1">
                        Owner: {v.ownerName} | Mobile: {v.mobile} | Email: {v.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Address node: {v.address}, {v.city}, {v.state} - {v.pincode}
                      </p>
                    </div>

                    <div className="bg-white p-3 border border-gray-150 rounded-lg text-xs space-y-1 md:w-64 font-mono select-all">
                      <span className="text-[9px] uppercase font-bold text-gray-405 block">Compliance License Details</span>
                      <p className="text-gray-700"><strong>GSTIN No:</strong> {v.gstNumber || 'NONE'}</p>
                      <p className="text-gray-700"><strong>PAN Card:</strong> {v.panNumber || 'NONE'}</p>
                      <p className="text-gray-700"><strong>Bank Key:</strong> {v.bankAccountDetails?.ifsc || 'NONE'}</p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 justify-end pt-3 border-t border-gray-100 text-xs font-semibold">
                    {v.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleVendorApproval(v.id, 'APPROVED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          Approve Licenses & Store
                        </button>
                        <button
                          onClick={() => handleVendorApproval(v.id, 'REJECTED')}
                          className="border border-rose-200 hover:border-rose-350 text-rose-600 bg-white hover:bg-rose-50 px-3 py-1.5 rounded-md cursor pointer cursor-pointer"
                        >
                          Reject Store Coordinates
                        </button>
                      </>
                    )}
                    {v.status === 'APPROVED' && (
                      <button
                        onClick={() => handleVendorApproval(v.id, 'SUSPENDED')}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-md cursor-pointer"
                      >
                        Suspend Commercial Store
                      </button>
                    )}
                    {v.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleVendorApproval(v.id, 'APPROVED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-md cursor-pointer shadow-xs"
                      >
                        Re-Activate Store
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: PRODUCT VERIFICATION WORKFLOWS
           ========================================== */}
        {activeTab === 'PRODUCTS' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Catalogue Upload reviews workflow</h2>
              <p className="text-[11px] text-gray-400 mt-1">Verify dynamic pricing limits, wholesale MOQs, weight metrics, and approve before public release.</p>
            </div>

            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 flex gap-4 text-xs">
                  <img src={p.images[0]} alt={p.name} className="h-16 w-16 object-cover rounded border border-gray-100 shrink-0" />
                  <div className="flex-1 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">Uploaded by verified supplier: <strong>{p.vendorName}</strong></span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <div className="flex gap-4 items-center pt-2 text-[10px] font-semibold text-gray-500">
                        <span>Wholesale Rate: <strong>₹{p.wholesalePrice}</strong> (MOQ: {p.minimumOrderQuantity})</span>
                        <span>Retail Rate: <strong>₹{p.retailPrice}</strong></span>
                        <span>Stock Limit: <strong>{p.availableQuantity} units</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-100 text-[11px] font-semibold">
                      {p.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleProductApproval(p.id, 'APPROVED')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded cursor-pointer shadow-xs"
                          >
                            Approve Catalog Release
                          </button>
                          <button
                            onClick={() => handleProductApproval(p.id, 'REJECTED')}
                            className="border border-rose-200 text-rose-500 hover:bg-rose-50 px-3 py-1 rounded cursor-pointer"
                          >
                            Reject Layout Specifications
                          </button>
                        </>
                      )}
                      {p.status === 'APPROVED' && (
                        <button
                          onClick={() => handleProductApproval(p.id, 'SUSPENDED')}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1 rounded cursor-pointer"
                        >
                          Suspend Catalogue SKU
                        </button>
                      )}
                      {p.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleProductApproval(p.id, 'APPROVED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1 rounded cursor-pointer shadow-xs"
                        >
                          Re-approve Catalogue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: CATEGORY CRUD MANAGER
           ========================================== */}
        {activeTab === 'CATEGORIES' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Configure Category listings</h2>
                <p className="text-[11px] text-gray-400 mt-1">Settle prime categories, link sub-categories, and config default taxonomy structures.</p>
              </div>
              <button
                onClick={() => setShowCatForm(!showCatForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                Create Category Node
              </button>
            </div>

            {showCatForm && (
              <form onSubmit={handleCreateCategory} className="border border-blue-150 p-4 rounded-xl bg-blue-50/25 space-y-3 text-xs">
                <h3 className="text-xs font-bold text-gray-800">New Category Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase">Category Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Health & Care"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase">Featured Thumbnail URL (Mock)</label>
                    <input
                      type="text"
                      placeholder="Paste image address..."
                      value={catImg}
                      onChange={(e) => setCatImg(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold block uppercase">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Briefly explain what types of products belong under this..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCatForm(false)}
                    className="border border-gray-200 text-gray-650 px-3 py-1.5 rounded cursor-pointer hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-1.5 rounded cursor-pointer"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((c) => {
                const subs = subCategories.filter(s => s.categoryId === c.id);
                return (
                  <div key={c.id} className="border border-gray-100 p-4 rounded-xl bg-gray-50/50 flex gap-4 hover:border-blue-100 transition-all text-xs">
                    <img src={c.image} alt={c.name} className="h-10 w-10 object-cover rounded border" />
                    <div className="space-y-1 flex-1">
                      <h4 className="font-extrabold text-gray-800 text-sm">{c.name}</h4>
                      <p className="text-xs text-gray-550 leading-relaxed">{c.description}</p>
                      
                      {/* Sub-categories labels */}
                      <div className="pt-2">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">Subcategory Profiles Linked:</span>
                        <div className="flex flex-wrap gap-1">
                          {subs.length === 0 ? (
                            <span className="text-[9px] text-gray-450 italic">None configured</span>
                          ) : (
                            subs.map(s => (
                              <span key={s.id} className="bg-white border border-gray-200 text-gray-600 font-mono text-[8.5px] px-1.5 py-0.5 rounded">
                                {s.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: DISCOUNT COUPON GENERATOR
           ========================================== */}
        {activeTab === 'COUPONS' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Active Platform discount coupons</h2>
                <p className="text-[11px] text-gray-400 mt-1">Generate percentage or flat discounts to stimulate high-volume client orders.</p>
              </div>
              <button
                onClick={() => setShowCpnForm(!showCpnForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                Generate Discount Key
              </button>
            </div>

            {showCpnForm && (
              <form onSubmit={handleCreateCoupon} className="border border-blue-150 p-4 rounded-xl bg-blue-50/25 space-y-3 text-xs">
                <h3 className="text-xs font-bold text-gray-800">New Promo Code</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase">Coupon Code String</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SAVEMORE20"
                      value={cpnCode}
                      onChange={(e) => setCpnCode(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden uppercase font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase">Discount Type Method</label>
                    <select
                      value={cpnType}
                      onChange={(e) => setCpnType(e.target.value as any)}
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white cursor-pointer focus:outline-hidden"
                    >
                      <option value="PERCENTAGE">Percentage (%) Discount</option>
                      <option value="FLAT">Flat Rate (₹) Discount</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase">Discount Amount (Value)</label>
                    <input
                      type="number"
                      required
                      value={cpnVal}
                      onChange={(e) => setCpnVal(Number(e.target.value))}
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase">Minimum Purchase Invoice Required (₹)</label>
                    <input
                      type="number"
                      required
                      value={cpnMin}
                      onChange={(e) => setCpnMin(Number(e.target.value))}
                      className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold block uppercase">Coupon Slogan / Label Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief explanation on eligibility, rules..."
                    value={cpnDesc}
                    onChange={(e) => setCpnDesc(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCpnForm(false)}
                    className="border border-gray-200 text-gray-650 px-3 py-1.5 rounded cursor-pointer hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-1.5 rounded cursor-pointer"
                  >
                    Commit Promotion Code
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="border border-gray-150 p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="bg-gray-200 text-gray-800 font-black font-mono text-sm px-2.5 py-0.5 rounded border border-gray-300 antialiased">
                        {c.code}
                      </span>
                      <span className="text-[9.5px] font-bold text-blue-650 tracking-wider">
                        Expiry Code: {c.expiryDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-relaxed pt-2">
                      {c.description}
                    </p>
                    <p className="text-[10px] font-mono text-gray-405">
                      Min requirements: ₹{c.minOrderValue} | Type: {c.type} Value: {c.value}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-gray-100 text-[10px] font-semibold">
                    <button
                      onClick={() => {
                        StateEngine.deleteCoupon(c.id);
                        window.location.reload();
                      }}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Disable coupon Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: SPONSORED PROMOTIONS (ADS)
           ========================================== */}
        {activeTab === 'PROMOTIONS' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Sponsored Advertisements & Banners</h2>
              <p className="text-[11px] text-gray-400 mt-1">Manage carousel budget parameters, record real-time impressions, and verify clicking ratios.</p>
            </div>

            <div className="space-y-4">
              {ads.map((ad) => {
                const clickThruRatio = Number((ad.clicks / ad.impressions) * 100).toFixed(2);
                return (
                  <div key={ad.id} className="border border-gray-150 p-4 rounded-xl bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <img src={ad.imageUrl} alt={ad.title} className="h-10 w-16 object-cover rounded border" />
                      <div>
                        <span className="bg-blue-50 text-blue-800 text-[8.5px] uppercase font-bold px-1.5 rounded border border-blue-100">
                          {ad.type}
                        </span>
                        <h4 className="font-bold text-gray-800 mt-1">{ad.title}</h4>
                        <p className="text-[10px] text-gray-450 mt-1">Target Resource: {ad.targetId} | Zone budget: ₹{ad.budget}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold md:w-64">
                      <div className="bg-white p-2 border border-gray-150 rounded">
                        <span className="text-[8.5px] text-gray-400 block pb-0.5">Impressions</span>
                        <span className="text-gray-850 font-mono font-black">{ad.impressions}</span>
                      </div>
                      <div className="bg-white p-2 border border-gray-150 rounded">
                        <span className="text-[8.5px] text-gray-400 block pb-0.5">Clicks</span>
                        <span className="text-gray-850 font-mono font-black">{ad.clicks}</span>
                      </div>
                      <div className="bg-white p-2 border border-gray-150 rounded">
                        <span className="text-[8.5px] text-gray-400 block pb-0.5">CTR State</span>
                        <span className="text-emerald-600 font-mono font-black">{clickThruRatio}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: EXPORTER CSV MODULE
           ========================================== */}
        {activeTab === 'REPORTS' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Financial & Operations Report builder</h2>
              <p className="text-[11px] text-gray-400 mt-1">Extract database tables, filter specific margins, and immediately download as pure CSV stream.</p>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-150 max-w-xl space-y-5 text-xs">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold block uppercase">Select database Table target</label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 font-semibold">
                  {[
                    { key: 'SALES', label: 'Commercial Sales Orders' },
                    { key: 'INVENTORY', label: 'Warehouse SKU Inventory' },
                    { key: 'SUBSCRIBERS', label: 'Vendor license subscriptions' }
                  ].map((rep) => (
                    <button
                      key={rep.key}
                      onClick={() => setSelectedRepType(rep.key as any)}
                      className={`p-3 text-center rounded-lg border cursor-pointer transition-all ${
                        selectedRepType === rep.key
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {rep.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-3 border border-gray-150 rounded-lg text-xs space-y-1.5 text-gray-500 font-medium">
                <p>📋 Columns to be structured: {selectedRepType === 'SALES' ? 'ID, Code, Stamp, Customer, Subtotal, GST (18%), Grand Total.' : selectedRepType === 'INVENTORY' ? 'ID, SKU, Name, Business Settle Name, Stock Active, Units Sold.' : 'Store Settle, Tier Price, StartDate, EndDate.'}</p>
                <p>⚡ High-Performance: Built directly onto sandbox arrays. Direct callback trigger securely bypassing server delays.</p>
              </div>

              <button
                onClick={handleDownloadReport}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 text-xs transition-colors shadow-xs"
              >
                <FileSpreadsheet className="h-4.5 w-4.5" /> Initialize Download (.csv)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
