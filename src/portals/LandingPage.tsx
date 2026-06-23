/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Star, Heart, FileText, CheckCircle, Tag, Layers, HeartCrack } from 'lucide-react';
import { Product, Category, Vendor, Advertisement } from '../types';
import { StateEngine } from '../data/seedData';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, sellType: 'RETAIL' | 'WHOLESALE') => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export default function LandingPage({
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds
}: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'TRENDING' | 'RETAIL' | 'WHOLESALE'>('TRENDING');
  
  const allProducts = StateEngine.getProducts().filter(p => p.status === 'APPROVED');
  const categories = StateEngine.getCategories();
  const vendors = StateEngine.getVendors().filter(v => v.status === 'APPROVED');
  const ads = StateEngine.getAdvertisements().filter(a => a.isActive);

  // Filter lists based on tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'RETAIL':
        return allProducts.filter(p => p.retailPrice > 0 && p.minimumOrderQuantity <= 1);
      case 'WHOLESALE':
        return allProducts.filter(p => p.wholesalePrice > 0 && p.minimumOrderQuantity > 1);
      case 'TRENDING':
      default:
        return allProducts.slice(0, 10);
    }
  };

  const activeProducts = getFilteredProducts();

  return (
    <div className="space-y-12">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-2xl mx-4 md:mx-8 mt-4 py-16 px-8 md:px-16 shadow-lg">
        {/* Subtle decorative geometric background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full inline-block">
            Factory Direct & Custom Sourcing
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Connect directly with leading Manufacturers & Wholesalers.
          </h1>
          <p className="text-gray-200 text-sm md:text-md leading-relaxed max-w-xl">
            Settle retail needs or procure dynamic industrial inventory in secure, high-volume batches with full escrow guarantees and integrated cargo shipping.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() => onNavigate('products')}
              className="bg-white hover:bg-gray-50 text-blue-900 font-bold text-xs py-3.5 px-6 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              Start Wholesale Procurements
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold border border-blue-400/30 text-xs py-3.5 px-6 rounded-lg cursor-pointer transition-colors"
            >
              Register Storefront Workspace
            </button>
          </div>
        </div>
      </section>

      {/* 2. SPONSORED OFFERS (ADVERTISEMENT CAROUSEL) */}
      {ads.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="border border-amber-200/40 bg-amber-50/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-200 shrink-0">
                Sponsored Promotion
              </span>
              <p className="text-xs text-gray-700 font-medium">
                {ads[0].title}
              </p>
            </div>
            <button
              onClick={() => {
                const targetProd = allProducts.find(p => p.id === ads[0].targetId);
                if (targetProd) onSelectProduct(targetProd);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-4 py-2 rounded transition-colors cursor-pointer whitespace-nowrap"
            >
              Claim Special Offer Now
            </button>
          </div>
        </section>
      )}

      {/* 3. FEATURED CATEGORIES */}
      <section className="px-4 md:px-8 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Featured Trade Categories</h2>
            <p className="text-xs text-gray-500 mt-0.5">Explore curated lists catering to your commercial or individual demands.</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Categories <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => { onNavigate('products'); }}
              className="group cursor-pointer border border-slate-200 bg-white rounded-2xl p-3.5 flex flex-col items-center justify-center text-center gap-2.5 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                {cat.name.split(' & ')[0]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT MATRIX (TABS FOR RETAIL / WHOLESALE) */}
      <section className="px-4 md:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catalogs Showcases</h2>
            <p className="text-xs text-gray-500 mt-0.5">Switch lists to inspect bulk prices or simple zero-MOQ personal items.</p>
          </div>

          <div className="flex rounded-lg bg-gray-100 p-1 self-start md:self-auto border border-gray-200/50">
            <button
              onClick={() => setActiveTab('TRENDING')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'TRENDING' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Trending Products (All)
            </button>
            <button
              onClick={() => setActiveTab('RETAIL')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'RETAIL' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-emerald-700'
              }`}
            >
              Retail Stores (MOQ: 1)
            </button>
            <button
              onClick={() => setActiveTab('WHOLESALE')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'WHOLESALE' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-blue-700'
              }`}
            >
              Wholesale Batches (MOQ Required)
            </button>
          </div>
        </div>

        {activeProducts.length === 0 ? (
          <div className="py-12 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl max-w-md mx-auto">
            <HeartCrack className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600">No matching items in this tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {activeProducts.map((p) => {
              const isWished = wishlistIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all flex flex-col group relative"
                >
                  {/* Wishlist Button right on Image */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(p); }}
                    className="absolute top-2.5 right-2.5 z-20 h-7 w-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors cursor-pointer shadow-xs border border-slate-100"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(p)}
                    className="h-44 bg-slate-50 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Tag indicators: Wholesale / Retail */}
                    <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                      {p.minimumOrderQuantity > 1 ? (
                        <span className="bg-blue-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow-xs">
                          Wholesale (MOQ: {p.minimumOrderQuantity})
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow-xs">
                          Retail Shop
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      {/* Brand name */}
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {p.brand} | Org: {p.vendorName.substring(0, 15)}...
                      </span>
                      <h3
                        onClick={() => onSelectProduct(p)}
                        className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-blue-600 cursor-pointer group-hover:underline"
                      >
                        {p.name}
                      </h3>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(p.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">({p.reviewCount || 4})</span>
                      </div>
                    </div>

                    {/* Pricing matrix block */}
                    <div className="pt-2 border-t border-slate-100">
                      {p.minimumOrderQuantity > 1 ? (
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-400 text-[10px] font-bold">Bulk Pack Fee:</span>
                          <span className="text-sm font-black text-blue-700">₹{p.wholesalePrice} / pc</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-400 text-[10px] font-bold">Price:</span>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 line-through block leading-none">₹{p.retailPrice + 400}</span>
                            <span className="text-sm font-black text-emerald-700 font-sans">₹{p.retailPrice}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Button Grid */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="text-[10px] border border-slate-200 hover:border-slate-300 font-bold text-slate-700 py-1.5 rounded-xl transition-all cursor-pointer text-center"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          const sellType = p.minimumOrderQuantity > 1 ? 'WHOLESALE' : 'RETAIL';
                          onAddToCart(p, sellType);
                        }}
                        className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-xl transition-all cursor-pointer text-center"
                      >
                        + Basket
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. FEATURED APPROVED VENDORS */}
      <section className="px-4 md:px-8 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Verified Suppliers & Wholesalers</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Connect with vetted partners registered across State and National trade databases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col border-l-4 border-l-emerald-500"
            >
              {/* Cover Banner */}
              <div className="h-20 bg-gray-50 overflow-hidden relative">
                <img
                  src={v.businessBanner || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'}
                  alt={v.businessName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-15 brightness-95"
                />
              </div>

              {/* Vendor Info Section */}
              <div className="p-4 flex-1 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{v.businessName}</h3>
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[8px] uppercase px-1.5 py-0.5 rounded shrink-0">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Owner: {v.ownerName} | Type: {v.businessType}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                    Operating out of <strong>{v.city}, {v.state}</strong> (PIN: {v.pincode}) with active compliance GST documentation on record.
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-400 font-bold text-[10px]">
                    UPI ID: {v.upiId || 'Not set'}
                  </span>
                  <button
                    onClick={() => { onNavigate('products'); }}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    View Catalog <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SLIDER SECTION */}
      <section className="bg-gray-50 border border-gray-100 rounded-2xl mx-4 md:px-12 md:mx-8 py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <span className="bg-blue-100 text-blue-800 text-[9px] uppercase font-bold px-2 py-0.5 rounded inline-block">
            Trust & Growth Logs
          </span>
          <h3 className="text-xl font-bold text-gray-800">Reviews & Verification Audits</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            See how enterprise factory retailers, local shop owners and retail customers rate their transactions with our verified manufacturer core.
          </p>
        </div>

        <div className="border border-gray-100 bg-white p-5 rounded-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
            </div>
            <p className="text-xs font-semibold text-gray-800">Amazing Garment Bulk Lot!</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              "We ordered 500 Oxford Shirts for our corporate uniform launch from Apex Apparel. Unbelievable pricing and quality standard checked."
            </p>
          </div>
          <span className="text-[10px] font-bold text-gray-400">- Retail Manager, Delhi</span>
        </div>

        <div className="border border-gray-100 bg-white p-5 rounded-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
            </div>
            <p className="text-xs font-semibold text-gray-800">Reliable IoT Spares Sourcing</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              "Buying ESP32 kits from NextGen is zero hassle. Authentic packaging, zero defective chips, and quick T+1 shipping logistics processing."
            </p>
          </div>
          <span className="text-[10px] font-bold text-gray-400">- Hardware Dev Partner, Bengaluru</span>
        </div>
      </section>

      {/* 7. APP DOWNLOADING AD BLOCK */}
      <section className="mx-4 md:mx-8 bg-gradient-to-tr from-gray-900 to-slate-800 text-white p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-4 max-w-md">
          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-black px-2 py-0.5 rounded border border-emerald-500/30">
            Available on Portable Devices
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
            Procure stock anywhere with the VendorHub Mobile App.
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Raise RFQs, get real-time shipping notifications, track active cargo trucks, and coordinate live payments directly.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white/10 hover:bg-white/20 border border-white/10 text-white cursor-pointer px-4 py-2 rounded-lg font-bold transition-all">
              Google Play Store
            </span>
            <span className="bg-white/10 hover:bg-white/20 border border-white/10 text-white cursor-pointer px-4 py-2 rounded-lg font-bold transition-all">
              Apple App Store
            </span>
          </div>
        </div>

        {/* Mock Graphic Visual */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 self-stretch flex items-center justify-center relative md:w-80">
          <div className="space-y-3 w-full text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center p-2 rounded-full bg-blue-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-xs font-bold text-gray-100">Escrow Verification Applet</h4>
            <p className="text-[10px] text-gray-400 max-w-[180px] mx-auto">Scan barcodes on deliveries to instantly release escrow funds securely.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
