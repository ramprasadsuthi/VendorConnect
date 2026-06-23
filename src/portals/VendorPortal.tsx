/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Package, DollarSign, Users, TrendingUp, ShoppingBag, Plus, Edit2, 
  Trash2, RefreshCw, Layers, CheckCircle, Clock, AlertTriangle, List, Star
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, Cell
} from 'recharts';
import { Product, Vendor, Order, ProductVariant } from '../types';
import { StateEngine } from '../data/seedData';

interface VendorPortalProps {
  currentVendorId: string;
  onNavigate: (view: string) => void;
}

export default function VendorPortal({
  currentVendorId,
  onNavigate
}: VendorPortalProps) {
  const [activeMenu, setActiveMenu] = useState<'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'INVENTORY' | 'REGISTRATION'>('DASHBOARD');

  // Load context datasets
  const vendors = StateEngine.getVendors();
  const activeVendor = vendors.find(v => v.id === currentVendorId) || vendors[0];
  const allProducts = StateEngine.getProducts();
  const vendorProducts = allProducts.filter(p => p.vendorId === activeVendor.id);
  const allOrders = StateEngine.getOrders();
  const vendorOrders = allOrders.filter(o => o.vendorId === activeVendor.id);

  // Sub-category state selection config
  const subCategories = StateEngine.getSubCategories();

  // Registration Form States
  const [bName, setBName] = useState('');
  const [bType, setBType] = useState<'Retail' | 'Wholesale' | 'Both'>('Both');
  const [ownerN, setOwnerN] = useState('');
  const [gstN, setGstN] = useState('');
  const [panN, setPanN] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vAddress, setVAddress] = useState('');
  const [vCity, setVCity] = useState('');
  const [vState, setVState] = useState('');
  const [vPincode, setVPincode] = useState('');
  const [bHolder, setBHolder] = useState('');
  const [bAccount, setBAccount] = useState('');
  const [bIfsc, setBIfsc] = useState('');
  const [bBank, setBBank] = useState('');
  const [vUpi, setVUpi] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Product Editor Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pFullDesc, setPFullDesc] = useState('');
  const [pCat, setPCat] = useState('Fashion & Apparel');
  const [pSubCat, setPSubCat] = useState('');
  const [pRetail, setPRetail] = useState(500);
  const [pWholesale, setPWholesale] = useState(250);
  const [pMoq, setPMoq] = useState(50);
  const [pQty, setPQty] = useState(100);
  const [pLowStock, setPLowStock] = useState(15);
  const [pWeight, setPWeight] = useState(0.5);
  const [pTags, setPTags] = useState('');

  // Handle Vendor Registration Submit
  const handleRegisterVendor = (e: React.FormEvent) => {
    e.preventDefault();

    const newVendor: Vendor = {
      id: `vnd-reg-${Date.now()}`,
      userId: 'usr-vendor-new',
      businessName: bName,
      businessType: bType,
      ownerName: ownerN,
      gstNumber: gstN,
      panNumber: panN,
      email: vEmail,
      mobile: vPhone,
      address: vAddress,
      city: vCity,
      state: vState,
      country: 'India',
      pincode: vPincode,
      bankAccountDetails: {
        holder: bHolder,
        accountNumber: bAccount,
        ifsc: bIfsc,
        bankName: bBank
      },
      upiId: vUpi,
      status: 'PENDING', // Initial Status is Pending Approval
      createdAt: new Date().toISOString()
    };

    StateEngine.saveVendor(newVendor);
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setActiveMenu('DASHBOARD');
      window.location.reload();
    }, 4000);
  };

  // Create or update Products
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `prd-${Date.now()}`,
      vendorId: activeVendor.id,
      vendorName: activeVendor.businessName,
      sku: pSku || `SKU-${Date.now().toString().substring(7)}`,
      name: pName,
      brand: pBrand || 'Generic',
      shortDescription: pShortDesc,
      fullDescription: pFullDesc,
      category: pCat,
      subCategory: pSubCat || 'General',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
      ],
      retailPrice: Number(pRetail),
      wholesalePrice: Number(pWholesale),
      minimumOrderQuantity: Number(pMoq),
      availableQuantity: Number(pQty),
      reservedQuantity: editingProduct ? editingProduct.reservedQuantity : 0,
      soldQuantity: editingProduct ? editingProduct.soldQuantity : 0,
      lowStockThreshold: Number(pLowStock),
      weight: Number(pWeight),
      tags: pTags.split(',').map(t => t.trim()),
      status: 'PENDING_APPROVAL', // Newly registered products require Admin approval
      rating: editingProduct ? editingProduct.rating : 5,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      variants: [],
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    StateEngine.saveProduct(newProduct);
    
    // Create verification notification for Admin
    StateEngine.addNotification({
      id: `ntf-p-reg-${Date.now()}`,
      recipientId: 'ALL_ADMINS',
      title: 'New Product Upload Awaiting Approval',
      message: `Vendor "${activeVendor.businessName}" uploaded a new product "${pName}" which requires validation.`,
      type: 'ALERT',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    setShowProductForm(false);
    setEditingProduct(null);
    clearProductForm();
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPSku(prod.sku);
    setPBrand(prod.brand);
    setPCat(prod.category);
    setPSubCat(prod.subCategory || '');
    setPShortDesc(prod.shortDescription);
    setPFullDesc(prod.fullDescription);
    setPRetail(prod.retailPrice);
    setPWholesale(prod.wholesalePrice);
    setPMoq(prod.minimumOrderQuantity);
    setPQty(prod.availableQuantity);
    setPLowStock(prod.lowStockThreshold);
    setPWeight(prod.weight || 0.5);
    setPTags(prod.tags.join(', '));
    setShowProductForm(true);
  };

  const clearProductForm = () => {
    setPName('');
    setPSku('');
    setPBrand('');
    setPCat('Fashion & Apparel');
    setPSubCat('');
    setPShortDesc('');
    setPFullDesc('');
    setPRetail(500);
    setPWholesale(250);
    setPMoq(50);
    setPQty(100);
    setPLowStock(15);
    setPWeight(0.5);
    setPTags('');
  };

  // Math Analytics totals
  const totalRevenue = vendorOrders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = vendorOrders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'ORDER_PLACED');
  const deliveredOrders = vendorOrders.filter(o => o.orderStatus === 'DELIVERED');

  // Chart datasets
  const mockSalesData = [
    { name: 'Mon', sales: 4200, orders: 3 },
    { name: 'Tue', sales: 9800, orders: 4 },
    { name: 'Wed', sales: 6100, orders: 2 },
    { name: 'Thu', sales: 12500, orders: 7 },
    { name: 'Fri', sales: 8400, orders: 5 },
    { name: 'Sat', sales: 19500, orders: 12 },
    { name: 'Sun', sales: 15400, orders: 9 }
  ];

  const productPerformance = vendorProducts.slice(0, 5).map(p => ({
    name: p.name.substring(0, 10) + '...',
    revenue: p.soldQuantity * (p.minimumOrderQuantity > 1 ? p.wholesalePrice : p.retailPrice)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar navigation */}
      <aside className="lg:col-span-1 border border-slate-200 rounded-3xl p-5 bg-white space-y-4 h-fit shadow-xs">
        <div className="border-b border-slate-100 pb-4 text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner font-extrabold text-base">
            {activeVendor.businessName.substring(0, 2).toUpperCase()}
          </div>
          <h2 className="text-sm font-bold text-slate-800 leading-tight">{activeVendor.businessName}</h2>
          <span className="text-[10px] text-slate-400 block font-mono">ID: {activeVendor.id}</span>
          <div className="pt-2">
            {activeVendor.status === 'APPROVED' ? (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-100 inline-block">
                ✓ STORE APPROVED
              </span>
            ) : activeVendor.status === 'PENDING' ? (
              <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-amber-100 inline-block animate-pulse">
                ⏳ PENDING APPROVAL
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-rose-100 inline-block">
                ⚠ SUSPENDED
              </span>
            )}
          </div>
        </div>

        {activeVendor.status === 'APPROVED' && (
          <nav className="flex flex-col gap-1.5 text-xs text-slate-700">
            <button
              onClick={() => setActiveMenu('DASHBOARD')}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
                activeMenu === 'DASHBOARD' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2"><TrendingUp className="h-4.5 w-4.5 text-slate-450" /> Supplier Dashboard</span>
            </button>
            <button
              onClick={() => setActiveMenu('PRODUCTS')}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
                activeMenu === 'PRODUCTS' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2"><Package className="h-4.5 w-4.5 text-slate-450" /> Product Catalog</span>
              <span className="bg-slate-100 font-mono px-1.5 py-0.5 rounded text-[10px] text-slate-500">{vendorProducts.length}</span>
            </button>
            <button
              onClick={() => setActiveMenu('ORDERS')}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
                activeMenu === 'ORDERS' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2"><ShoppingBag className="h-4.5 w-4.5 text-slate-450" /> Trade Orders</span>
              <span className="bg-blue-100 font-mono px-1.5 py-0.5 rounded text-[10px] text-blue-600 font-bold">{pendingOrders.length}</span>
            </button>
            <button
              onClick={() => setActiveMenu('INVENTORY')}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
                activeMenu === 'INVENTORY' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2"><Layers className="h-4.5 w-4.5 text-slate-450" /> Inventory Logs</span>
              {vendorProducts.filter(p => p.availableQuantity < p.lowStockThreshold).length > 0 && (
                <span className="bg-rose-100 text-rose-700 px-1.5 rounded font-bold">Alerts</span>
              )}
            </button>
          </nav>
        )}

        {/* Action Link: Edit Business Info */}
        <button
          onClick={() => { setActiveMenu('REGISTRATION'); clearProductForm(); }}
          className="w-full text-center border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all mt-4 inline-block"
        >
          {activeVendor.status === 'PENDING' ? 'Modify Registration' : 'Register New Vendor Store'}
        </button>
      </aside>

      {/* Primary Details Panel */}
      <main className="lg:col-span-3 space-y-6">

        {/* LOCKED BLOCK WARNING */}
        {activeVendor.status !== 'APPROVED' && activeMenu !== 'REGISTRATION' && (
          <div className="bg-amber-50 border border-amber-200 p-8 rounded-xl text-center space-y-4 max-w-xl mx-auto mt-8">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
            <h3 className="text-md font-bold text-gray-800 leading-none">Vendor Workspace Locked</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your supplier business registration is currently in **"{activeVendor.status}"** state. Live product uploading, inventory logs, and payment gateways will be active once administrators approve your PAN and GST credentials.
            </p>
            <div className="text-[10px] font-mono bg-amber-100 p-2 text-amber-900 rounded inline-block">
              Tip: Switch to "Platform Admin" using the top bar to review and verify this application.
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: SUPPLIER DASHBOARD (DEFAULT)
           ========================================== */}
        {activeMenu === 'DASHBOARD' && activeVendor.status === 'APPROVED' && (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 font-bold block mb-1">Total Cataloged</span>
                <span className="text-xl font-bold text-gray-850">{vendorProducts.length} SKUs</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 font-bold block mb-1">Delivered Shipments</span>
                <span className="text-xl font-bold text-emerald-600">{deliveredOrders.length} lots</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 font-bold block mb-1">Settled Revenue</span>
                <span className="text-sm font-black text-blue-700">₹{totalRevenue.toFixed(2)}</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 font-bold block mb-1">Subscribers Plan</span>
                <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                  {StateEngine.getVendorSubscription(activeVendor.id).planId} ACTIVE
                </span>
              </div>
            </div>

            {/* Recharts Graphical plots Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-gray-100 rounded-xl p-5">
              {/* Main Line chart */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Dynamic Daily Sales Flow (₹/Lot)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockSalesData}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Area type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Bar Chart */}
              <div className="space-y-4 border-l border-gray-100 pl-4">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Top Products Weight</h3>
                {productPerformance.length === 0 ? (
                  <p className="text-xs text-gray-400 italic pt-12">No transactions recorded yet.</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productPerformance} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                        <XAxis type="number" stroke="#9CA3AF" fontSize={8} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={8} tickLine={false} />
                        <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                          {productPerformance.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? '#3B82F6' : '#10B981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders table */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 border-l-4 border-l-emerald-500 pl-2">Active Order queue</h3>
              
              {vendorOrders.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No incoming orders listed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
                      <tr>
                        <th className="py-2.5 px-3">Order Number</th>
                        <th className="py-2.5 px-3">Recipient Customer</th>
                        <th className="py-2.5 px-3">Shipment Date</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-y-gray-100">
                      {vendorOrders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-gray-800">{o.orderNumber}</td>
                          <td className="py-2.5 px-3 font-semibold">{o.customerName}</td>
                          <td className="py-2.5 px-3">{o.createdAt.split('T')[0]}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-800">₹{o.total}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {o.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: PRODUCT CATALOG MANAGER
           ========================================== */}
        {activeMenu === 'PRODUCTS' && activeVendor.status === 'APPROVED' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Your Product catalog Registry</h2>
                <p className="text-[11px] text-gray-400 mt-1">Manage wholesale pack sizes, retail prices, and publish new designs.</p>
              </div>
              <button
                onClick={() => { setShowProductForm(!showProductForm); setEditingProduct(null); clearProductForm(); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" /> Upload Product
              </button>
            </div>

            {/* Product creator details Form */}
            {showProductForm && (
              <form onSubmit={handleSaveProduct} className="border border-emerald-100 bg-emerald-50/10 p-5 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-gray-800">{editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Product Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 100% Cotton Polo Shirts"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">SKU / Code ID</label>
                    <input
                      type="text"
                      placeholder="e.g. TSH-POLO-01"
                      value={pSku}
                      onChange={(e) => setPSku(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Comforts"
                      value={pBrand}
                      onChange={(e) => setPBrand(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">General Retail Category</label>
                    <select
                      value={pCat}
                      onChange={(e) => setPCat(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                    >
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Electronics & Mobiles">Electronics & Mobiles</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Groceries & Foods">Groceries & Foods</option>
                      <option value="Office & Home Furniture">Office & Home Furniture</option>
                      <option value="Beauty & Wellness">Beauty & Wellness</option>
                      <option value="Sports & Outdoors">Sports & Outdoors</option>
                      <option value="Books & Stationary">Books & Stationary</option>
                      <option value="Automotive & Spares">Automotive & Spares</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Configured Sub-Category</label>
                    <select
                      value={pSubCat}
                      onChange={(e) => setPSubCat(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                    >
                      <option value="">Select subcategory...</option>
                      {subCategories.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Short Slogan Description</label>
                  <input
                    required
                    type="text"
                    placeholder="Short 1-sentence sales slogan pitch..."
                    value={pShortDesc}
                    onChange={(e) => setPShortDesc(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Full Specifications & Description</label>
                  <textarea
                    required
                    placeholder="Provide full details on material grade, thread limits, electronics capacity, certifications..."
                    rows={4}
                    value={pFullDesc}
                    onChange={(e) => setPFullDesc(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Retail price</label>
                    <input
                      type="number"
                      value={pRetail}
                      onChange={(e) => setPRetail(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Wholesale price</label>
                    <input
                      type="number"
                      value={pWholesale}
                      onChange={(e) => setPWholesale(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Minimum Order Qty (MOQ)</label>
                    <input
                      type="number"
                      value={pMoq}
                      onChange={(e) => setPMoq(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Available Stock Qty</label>
                    <input
                      type="number"
                      value={pQty}
                      onChange={(e) => setPQty(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Low Stock alarm Limit</label>
                    <input
                      type="number"
                      value={pLowStock}
                      onChange={(e) => setPLowStock(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Pack Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pWeight}
                      onChange={(e) => setPWeight(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Search tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. cotton, shirts, formal"
                      value={pTags}
                      onChange={(e) => setPTags(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => { setShowProductForm(false); setEditingProduct(null); clearProductForm(); }}
                    className="border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2 rounded-lg cursor-pointer"
                  >
                    Upload and Secure Review
                  </button>
                </div>
              </form>
            )}

            {/* Products grid / list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendorProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden p-4 flex gap-4 hover:border-gray-200 transition-all text-xs"
                >
                  <img src={p.images[0]} alt={p.name} className="h-16 w-16 object-cover rounded border border-gray-100" />
                  <div className="flex-1 flex flex-col justify-between space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">SKU: {p.sku}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-705'
                        }`}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                      <p className="text-[10px] text-gray-550 font-medium">Qty: {p.availableQuantity} in Stock | MOQ: {p.minimumOrderQuantity}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold pt-1 border-t border-gray-50">
                      <span className="font-extrabold text-blue-700">₹{p.wholesalePrice} / ₹{p.retailPrice}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProductClick(p)}
                          className="p-1 border border-gray-100 rounded hover:border-blue-100 hover:text-blue-600 cursor-pointer text-gray-500"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            StateEngine.duplicateProduct(p.id);
                            window.location.reload();
                          }}
                          className="p-1 border border-gray-100 rounded hover:border-blue-100 hover:text-emerald-600 cursor-pointer text-gray-500"
                          title="Duplicate Code SKU"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            StateEngine.deleteProduct(p.id);
                            window.location.reload();
                          }}
                          className="p-1 border border-gray-100 rounded hover:border-rose-100 hover:text-rose-600 cursor-pointer text-gray-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: TRADE ORDERS INCOMING LOGS
           ========================================== */}
        {activeMenu === 'ORDERS' && activeVendor.status === 'APPROVED' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none font-black text-gray-900 pr-5">Active client Orders Processors</h2>
              <p className="text-[11px] text-gray-400 mt-1">Accept commitments, package cargo crates, and dispatch across target freight logs.</p>
            </div>

            {vendorOrders.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No cargo bookings logged in database.</p>
            ) : (
              <div className="space-y-6">
                {vendorOrders.map((o) => (
                  <div key={o.id} className="border border-gray-150 rounded-xl p-4 space-y-4">
                    {/* Header info bar */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center text-xs gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-gray-400 font-bold block">Order Number ID:</span>
                        <span className="font-mono font-bold text-gray-800">{o.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">Billed Client:</span>
                        <span className="text-gray-700 font-semibold">{o.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">Logistics Destination:</span>
                        <span className="text-gray-700 font-semibold">{o.shippingAddress.city}, {o.shippingAddress.state}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">Status State:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          o.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {o.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Cargo item contents details */}
                    <div className="space-y-2">
                      {o.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-gray-800 font-medium">{it.name} (Qty: {it.quantity} x ₹{it.price})</span>
                          <span className="font-mono text-gray-400 font-semibold">SKU: {it.sku} | Type: {it.sellType}</span>
                        </div>
                      ))}
                    </div>

                    {/* Operational controls to update status */}
                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-100 text-xs font-semibold">
                      {o.orderStatus === 'ORDER_PLACED' && (
                        <button
                          onClick={() => {
                            StateEngine.updateOrderStatus(o.id, 'CONFIRMED');
                            window.location.reload();
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg cursor-pointer cursor-pointer shadow-xs"
                        >
                          Confirm & Accept Order
                        </button>
                      )}
                      {o.orderStatus === 'CONFIRMED' && (
                        <button
                          onClick={() => {
                            StateEngine.updateOrderStatus(o.id, 'PACKED');
                            window.location.reload();
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          Mark as Packed inside Warehouse
                        </button>
                      )}
                      {o.orderStatus === 'PACKED' && (
                        <button
                          onClick={() => {
                            StateEngine.updateOrderStatus(o.id, 'SHIPPED');
                            window.location.reload();
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          Dispatch Cargo (Ship)
                        </button>
                      )}
                      {o.orderStatus === 'SHIPPED' && (
                        <button
                          onClick={() => {
                            StateEngine.updateOrderStatus(o.id, 'DELIVERED');
                            StateEngine.updateOrderPaymentStatus(o.id, 'PAID');
                            window.location.reload();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg cursor-pointer h-fit"
                        >
                          Record Package as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: INVENTORY LOG MONITOR
           ========================================== */}
        {activeMenu === 'INVENTORY' && activeVendor.status === 'APPROVED' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Automated warehouse stock tracker</h2>
              <p className="text-[11px] text-gray-400 mt-1">Manage reserved quantities, real-time items sold, and check trigger low stock alarms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendorProducts.map((p) => {
                const needsRestock = p.availableQuantity <= p.lowStockThreshold;
                return (
                  <div
                    key={p.id}
                    className={`border rounded-xl p-4 space-y-3 ${
                      needsRestock ? 'border-rose-250 bg-rose-50/5' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                        <span className="text-[9px] font-mono text-gray-400">SKU: {p.sku}</span>
                      </div>
                      {needsRestock && (
                        <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[8px] font-black border border-rose-150 animate-bounce">
                          ⚠ LIMIT CRITICAL
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="text-[9px] text-gray-400 block font-bold block mb-1">In-Stock</span>
                        <strong className="text-gray-800 font-mono">{p.availableQuantity} units</strong>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="text-[9px] text-gray-400 block font-bold block mb-1">Reserved</span>
                        <strong className="text-gray-800 font-mono">{p.reservedQuantity} units</strong>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="text-[9px] text-gray-400 block font-bold block mb-1">Sold Total</span>
                        <strong className="text-emerald-600 font-mono">{p.soldQuantity} units</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <input
                        type="number"
                        placeholder="Restock amount..."
                        className="p-1 px-2.5 border border-gray-200 rounded text-xs w-28 bg-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = Number((e.target as HTMLInputElement).value);
                            if (val > 0) {
                              p.availableQuantity += val;
                              StateEngine.saveProduct(p);
                              alert('Stock replenished successfully.');
                              window.location.reload();
                            }
                          }
                        }}
                      />
                      <span className="text-[9px] text-gray-400 self-center font-bold font-mono">Press [Enter] to restock</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: VENDOR REGISTRATION / PROFILE
           ========================================== */}
        {activeMenu === 'REGISTRATION' && (
          <form onSubmit={handleRegisterVendor} className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Register New Supplier Storefront</h2>
              <p className="text-[11px] text-gray-400 mt-1">Settle business licenses, verification documents, and UPI/Bank payouts coordinates.</p>
            </div>

            {regSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 animate-bounce" /> Store application submitted! Undergoing regulatory background review by Administrators.
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-850 border-b border-gray-100 pb-1 uppercase tracking-wide">1. Business Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Business Legal Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Apex Apparel India"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Manufacturer Type</label>
                  <select
                    value={bType}
                    onChange={(e) => setBType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white cursor-pointer"
                  >
                    <option value="Both">Wholesale & Retail (Both)</option>
                    <option value="Wholesale">Wholesale Factory Only</option>
                    <option value="Retail">Retail Storefront Only</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Owner Full Name</label>
                  <input
                    required
                    type="text"
                    value={ownerN}
                    onChange={(e) => setOwnerN(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">GST Number (India)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    value={gstN}
                    onChange={(e) => setGstN(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">PAN Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. AAAAA1111A"
                    value={panN}
                    onChange={(e) => setPanN(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Commercial Email Address</label>
                  <input
                    required
                    type="email"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Commercial Mobile Phone</label>
                  <input
                    required
                    type="text"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-850 border-b border-gray-100 pb-1 uppercase tracking-wide pt-4">2. Commercial Bank coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Bank holder Name</label>
                  <input
                    required
                    type="text"
                    value={bHolder}
                    onChange={(e) => setBHolder(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">Account Number</label>
                  <input
                    required
                    type="password"
                    value={bAccount}
                    onChange={(e) => setBAccount(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">IFSC Code</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. HDFC0000060"
                    value={bIfsc}
                    onChange={(e) => setBIfsc(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-450 font-bold block">UPI ID Address</label>
                  <input
                    required
                    type="text"
                    value={vUpi}
                    onChange={(e) => setVUpi(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-3 rounded-xl cursor-pointer"
                >
                  Submit Store Verification Form
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
