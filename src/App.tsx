/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Star, ShoppingCart, Heart, Shield, Building, X, Package, 
  MapPin, CheckCircle, Tag, Info, List, ArrowRight, CornerDownRight, HeartCrack
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DeveloperControls from './components/DeveloperControls';
import LandingPage from './portals/LandingPage';
import CustomerPortal from './portals/CustomerPortal';
import VendorPortal from './portals/VendorPortal';
import AdminPortal from './portals/AdminPortal';
import { StateEngine } from './data/seedData';
import { Product, CustomerAddress, Order, Review, CartItem, UserRole } from './types';

export default function App() {
  // Core RBAC State
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  
  // Active Profiles
  const currentUser = {
    name: currentRole === 'ADMIN' 
      ? 'Platform Root Admin' 
      : currentRole === 'VENDOR' 
        ? 'Apex Apparel Settle Unit' 
        : 'Ramprasad Suthi',
    email: currentRole === 'ADMIN' 
      ? 'admin@vendorhub.com' 
      : currentRole === 'VENDOR' 
        ? 'contact@apexapparel.in' 
        : 'ramprasadsuthi@gmail.com'
  };

  const defaultVendorId = 'vnd-apex-apparel';
  const defaultCustomerId = 'customer-demo';

  // Navigation Routing States
  // 'home' (LandingPage), 'products' (search list), 'cart', 'wishlist', 'tracking', 'checkout'
  const [activeView, setActiveView] = useState<string>('home');

  // Search details states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCat, setSearchCat] = useState<string>('All');
  const [searchMode, setSearchMode] = useState<'ALL' | 'RETAIL' | 'WHOLESALE'>('ALL');

  // Interactive Product preview Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart Local States (Hydrated from localStorage caches)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [notifCount, setNotifCount] = useState<number>(3);

  // Reviews submission state on product details
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [revSuccess, setRevSuccess] = useState<boolean>(false);

  // Load and hydrate cart & wishlist items on startup
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vh_cart_items');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWish = localStorage.getItem('vh_wishlist_ids');
      if (savedWish) setWishlistIds(JSON.parse(savedWish));
    } catch (e) {
      console.error('Failed to restore local caches:', e);
    }
  }, []);

  // Sync back to local storage on changes
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('vh_cart_items', JSON.stringify(updatedCart));
  };

  const saveWishlistToStorage = (updatedWish: string[]) => {
    setWishlistIds(updatedWish);
    localStorage.setItem('vh_wishlist_ids', JSON.stringify(updatedWish));
  };

  // Cart operations
  const handleAddToCart = (product: Product, sellType: 'RETAIL' | 'WHOLESALE') => {
    let quantityToSet = sellType === 'WHOLESALE' ? product.minimumOrderQuantity : 1;
    
    // Check if item exists
    const idx = cart.findIndex(item => item.product.id === product.id && item.sellType === sellType);
    const updated = [...cart];

    if (idx >= 0) {
      updated[idx].quantity += quantityToSet;
    } else {
      updated.push({
        product,
        quantity: quantityToSet,
        sellType
      });
    }
    
    saveCartToStorage(updated);
    alert(`Success: Added ${quantityToSet} items (${sellType} mode) to your Cart.`);
  };

  const handleUpdateCartQty = (productId: string, quantity: number, sellType: 'RETAIL' | 'WHOLESALE') => {
    const updated = cart.map(item => {
      if (item.product.id === productId && item.sellType === sellType) {
        // Enforce MOQ values
        const minVal = sellType === 'WHOLESALE' ? item.product.minimumOrderQuantity : 1;
        const finalVal = Math.max(minVal, quantity);
        return { ...item, quantity: finalVal };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const handleRemoveFromCart = (productId: string, sellType: 'RETAIL' | 'WHOLESALE') => {
    const updated = cart.filter(item => !(item.product.id === productId && item.sellType === sellType));
    saveCartToStorage(updated);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Wishlist handler
  const handleToggleWishlist = (product: Product) => {
    let updated: string[];
    if (wishlistIds.includes(product.id)) {
      updated = wishlistIds.filter(id => id !== product.id);
      alert('Removed from your Wishlist.');
    } else {
      updated = [...wishlistIds, product.id];
      alert('Added to your Wishlist!');
    }
    saveWishlistToStorage(updated);
  };

  // Search submit bridge
  const handleSearch = (term: string, category: string, mode: 'ALL' | 'RETAIL' | 'WHOLESALE') => {
    setSearchTerm(term);
    setSearchCat(category);
    setSearchMode(mode);
    setActiveView('products');
  };

  // Place Order Simulation
  const handlePlaceOrder = (params: {
    paymentMethod: Order['paymentMethod'];
    address: CustomerAddress;
    couponApplied?: string;
    discountAmount: number;
    subtotal: number;
    gstAmount: number;
    shippingFee: number;
    total: number;
  }) => {
    // Select first catalog product's vendor to satisfy vendorId constraints
    const firstVendorId = cart[0]?.product.vendorId || defaultVendorId;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().substring(7)}`,
      customerId: defaultCustomerId,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      vendorId: firstVendorId,
      vendorBusinessName: 'Apex Apparel India Pty',
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.sellType === 'WHOLESALE' ? item.product.wholesalePrice : item.product.retailPrice,
        quantity: item.quantity,
        sellType: item.sellType
      })),
      discountAmount: params.discountAmount,
      subtotal: params.subtotal,
      gstAmount: params.gstAmount,
      shippingFee: params.shippingFee,
      total: params.total,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      orderStatus: 'ORDER_PLACED',
      shippingAddress: params.address,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Save order
    StateEngine.saveOrder(newOrder);

    // Track depletion inventory logs
    cart.forEach(item => {
      const p = item.product;
      p.availableQuantity = Math.max(0, p.availableQuantity - item.quantity);
      p.soldQuantity += item.quantity;
      StateEngine.saveProduct(p);
    });

    // Create supplier notification alert
    StateEngine.addNotification({
      id: `ntf-ven-ord-${Date.now()}`,
      recipientId: firstVendorId,
      title: 'New Trade Lot Order Received',
      message: `A client placed Order ${newOrder.orderNumber} totaling ₹${newOrder.total} requiring fulfillment.`,
      type: 'ALERT',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveCartToStorage([]); // Clean Basket
    alert(`Order Registered Successfully! Number: ${newOrder.orderNumber}`);
    setActiveView('tracking'); // Redirect to order tracking screen
  };

  // Submit modal reviews helper
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: selectedProduct.id,
      customerId: defaultCustomerId,
      customerName: currentUser.name,
      rating: newRating,
      comment: newComment,
      images: [],
      createdAt: new Date().toISOString()
    };

    StateEngine.addReview(newRev);
    setRevSuccess(true);
    setNewComment('');
    setTimeout(() => {
      setRevSuccess(false);
    }, 3000);
  };

  // Filter approved catalog products based on current search parameters
  const getFilteredProducts = () => {
    let prods = StateEngine.getProducts().filter(p => p.status === 'APPROVED');
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      prods = prods.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (searchCat && searchCat !== 'All') {
      prods = prods.filter(p => p.category === searchCat);
    }

    if (searchMode === 'RETAIL') {
      prods = prods.filter(p => p.minimumOrderQuantity <= 1);
    } else if (searchMode === 'WHOLESALE') {
      prods = prods.filter(p => p.minimumOrderQuantity > 1);
    }

    return prods;
  };

  const filteredCatalog = getFilteredProducts();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-gray-800">
      
      {/* 1. REAL-TIME TESTING ROLE CONTROLS (RBAC SWAPPER) */}
      <DeveloperControls
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          // Set sensible redirects during role swaps
          if (role === 'CUSTOMER') setActiveView('home');
          else if (role === 'VENDOR') setActiveView('home');
          else setActiveView('home');
        }}
        currentUser={currentUser}
      />

      {/* 2. MAIN HEADER (SHARED NAVIGATION BAR) */}
      <Navbar
        currentRole={currentRole}
        cartCount={cart.length}
        wishlistCount={wishlistIds.length}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedProduct(null);
        }}
        activeView={activeView}
        onSearch={handleSearch}
        onOpenCart={() => {
          setActiveView('cart');
          setSelectedProduct(null);
        }}
        onOpenNotifications={() => {
          alert('You have 3 unread client notifications in your ledger.');
        }}
        activeNotificationsCount={notifCount}
      />

      {/* 3. APP VIEW ROUTER MATRIX */}
      <div className="flex-grow">
        {currentRole === 'ADMIN' ? (
          <AdminPortal onNavigate={(view) => setActiveView(view)} />
        ) : currentRole === 'VENDOR' ? (
          <VendorPortal currentVendorId={defaultVendorId} onNavigate={(view) => setActiveView(view)} />
        ) : (
          /* CUSTOMER INTERFACES SUB-VIEWS ROUTERS */
          <div className="animate-fade-in">
            {activeView === 'home' && (
              <LandingPage
                onNavigate={(view) => setActiveView(view)}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            )}

            {activeView === 'products' && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-none">Catalog Search Listings</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Showing {filteredCatalog.length} matched factory products {searchCat !== 'All' ? `under Category: "${searchCat}"` : ''}
                  </p>
                </div>

                {filteredCatalog.length === 0 ? (
                  <div className="py-16 text-center border bg-white rounded-xl space-y-2 max-w-lg mx-auto">
                    <HeartCrack className="h-10 w-10 text-gray-300 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">No matching search parameters found</p>
                    <p className="text-xs text-gray-400">Try modifying spelling keys, filters, or choosing "All" categories to browse.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredCatalog.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-gray-150 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
                      >
                        <div onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                          <img src={p.images[0]} alt={p.name} className="w-full h-44 object-cover" />
                        </div>
                        <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-gray-400 font-mono tracking-wider">{p.brand}</span>
                            <h4
                              onClick={() => setSelectedProduct(p)}
                              className="font-bold text-xs text-gray-800 line-clamp-2 hover:text-blue-600 cursor-pointer"
                            >
                              {p.name}
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                              <Star className="h-3 w-3 fill-amber-500" /> {p.rating} <span className="text-gray-400 font-medium">({p.reviewCount})</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex flex-col gap-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-bold block">Retail Price:</span>
                              <strong className="text-gray-900 block">₹{p.retailPrice}</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-600 font-bold block">Wholesale Rate:</span>
                              <strong className="text-blue-700 block font-black">₹{p.wholesalePrice} <span className="text-[8.5px] font-semibold text-gray-440"> (MOQ: {p.minimumOrderQuantity})</span></strong>
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="flex gap-2 pt-2 text-xs">
                            <button
                              onClick={() => handleAddToCart(p, p.minimumOrderQuantity > 1 ? 'WHOLESALE' : 'RETAIL')}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded-lg text-[11px] cursor-pointer text-center flex items-center justify-center gap-1.5"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> Buy Pack
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(p)}
                              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-650 cursor-pointer"
                            >
                              <Heart className={`h-4 w-4 ${wishlistIds.includes(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeView === 'cart' || activeView === 'checkout' || activeView === 'wishlist' || activeView === 'tracking') && (
              <CustomerPortal
                currentUserId={defaultCustomerId}
                onNavigate={(view) => setActiveView(view)}
                selectedProductIdState={selectedProduct}
                onClearSelectedProduct={() => setSelectedProduct(null)}
                cart={cart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onPlaceOrder={handlePlaceOrder}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        )}
      </div>

      {/* 4. PRODUCT DETAILS OVERVIEW (CUSTOM POPUP SHOWCASE) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Close Button Pin */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="p-6 md:p-8 space-y-6 text-xs text-gray-650">
              
              {/* Image grid & Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-xl border border-gray-100" />
                
                <div className="space-y-4">
                  <span className="bg-blue-50 text-blue-800 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded">
                    Factory Verified Source
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-md font-black text-gray-900 leading-tight">{selectedProduct.name}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">CODE: {selectedProduct.sku} | Vendor: {selectedProduct.vendorName}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(selectedProduct.rating) ? 'fill-amber-500 text-amber-505 font-black' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="font-extrabold text-gray-800">{selectedProduct.rating}</span>
                    <span className="text-gray-400 font-medium font-mono">({selectedProduct.reviewCount} customer reviews)</span>
                  </div>

                  {/* Dual Mode Card Options Retail vs Wholesale */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="border border-gray-150 p-3 rounded-xl bg-gray-50/50 text-center space-y-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">B2C Retail Price</span>
                      <strong className="text-sm font-black text-gray-800 block">₹{selectedProduct.retailPrice}</strong>
                      <span className="text-[8.5px] text-gray-400 block font-medium">No order minimums limit</span>
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct, 'RETAIL');
                          setSelectedProduct(null);
                        }}
                        className="w-full mt-2 bg-gray-900 hover:bg-black text-white font-bold py-1.5 rounded-lg text-[9.5px] cursor-pointer"
                      >
                        Select Retail
                      </button>
                    </div>

                    <div className="border border-blue-200 p-3 rounded-xl bg-blue-50/20 text-center space-y-1">
                      <span className="text-[9px] text-blue-600 font-black uppercase block">B2B Wholesale Price</span>
                      <strong className="text-sm font-black text-blue-700 block">₹{selectedProduct.wholesalePrice}</strong>
                      <span className="text-[8.5px] text-blue-600 block font-bold">Min MOQ: {selectedProduct.minimumOrderQuantity} lots</span>
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct, 'WHOLESALE');
                          setSelectedProduct(null);
                        }}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-[9.5px] cursor-pointer"
                      >
                        Select Bulk Unit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptions & spec list */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-sm border-l-4 border-l-blue-600 pl-2">Product Slogan Overview</h4>
                <p className="text-gray-650 leading-relaxed font-semibold italic text-xs">{selectedProduct.shortDescription}</p>
                
                <h4 className="font-bold text-gray-800 text-sm border-l-4 border-l-blue-600 pl-2">Full Tech Specifications</h4>
                <p className="text-gray-550 leading-relaxed">{selectedProduct.fullDescription}</p>

                <div className="grid grid-cols-2 gap-2 max-w-md text-xs py-2 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono">
                  <span><strong>Shipped Weight:</strong> {selectedProduct.weight || 0.5} kg</span>
                  <span><strong>Category Group:</strong> {selectedProduct.category}</span>
                  <span><strong>Available units:</strong> {selectedProduct.availableQuantity} qty</span>
                  <span><strong>Tags listed:</strong> {selectedProduct.tags.join(', ')}</span>
                </div>
              </div>

              {/* Reviews write & lists */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h4 className="font-bold text-gray-850 text-sm">Customer Reviews & Ratings</h4>
                
                {/* Form to leave a review */}
                <form onSubmit={handleSubmitReview} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <span className="font-bold block">Rate this Factory Item:</span>
                  <div className="flex gap-1.5 items-center">
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="p-1 px-2 border rounded bg-white font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="1">⭐ 1 Star</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Write your review comments here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded focus:border-blue-500 bg-white"
                  />
                  {revSuccess && <p className="text-emerald-600 font-bold block">✨ Thanks! Your rating and comments have been registered.</p>}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-md cursor-pointer"
                  >
                    Post Review Comment
                  </button>
                </form>

                {/* Display list */}
                <div className="space-y-3">
                  {StateEngine.getReviews()
                    .filter(r => r.productId === selectedProduct.id)
                    .map((rev) => (
                      <div key={rev.id} className="border-b border-gray-50 pb-2.5 space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-gray-400">
                          <strong>{rev.customerName}</strong>
                          <span>{rev.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <p className="text-gray-600 font-semibold">{rev.comment}</p>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER FRAME */}
      <Footer />

    </div>
  );
}
