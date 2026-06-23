/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag, ClipboardList, MapPin, Heart, Star, Plus, Trash2, Edit2, 
  ChevronRight, ArrowLeft, Percent, Compass, Check, AlertCircle, ShoppingCart, Video, FileImage
} from 'lucide-react';
import { Product, CustomerAddress, Order, Review, CartItem } from '../types';
import { StateEngine } from '../data/seedData';

interface CustomerPortalProps {
  currentUserId: string;
  onNavigate: (view: string) => void;
  selectedProductIdState: Product | null;
  onClearSelectedProduct: () => void;
  cart: CartItem[];
  onUpdateCartQty: (productId: string, quantity: number, sellType: 'RETAIL' | 'WHOLESALE') => void;
  onRemoveFromCart: (productId: string, sellType: 'RETAIL' | 'WHOLESALE') => void;
  onClearCart: () => void;
  onPlaceOrder: (params: {
    paymentMethod: Order['paymentMethod'];
    address: CustomerAddress;
    couponApplied?: string;
    discountAmount: number;
    subtotal: number;
    gstAmount: number;
    shippingFee: number;
    total: number;
  }) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, sellType: 'RETAIL' | 'WHOLESALE') => void;
}

export default function CustomerPortal({
  currentUserId,
  onNavigate,
  selectedProductIdState,
  onClearSelectedProduct,
  cart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  wishlistIds,
  onToggleWishlist,
  onAddToCart
}: CustomerPortalProps) {
  const [subView, setSubView] = useState<'DASHBOARD' | 'ADDRESSES' | 'CART_CHECKOUT' | 'WISHLIST' | 'REGISTRATION'>('DASHBOARD');
  
  // Registration States
  const [isRegistered, setIsRegistered] = useState(true);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Address Form States
  const [addresses, setAddresses] = useState<CustomerAddress[]>(() => StateEngine.getAddresses(currentUserId));
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrName, setAddrName] = useState('Ramprasad Suthi');
  const [addrMobile, setAddrMobile] = useState('+91 99911 22334');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');

  // Cart Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; value: number; type: 'FLAT' | 'PERCENTAGE' } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Checkout State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const list = StateEngine.getAddresses(currentUserId);
    const def = list.find(a => a.isDefault);
    return def ? def.id : (list[0]?.id || '');
  });
  const [paymentOption, setPaymentOption] = useState<Order['paymentMethod']>('UPI');

  // Review Form state
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revImage, setRevImage] = useState('');
  const [reviewPostedSuccess, setReviewPostedSuccess] = useState(false);

  // Load context from state engine
  const orders = StateEngine.getOrders().filter(o => o.customerId === currentUserId);
  const allProducts = StateEngine.getProducts();
  const wishlistedProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  // Handle Review Submission
  const handlePostReview = (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!revComment.trim()) return;

    const newReview: Review = {
      id: `rev-usr-${Date.now()}`,
      productId,
      customerId: currentUserId,
      customerName: 'Ramprasad Suthi (You)',
      rating: revRating,
      comment: revComment,
      images: revImage ? [revImage] : [],
      createdAt: new Date().toISOString()
    };

    StateEngine.addReview(newReview);
    setRevComment('');
    setRevImage('');
    setReviewPostedSuccess(true);
    setTimeout(() => setReviewPostedSuccess(false), 3000);
  };

  // Address Saving handler
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: CustomerAddress = {
      id: editingAddress ? editingAddress.id : `adr-${Date.now()}`,
      customerId: currentUserId,
      label: addrLabel,
      name: addrName,
      mobile: addrMobile,
      addressLine: addrLine,
      city: addrCity,
      state: addrState,
      country: 'India',
      pincode: addrPincode,
      isDefault: editingAddress ? editingAddress.isDefault : addresses.length === 0
    };

    StateEngine.saveAddress(newAddr);
    setAddresses(StateEngine.getAddresses(currentUserId));
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddrLine('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
    if (!selectedAddressId) setSelectedAddressId(newAddr.id);
  };

  const handleEditAddressClick = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setAddrLabel(addr.label);
    setAddrName(addr.name);
    setAddrMobile(addr.mobile);
    setAddrLine(addr.addressLine);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setShowAddressForm(true);
  };

  const handleDeleteAddressClick = (id: string) => {
    StateEngine.deleteAddress(id);
    const updated = StateEngine.getAddresses(currentUserId);
    setAddresses(updated);
    if (selectedAddressId === id) {
      setSelectedAddressId(updated[0]?.id || '');
    }
  };

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const coupons = StateEngine.getCoupons();
    const c = coupons.find(cpn => cpn.code.toUpperCase() === couponCode.toUpperCase().trim() && cpn.isActive);

    if (!c) {
      setCouponError('Invalid, expired or deactivated coupon code.');
      setAppliedCoupon(null);
      return;
    }

    const cartSub = cart.reduce((tot, item) => {
      const p = item.product;
      const rate = item.sellType === 'WHOLESALE' ? p.wholesalePrice : p.retailPrice;
      return tot + (rate * item.quantity);
    }, 0);

    if (cartSub < c.minOrderValue) {
      setCouponError(`Min purchase of ₹${c.minOrderValue} required for this coupon.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon({
      code: c.code,
      value: c.value,
      type: c.type
    });
  };

  // Math totals
  const cartSubtotal = cart.reduce((tot, item) => {
    const p = item.product;
    const rate = item.sellType === 'WHOLESALE' ? p.wholesalePrice : p.retailPrice;
    return tot + (rate * item.quantity);
  }, 0);

  const discountAmount = appliedCoupon
    ? (appliedCoupon.type === 'PERCENTAGE'
        ? Number(((cartSubtotal * appliedCoupon.value) / 100).toFixed(2))
        : appliedCoupon.value)
    : 0;

  const currentGstRate = 0.18; // 18% standard GST
  const gstAmount = Number(((cartSubtotal - discountAmount) * currentGstRate).toFixed(2));
  const shippingFee = cartSubtotal > 3000 || cartSubtotal === 0 ? 0 : 150;
  const cartTotal = Number((cartSubtotal - discountAmount + gstAmount + shippingFee).toFixed(2));

  // Place Order Simulation
  const handleCheckoutSubmit = () => {
    const activeAddress = addresses.find(a => a.id === selectedAddressId);
    if (!activeAddress) {
      alert('Please specify a valid delivery address.');
      return;
    }

    onPlaceOrder({
      paymentMethod: paymentOption,
      address: activeAddress,
      couponApplied: appliedCoupon?.code,
      discountAmount,
      subtotal: cartSubtotal,
      gstAmount,
      shippingFee,
      total: cartTotal
    });

    setAppliedCoupon(null);
    setCouponCode('');
    setSubView('DASHBOARD');
  };

  // UI helpers: Order Tracker status check
  const getTrackerStep = (status: Order['orderStatus']) => {
    const steps: Order['orderStatus'][] = [
      'ORDER_PLACED',
      'CONFIRMED',
      'PACKED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];
    return steps.indexOf(status);
  };

  // ==========================================
  // DETAIL VIEW DRAW PANEL
  // ==========================================
  if (selectedProductIdState) {
    const p = selectedProductIdState;
    const itemReviews = StateEngine.getReviews().filter(r => r.productId === p.id);

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 bg-white border border-gray-100 rounded-xl space-y-8 mt-4">
        {/* Back Button */}
        <button
          onClick={onClearSelectedProduct}
          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Marketplace
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="h-72 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={p.images[0]}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {p.images.slice(1).map((img, i) => (
                <div key={i} className="h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={img} alt={p.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                </div>
              ))}
              {p.videoUrl && (
                <div className="h-24 rounded-lg bg-gray-900 border border-gray-800 flex flex-col items-center justify-center p-2 text-white text-center cursor-pointer hover:bg-black transition-colors">
                  <Video className="h-5 w-5 text-rose-500 mb-1" />
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wide">Play Demo Video</span>
                </div>
              )}
            </div>
          </div>

          {/* Core Fields Card */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-blue-100 text-blue-800 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                  SKU: {p.sku}
                </span>
                <span className="bg-gray-100 text-gray-700 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                  Brand: {p.brand}
                </span>
                {p.minimumOrderQuantity > 1 && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] uppercase font-black px-2 py-0.5 rounded border border-amber-200">
                    B2B Wholesale Channel
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{p.name}</h1>
              <p className="text-xs text-gray-400">Sold by verified partner: <strong className="text-gray-600">{p.vendorName}</strong></p>

              {/* Stars summary */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(p.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-bold">({p.rating || 4.5} out of 5 stars from {p.reviewCount || itemReviews.length} customers)</span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {p.wholesalePrice > 0 && (
                  <div className="border-r border-gray-200 pr-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Wholesale Fee (MOQ: {p.minimumOrderQuantity})</span>
                    <span className="text-lg font-black text-blue-600">₹{p.wholesalePrice} <span className="text-xs font-normal text-gray-500">/ unit</span></span>
                  </div>
                )}
                {p.retailPrice > 0 && (
                  <div className="pl-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Retail Standard Rate</span>
                    <span className="text-lg font-black text-emerald-600">₹{p.retailPrice} <span className="text-xs font-normal text-gray-500">/ unit</span></span>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-gray-500">
                ⭐ 18% GST will be formulated at invoice check. Logistics coverage to all major state zones.
              </div>
            </div>

            {/* CTA action cluster */}
            <div className="space-y-3">
              <div className="flex gap-2.5">
                {p.minimumOrderQuantity > 1 ? (
                  <button
                    onClick={() => { onAddToCart(p, 'WHOLESALE'); onNavigate('products'); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    Procure Bulk Lot (MOQ: {p.minimumOrderQuantity}+)
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { onAddToCart(p, 'RETAIL'); onNavigate('products'); }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      Add to Customer Cart
                    </button>
                    <button
                      onClick={() => { onAddToCart(p, 'RETAIL'); onNavigate('cart'); }}
                      className="bg-gray-900 hover:bg-black text-white font-bold text-xs py-3 px-6 rounded-lg cursor-pointer transition-colors"
                    >
                      Buy Instantly
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => onToggleWishlist(p)}
                className={`w-full border py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  wishlistIds.includes(p.id) ? 'bg-rose-50 border-rose-100 text-rose-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Heart className="h-4 w-4" /> Save to Wishlist Registry
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Tab block */}
        <div className="border-t border-gray-100 pt-6 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-l-3 border-l-blue-600 pl-2">Product Description & Specs</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{p.fullDescription}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            <div className="bg-gray-50 p-2.5 rounded-lg text-center border border-gray-100">
              <span className="text-[10px] text-gray-400 block font-bold leading-none mb-1">Stock Available</span>
              <span className="text-xs text-semibold text-gray-700">{p.availableQuantity} units</span>
            </div>
            {p.weight && (
              <div className="bg-gray-50 p-2.5 rounded-lg text-center border border-gray-100">
                <span className="text-[10px] text-gray-400 block font-bold leading-none mb-1">Cargo Weight</span>
                <span className="text-xs text-semibold text-gray-700">{p.weight} kg</span>
              </div>
            )}
            {p.length && (
              <div className="bg-gray-50 p-2.5 rounded-lg text-center border border-gray-100">
                <span className="text-[10px] text-gray-400 block font-bold leading-none mb-1">Dimensions (LxWxH)</span>
                <span className="text-xs text-semibold text-gray-700">{p.length}x{p.width}x{p.height} cm</span>
              </div>
            )}
            <div className="bg-gray-50 p-2.5 rounded-lg text-center border border-gray-100">
              <span className="text-[10px] text-gray-400 block font-bold leading-none mb-1">Product Status</span>
              <span className="text-xs text-semibold text-emerald-600 font-bold uppercase">APPROVED</span>
            </div>
          </div>
        </div>

        {/* Real Review Pipelines */}
        <div className="border-t border-gray-100 pt-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-gray-900 border-l-3 border-l-blue-600 pl-2">Client Verification Reviews ({itemReviews.length})</h3>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Only Verified Escrow Buyers can review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review logger list */}
            <div className="md:col-span-2 space-y-4 max-h-96 overflow-y-auto pr-2">
              {itemReviews.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No verification reviews yet. Be the first to leave one!</p>
              ) : (
                itemReviews.map((r) => (
                  <div key={r.id} className="border border-gray-100 p-4 rounded-xl space-y-2 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">{r.customerName}</span>
                      <span className="text-[10px] text-gray-400">{r.createdAt.split('T')[0]}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>

                    <p className="text-xs text-gray-600 font-medium">{r.comment}</p>

                    {r.images && r.images.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {r.images.map((img, idx) => (
                          <div key={idx} className="h-12 w-12 rounded border overflow-hidden bg-white">
                            <img src={img} alt="review" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Review Writer form */}
            <form onSubmit={(e) => handlePostReview(e, p.id)} className="border border-gray-100 p-4 rounded-xl space-y-3 bg-white self-start">
              <h4 className="text-xs font-bold text-gray-800">Publish Verification Review</h4>
              {reviewPostedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2 rounded text-[10px] font-semibold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Published successfully! Rating updated.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block uppercase">Select Rating Stars</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRevRating(s)}
                      className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-5 w-5 ${s <= revRating ? 'fill-amber-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block uppercase">Review Comments</label>
                <textarea
                  required
                  placeholder="Share details on build quality, packaging, layout, speeds..."
                  rows={3}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block uppercase">Proof Image URL (Mock)</label>
                <input
                  type="text"
                  placeholder="Paste image address..."
                  value={revImage}
                  onChange={(e) => setRevImage(e.target.value)}
                  className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-2 rounded transition-colors cursor-pointer"
              >
                Send Verified Review
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1 border border-slate-200 rounded-3xl p-5 bg-white h-fit space-y-4 shadow-xs">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl p-5 text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-white/20 mx-auto flex items-center justify-center font-bold text-lg border border-white/20 shadow-inner">
            RS
          </div>
          <div>
            <h4 className="text-sm font-bold leading-tight">Ramprasad Suthi</h4>
            <span className="text-[10px] text-blue-200 block">ramprasadsuthi@gmail.com</span>
          </div>
          <span className="inline-block bg-white/15 text-[9px] font-mono px-3 py-1 rounded-full border border-white/10">
            Status: ACTIVE Account
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 text-xs text-slate-700">
          <button
            onClick={() => setSubView('DASHBOARD')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              subView === 'DASHBOARD' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><ClipboardList className="h-4.5 w-4.5 text-slate-450" /> Order Tracking Queue</span>
            <span className="bg-slate-100 font-mono px-1.5 py-0.5 rounded text-[10px] text-slate-500">{orders.length}</span>
          </button>
          <button
            onClick={() => setSubView('WISHLIST')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              subView === 'WISHLIST' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Heart className="h-4.5 w-4.5 text-slate-450" /> Wishlist Inventory</span>
            <span className="bg-slate-100 font-mono px-1.5 py-0.5 rounded text-[10px] text-slate-500">{wishlistIds.length}</span>
          </button>
          <button
            onClick={() => setSubView('ADDRESSES')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              subView === 'ADDRESSES' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><MapPin className="h-4.5 w-4.5 text-slate-450" /> Saved Addresses</span>
            <span className="bg-slate-100 font-mono px-1.5 py-0.5 rounded text-[10px] text-slate-500">{addresses.length}</span>
          </button>
          <button
            onClick={() => setSubView('CART_CHECKOUT')}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors ${
              subView === 'CART_CHECKOUT' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><ShoppingCart className="h-4.5 w-4.5 text-rose-500" /> Cart & GST Check</span>
            <span className="bg-rose-100 font-mono px-1.5 py-0.5 rounded text-[10px] text-rose-600">{cart.length}</span>
          </button>
        </nav>
      </aside>

      {/* Primary Details Panel */}
      <main className="lg:col-span-3 space-y-6">

        {/* ==========================================
            SUB-VIEW: ADDRESS MANAGEMENT
           ========================================== */}
        {subView === 'ADDRESSES' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-150">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Saved Shipping & Billing Addresses</h2>
                <p className="text-[11px] text-gray-400 mt-1">Add or update standard delivery warehouses or checkout drop points.</p>
              </div>
              <button
                onClick={() => { setEditingAddress(null); setShowAddressForm(!showAddressForm); }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Delivery Node
              </button>
            </div>

            {/* Form Drawer */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="border border-blue-100 bg-blue-50/25 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-gray-800">{editingAddress ? 'Modify Address Node' : 'Define New Address Node'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Label Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Home, Office, Storage 1"
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Recipient Full Name</label>
                    <input
                      required
                      type="text"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Contact Mobile</label>
                    <input
                      required
                      type="text"
                      value={addrMobile}
                      onChange={(e) => setAddrMobile(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Street Address Details</label>
                  <input
                    required
                    type="text"
                    placeholder="Block number, lane name, landmark..."
                    value={addrLine}
                    onChange={(e) => setAddrLine(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">City</label>
                    <input
                      required
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">State</label>
                    <input
                      required
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Zipcode / Pincode</label>
                    <input
                      required
                      type="text"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                    className="border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded cursor-pointer"
                  >
                    Commit Address Node
                  </button>
                </div>
              </form>
            )}

            {/* Addresses grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`border rounded-xl p-4 flex flex-col justify-between space-y-4 bg-gray-50/50 relative ${
                    addr.isDefault ? 'border-blue-450 bg-blue-50/5' : 'border-gray-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-200 text-gray-700 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-blue-600 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                          Primary Node
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 pt-1">{addr.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed pt-1">
                      {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <span className="text-[10px] font-mono text-gray-400 block pt-1">Mobile: {addr.mobile}</span>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditAddressClick(addr)}
                      className="p-1 text-gray-500 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleDeleteAddressClick(addr.id)}
                        className="p-1 text-gray-500 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: WISHLIST PORTFOLIO
           ========================================== */}
        {subView === 'WISHLIST' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Wishlist Catalog Monitors</h2>
              <p className="text-[11px] text-gray-400 mt-1">Review saved products, check real-time stock limits, and buy when prices ease.</p>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="py-12 text-center bg-gray-50/50 border border-dashed border-gray-100 rounded-xl">
                <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Your wishlist is currently idle.</p>
                <button onClick={() => onNavigate('products')} className="text-xs text-blue-600 underline font-semibold mt-1">
                  Discover Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistedProducts.map((p) => (
                  <div key={p.id} className="border border-gray-100 bg-white rounded-xl p-3 flex gap-3 hover:border-blue-200 transition-all">
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-gray-400">Moq Check: {p.minimumOrderQuantity === 1 ? 'Retail' : `Wholesale (Min: ${p.minimumOrderQuantity})`}</p>
                        <span className="text-xs font-black text-gray-800">
                          ₹{p.minimumOrderQuantity > 1 ? p.wholesalePrice : p.retailPrice}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <button
                          onClick={() => onToggleWishlist(p)}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Erase Node
                        </button>
                        <button
                          onClick={() => {
                            const sellType = p.minimumOrderQuantity > 1 ? 'WHOLESALE' : 'RETAIL';
                            onAddToCart(p, sellType);
                          }}
                          className="bg-blue-600 text-white font-semibold text-[10px] px-2.5 py-1 rounded cursor-pointer hover:bg-blue-700"
                        >
                          + Shopping basket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: CART & GST CHECKOUT DESK
           ========================================== */}
        {subView === 'CART_CHECKOUT' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basket items list */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 space-y-6">
              <div className="border-b border-gray-150 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Your Trading Basket</h2>
                  <p className="text-[11.5px] text-gray-400 mt-1">Review quantities, MOQ barriers, and channel pricing structures.</p>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
                  >
                    Clear Basket
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingCart className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-bold">Your shopping basket is currently flat.</p>
                  <button onClick={() => onNavigate('products')} className="text-xs text-blue-600 underline font-semibold mt-1">
                    Procure Inventory Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const rate = item.sellType === 'WHOLESALE' ? item.product.wholesalePrice : item.product.retailPrice;
                    const minOQty = item.sellType === 'WHOLESALE' ? item.product.minimumOrderQuantity : 1;
                    return (
                      <div key={item.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 object-cover rounded border" />
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                            <div className="flex gap-2 items-center flex-wrap pt-1">
                              <span className={`text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded ${
                                item.sellType === 'WHOLESALE' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {item.sellType}
                              </span>
                              <span className="text-[10px] text-gray-450 font-semibold font-mono">
                                Unit: ₹{rate} | Min: {minOQty}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controllers */}
                        <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                          <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-white">
                            <button
                              onClick={() => {
                                if (item.quantity > minOQty) onUpdateCartQty(item.productId, item.quantity - 1, item.sellType);
                              }}
                              className="px-2 py-1 text-gray-500 hover:bg-gray-100 font-black cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3 font-mono text-gray-800 font-bold">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateCartQty(item.productId, item.quantity + 1, item.sellType)}
                              className="px-2 py-1 text-gray-500 hover:bg-gray-100 font-black cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-gray-800 w-20 text-right">
                            ₹{(rate * item.quantity).toFixed(2)}
                          </span>

                          <button
                            onClick={() => onRemoveFromCart(item.productId, item.sellType)}
                            className="p-1 text-gray-400 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Invoicing, Coupon, Shipping, Payment Block */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 h-fit space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-l-3 border-l-rose-500 pl-2">GST Invoicing Calculation</h3>
              
              {/* Promo Panel Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase block">Apply Trading Coupons</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. BULKDEAL10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-xs p-2 border border-gray-200 rounded w-full focus:outline-hidden uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-gray-950 text-white font-bold text-xs px-4 rounded hover:bg-black cursor-pointer whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-600 font-extrabold">
                    ✓ Applied {appliedCoupon.code} ({appliedCoupon.value}{appliedCoupon.type === 'PERCENTAGE' ? '%' : '₹'} Off)
                  </p>
                )}
              </form>

              {/* Summary table */}
              <div className="space-y-3.5 pt-4 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>In-Basket Items Subtotal:</span>
                  <span className="font-semibold text-gray-700">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-550">
                    <span>Coupon Discount Cut:</span>
                    <span className="font-extrabold text-rose-600">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>SGST + CGST (18% Flat rate):</span>
                  <span className="font-semibold text-gray-700">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Integrated Shipping Fee:</span>
                  <span className="font-semibold text-gray-700">{shippingFee === 0 ? 'FREE above ₹3k' : `₹${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-gray-100 font-black text-gray-900 bg-gray-50 p-2.5 rounded-lg">
                  <span>Invoice Total Fee:</span>
                  <span className="text-blue-650">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Destination Drop selector */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase block">Confirm Destination Warehouse Address</label>
                {addresses.length === 0 ? (
                  <p className="text-[10px] text-rose-500 font-semibold italic">Please define a Saved Address Node before checkout.</p>
                ) : (
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded cursor-pointer"
                  >
                    {addresses.map(a => (
                      <option key={a.id} value={a.id}>{a.label} ({a.name}) - {a.city}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Payment selectors */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase block">Select Commercial Payment Option</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {['UPI', 'CREDIT_CARD', 'CASH_ON_DELIVERY'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPaymentOption(opt as any)}
                      className={`py-2 px-1 text-center rounded border transition-all cursor-pointer ${
                        paymentOption === opt ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {opt.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* PLACE ORDER FINAL BUTS */}
              <button
                disabled={cart.length === 0 || addresses.length === 0}
                onClick={handleCheckoutSubmit}
                className="w-full bg-rose-600 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-rose-700 text-white font-extrabold text-xs py-3.5 rounded-xl cursor-pointer shadow-md shadow-rose-600/10 hover:shadow-rose-600/20 transition-all text-center"
              >
                Approve Invoice & Release Order
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            SUB-VIEW: CUSTOMER DASHBOARD (DEFAULT)
           ========================================== */}
        {subView === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* KPI Cards top row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Total Orders</span>
                <span className="text-xl font-bold text-gray-800">{orders.length} orders</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Wishlist Items</span>
                <span className="text-xl font-bold text-gray-800">{wishlistIds.length} items</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Saved Drop Nodes</span>
                <span className="text-xl font-bold text-gray-800">{addresses.length} nodes</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Account Rating Status</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded inline-block">
                  Verified Grade-A
                </span>
              </div>
            </div>

            {/* Orders Tracking Lists & Indicators */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-black text-gray-900 border-l-4 border-l-blue-600 pl-2">Commercial Shipment tracking Queue</h2>
              
              {orders.length === 0 ? (
                <div className="py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <ClipboardList className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">You do not have any orders pending tracking logs.</p>
                  <button onClick={() => onNavigate('products')} className="text-xs text-blue-600 underline font-semibold mt-1">
                    Procure catalog inventory
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((o) => {
                    const activeStepIndex = getTrackerStep(o.orderStatus);
                    return (
                      <div key={o.id} className="border border-gray-150 rounded-xl p-5 space-y-6">
                        {/* Header metadata row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-b border-gray-100 pb-3 bg-gray-50/50 p-2 rounded-lg">
                          <div>
                            <span className="text-gray-400 font-bold block">Order Reference No:</span>
                            <span className="font-black text-gray-800 font-mono">{o.orderNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 font-bold block">Date Initiated:</span>
                            <span className="text-gray-700 font-medium">{o.createdAt.split('T')[0]}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 font-bold block">Shipment Value:</span>
                            <span className="font-extrabold text-blue-700">₹{o.total}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 font-bold block">Payment Status:</span>
                            <span className={`font-black text-[10px] px-2 py-0.5 rounded ${
                              o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.paymentStatus} via {o.paymentMethod}
                            </span>
                          </div>
                        </div>

                        {/* Order items lists in card */}
                        <div className="space-y-3.5">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <img src={it.image} alt={it.name} className="h-10 w-10 rounded border object-cover" />
                              <div className="flex-1 text-xs">
                                <h4 className="font-bold text-gray-800 line-clamp-1">{it.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">Qty: {it.quantity} x ₹{it.price} | Mode: {it.sellType}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipment State Indicator Progress bar */}
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-3">Shipment Progress Milestones</span>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                            {[
                              { label: 'Placed', status: 'ORDER_PLACED' },
                              { label: 'Confirmed', status: 'CONFIRMED' },
                              { label: 'Packed', status: 'PACKED' },
                              { label: 'Shipped', status: 'SHIPPED' },
                              { label: 'In Transit', status: 'OUT_FOR_DELIVERY' },
                              { label: 'Delivered', status: 'DELIVERED' }
                            ].map((st, sIdx) => {
                              const isFinished = sIdx <= activeStepIndex && o.orderStatus !== 'CANCELLED';
                              return (
                                <div key={sIdx} className="space-y-1">
                                  <div className={`h-2 rounded-full transition-all ${
                                    isFinished ? 'bg-emerald-500' : 'bg-gray-150'
                                  }`}></div>
                                  <span className={`text-[9px] block font-extrabold ${
                                    isFinished ? 'text-emerald-700' : 'text-gray-400'
                                  }`}>
                                    {st.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Cancel Button Option if not shipped */}
                        {getTrackerStep(o.orderStatus) < 2 && o.orderStatus !== 'CANCELLED' && (
                          <div className="flex justify-end pt-3 text-xs">
                            <button
                              onClick={() => {
                                StateEngine.updateOrderStatus(o.id, 'CANCELLED');
                                alert('Order canceled successfully.');
                                onNavigate('dashboard');
                              }}
                              className="border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                            >
                              Cancel Shipment Request
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
