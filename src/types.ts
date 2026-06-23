/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  mobile?: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessType: 'Retail' | 'Wholesale' | 'Both';
  ownerName: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bankAccountDetails: {
    holder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  upiId: string;
  businessLogo?: string;
  businessBanner?: string;
  businessDocuments?: {
    name: string;
    url: string;
  }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  type: 'Size' | 'Color' | 'Material' | 'Capacity' | 'Style';
  value: string;
  priceModifier: number; // Applied on top of base prices
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  sku: string;
  name: string;
  brand: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subCategory?: string;
  images: string[];
  videoUrl?: string;
  retailPrice: number;
  wholesalePrice: number;
  minimumOrderQuantity: number; // Required for wholesale
  availableQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  lowStockThreshold: number;
  weight?: number; // in kg
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  tags: string[];
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item UI identifier
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: {
    [key: string]: string; // Variant type -> value
  };
  sellType: 'RETAIL' | 'WHOLESALE';
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string; // "Home", "Work", "Other"
  name: string;
  mobile: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vendorId: string;
  vendorBusinessName: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    sellType: 'RETAIL' | 'WHOLESALE';
    selectedVariant?: string;
    image: string;
  }[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discountAmount: number;
  couponApplied?: string;
  total: number;
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_ON_DELIVERY';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: CustomerAddress;
  createdAt: string;
  lastUpdated: string;
}

export interface SubscriptionPlan {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  price: number; // in INR
  duration: 'month' | 'year';
  maxProducts: number;
  features: string[];
}

export interface VendorSubscription {
  vendorId: string;
  planId: 'starter' | 'professional' | 'enterprise';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  autoRenew: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'FLAT' | 'PERCENTAGE';
  value: number; // ₹ discount or % discount
  minOrderValue: number;
  vendorId?: string; // If vendor-specific
  categoryId?: string; // If category-specific
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  description: string;
}

export interface Advertisement {
  id: string;
  title: string;
  type: 'HOMEPAGE_BANNER' | 'FEATURED_PRODUCT' | 'SPONSORED_VENDOR';
  imageUrl: string;
  targetId: string; // Product ID or Vendor ID or Category ID
  position: number;
  budget: number;
  clicks: number;
  impressions: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  images: string[];
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  recipientId: string; // UserId or 'ALL_ADMINS'
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}
