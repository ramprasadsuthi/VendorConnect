/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Vendor,
  Category,
  SubCategory,
  Product,
  CustomerAddress,
  Order,
  SubscriptionPlan,
  Coupon,
  Advertisement,
  Review,
  SystemNotification,
  VendorSubscription
} from '../types';

// ==========================================
// 1. ORIGINAL SEED DATA CONFLICTS RESOLVER & ARRAYS
// ==========================================

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    description: 'Wholesale clothing, footwear, and trending retail fashion accessories.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Mobiles',
    slug: 'electronics-mobiles',
    description: 'Smartphones, microcontrollers, smart gadgets, and consumer electronic chips.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-home',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Premium cookware, ergonomic furniture, smart lighting, and appliances.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-groceries',
    name: 'Groceries & Foods',
    slug: 'groceries-foods',
    description: 'Bulk grains, spices, organic snacks, beverages, and daily provisions.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-furniture',
    name: 'Office & Home Furniture',
    slug: 'furniture',
    description: 'Wholesale desks, ergonomic office chairs, modular couches, and bedsets.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Organic skin serums, spa materials, wholesale cosmetics, and health supplements.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-sports',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Athletic gears, gym equipment, adventure backpacks, and performance clothing.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-books',
    name: 'Books & Stationary',
    slug: 'books-stationary',
    description: 'B2B office logs, textbooks, wholesale stationary kits, and digital manuals.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-automotive',
    name: 'Automotive & Spares',
    slug: 'automotive-spares',
    description: 'Car lubricants, LED headlights, brake pads, and bulk garages utility kits.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
  }
];

export const SEED_SUB_CATEGORIES: SubCategory[] = [
  { id: 'sub-f-mens', categoryId: 'cat-fashion', name: "Men's Apparel", slug: 'mens-apparel' },
  { id: 'sub-f-womens', categoryId: 'cat-fashion', name: "Women's Apparel", slug: 'womens-apparel' },
  { id: 'sub-f-shoes', categoryId: 'cat-fashion', name: "Footwear Bulk", slug: 'footwear-bulk' },
  { id: 'sub-e-mobiles', categoryId: 'cat-electronics', name: 'Smartphones', slug: 'smartphones' },
  { id: 'sub-e-audio', categoryId: 'cat-electronics', name: 'Audio & Wireless', slug: 'audio-wireless' },
  { id: 'sub-e-iot', categoryId: 'cat-electronics', name: 'IoT Boards & Components', slug: 'iot-boards' },
  { id: 'sub-h-appliances', categoryId: 'cat-home', name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
  { id: 'sub-h-decor', categoryId: 'cat-home', name: 'Decor & Curtains', slug: 'decor' },
  { id: 'sub-g-spices', categoryId: 'cat-groceries', name: 'Bulk Spices & Masala', slug: 'bulk-spices' },
  { id: 'sub-g-grains', categoryId: 'cat-groceries', name: 'Rice & Grains Bulk', slug: 'grains-bulk' },
  { id: 'sub-fur-office', categoryId: 'cat-furniture', name: 'Ergonomic Desking', slug: 'ergonomic-desks' },
  { id: 'sub-b-skin', categoryId: 'cat-beauty', name: 'Natural Skin Care', slug: 'skin-care' },
  { id: 'sub-s-fitness', categoryId: 'cat-sports', name: 'Treadmills & Gym Gears', slug: 'gym-equipment' }
];

export const SEED_VENDORS: Vendor[] = [
  {
    id: 'vnd-apex-apparel',
    userId: 'usr-vendor-apex',
    businessName: 'Apex Apparel India Pty',
    businessType: 'Both',
    ownerName: 'Vikram Aditya',
    gstNumber: '27AAAAA1111A1Z1',
    panNumber: 'AAAAA1111A',
    email: 'contact@apexapparel.in',
    mobile: '+91 98765 43210',
    address: 'B-402, Trade Tower, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400051',
    bankAccountDetails: {
      holder: 'Apex Apparel India Private Limited',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0000060',
      bankName: 'HDFC Bank Ltd'
    },
    upiId: 'apexapparel@okhdfc',
    businessLogo: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=150&q=80',
    businessBanner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'vnd-nextgen-elec',
    userId: 'usr-vendor-nextgen',
    businessName: 'NextGen Electronics Corp',
    businessType: 'Wholesale',
    ownerName: 'Anita Roy',
    gstNumber: '07BBBBB2222B2Z2',
    panNumber: 'BBBBB2222B',
    email: 'wholesale@nextgenelec.com',
    mobile: '+91 87654 32109',
    address: 'Sec-63, Electronic City Phase II',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '201301',
    bankAccountDetails: {
      holder: 'NextGen Electronics Corp',
      accountNumber: '912010045678941',
      ifsc: 'UTIB0000288',
      bankName: 'Axis Bank'
    },
    upiId: 'nextgenelec@okaxis',
    businessLogo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80',
    businessBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED',
    createdAt: '2026-02-14T09:15:00Z'
  },
  {
    id: 'vnd-organic-roots',
    userId: 'usr-vendor-organic',
    businessName: 'Organic Roots Spices Co.',
    businessType: 'Retail',
    ownerName: 'Devika Sharma',
    gstNumber: '29CCCCC3333C3Z3',
    panNumber: 'CCCCC3333C',
    email: 'info@organicroots.com',
    mobile: '+91 76543 21098',
    address: 'Plot 41-A, Malleshwaram Industrial Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560003',
    bankAccountDetails: {
      holder: 'Organic Roots Spices Co.',
      accountNumber: '00020100056156',
      ifsc: 'ICIC0000002',
      bankName: 'ICICI Bank'
    },
    upiId: 'organicroots@okicici',
    businessLogo: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=150&q=80',
    businessBanner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED',
    createdAt: '2026-03-20T14:30:00Z'
  },
  {
    id: 'vnd-krishna-handicrafts',
    userId: 'usr-vendor-krishna',
    businessName: 'Krishna Heritage Crafts',
    businessType: 'Both',
    ownerName: 'Radhe Shyam',
    gstNumber: '08DDDDD4444D4Z4',
    panNumber: 'DDDDD4444D',
    email: 'krishnacrafts@gmail.com',
    mobile: '+91 65432 10987',
    address: '15, Heritage Lane, Amer Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    pincode: '302001',
    bankAccountDetails: {
      holder: 'Krishna Heritage Crafts',
      accountNumber: '3029101034567',
      ifsc: 'SBIN0001243',
      bankName: 'State Bank of India'
    },
    upiId: 'krishnacrafts@oksbi',
    businessLogo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    businessBanner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    status: 'PENDING',
    createdAt: '2026-06-18T11:20:00Z' // Pending Approval by Admin
  },
  {
    id: 'vnd-bad-trader',
    userId: 'usr-vendor-suspended',
    businessName: 'Duplicate Copy Master',
    businessType: 'Retail',
    ownerName: 'Fake Seller',
    gstNumber: '27REJECT9999F9Z9',
    panNumber: 'REJEC9999F',
    email: 'fakes@duplicate.com',
    mobile: '+91 99999 88888',
    address: 'Counterfeit Street, Gariahat',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    pincode: '700019',
    bankAccountDetails: {
      holder: 'Duplicate Copy Master',
      accountNumber: '1111222233334444',
      ifsc: 'BARB0COLKOL',
      bankName: 'Bank of Baroda'
    },
    upiId: 'fakeseller@okbaroda',
    businessLogo: '',
    businessBanner: '',
    status: 'SUSPENDED',
    createdAt: '2026-04-01T12:00:00Z'
  }
];

export const SEED_PRODUCTS: Product[] = [
  // Fashion Products
  {
    id: 'prd-premium-cotton-shirt',
    vendorId: 'vnd-apex-apparel',
    vendorName: 'Apex Apparel India Pty',
    sku: 'TSH-COT-001',
    name: '100% Cotton Premium Men\'s Oxford Shirt',
    brand: 'Apex Threads',
    shortDescription: 'Super soft, breathable high-grade organic combed cotton Oxford shirt for formal and casual use.',
    fullDescription: 'Crafted from handpicked long-staple organic cotton fabric, this shirt features a double-stitched hem, classic spread collar, and mother-of-pearl buttons. Ideal for high-density corporate fashion retail as well as premium office uniforms. Color-fastness guaranteed up to 100 washes. Pre-washed to secure zero shrinkage.',
    category: 'Fashion & Apparel',
    subCategory: "Men's Apparel",
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    retailPrice: 1299,
    wholesalePrice: 450,
    minimumOrderQuantity: 30,
    availableQuantity: 4500,
    reservedQuantity: 120,
    soldQuantity: 1800,
    lowStockThreshold: 100,
    weight: 0.25,
    length: 30,
    width: 25,
    height: 3,
    tags: ['Shirt', 'Cotton', 'Mens Fashion', 'B2B Apparel', 'Wholesale Clothing'],
    status: 'APPROVED',
    rating: 4.6,
    reviewCount: 4,
    variants: [
      { id: 'v-ps-s', type: 'Size', value: 'S', priceModifier: 0 },
      { id: 'v-ps-m', type: 'Size', value: 'M', priceModifier: 0 },
      { id: 'v-ps-l', type: 'Size', value: 'L', priceModifier: 20 },
      { id: 'v-ps-xl', type: 'Size', value: 'XL', priceModifier: 30 },
      { id: 'v-pc-white', type: 'Color', value: 'Classic White', priceModifier: 0 },
      { id: 'v-pc-blue', type: 'Color', value: 'Oceanic Blue', priceModifier: 10 }
    ],
    createdAt: '2026-02-01T08:00:00Z'
  },
  {
    id: 'prd-unisex-hoodie-bulk',
    vendorId: 'vnd-apex-apparel',
    vendorName: 'Apex Apparel India Pty',
    sku: 'HUD-UNI-002',
    name: 'Over-Sized Streetwear Fleece Unisex Hoodie',
    brand: 'Apex Threads',
    shortDescription: 'Heavyweight 400 GSM brushed fleece French terry unisex hoodie.',
    fullDescription: 'Our premium oversized streetwear hoodie captures the exact minimalist aesthetic trending heavily in GenZ boutiques. Built with double-lined hoods, drop shoulders, kangaroo pocket, and authentic heavy ribbed cuffs. Custom branding options are available for wholesale orders over 200 units.',
    category: 'Fashion & Apparel',
    subCategory: "Men's Apparel",
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80'
    ],
    retailPrice: 2499,
    wholesalePrice: 850,
    minimumOrderQuantity: 20,
    availableQuantity: 2500,
    reservedQuantity: 40,
    soldQuantity: 950,
    lowStockThreshold: 50,
    weight: 0.65,
    length: 35,
    width: 28,
    height: 7,
    tags: ['Hoodie', 'Fleece', 'Streetwear', 'Unisex', 'Wholesale'],
    status: 'APPROVED',
    rating: 4.8,
    reviewCount: 2,
    variants: [
      { id: 'v-h-m', type: 'Size', value: 'M', priceModifier: 0 },
      { id: 'v-h-l', type: 'Size', value: 'L', priceModifier: 0 },
      { id: 'v-h-xl', type: 'Size', value: 'XL', priceModifier: 50 },
      { id: 'v-hc-charcoal', type: 'Color', value: 'Acid Charcoal', priceModifier: 0 },
      { id: 'v-hc-beige', type: 'Color', value: 'Sand Beige', priceModifier: 0 }
    ],
    createdAt: '2026-03-05T09:30:00Z'
  },

  // Electronics Products
  {
    id: 'prd-tws-pro-earbuds',
    vendorId: 'vnd-nextgen-elec',
    vendorName: 'NextGen Electronics Corp',
    sku: 'TWS-EAR-07',
    name: 'NextGen SonicBass Active Noise Cancelling Earbuds',
    brand: 'SonicBass',
    shortDescription: 'Bluetooth 5.3 earbuds featuring hybrid 35dB Active Noise Cancellation.',
    fullDescription: 'Industrial tier distributor stock. Integrated with premium JL7006 smart chipset for ultra stable connectivity, dual beamforming microphones with ENR state logic for absolute crystal-clear calls, 10mm dynamic titanium composite drivers. IPX5 waterproof casing, charging case with type-C fast charging support.',
    category: 'Electronics & Mobiles',
    subCategory: 'Audio & Wireless',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80'
    ],
    retailPrice: 3499,
    wholesalePrice: 1100,
    minimumOrderQuantity: 50,
    availableQuantity: 8000,
    reservedQuantity: 500,
    soldQuantity: 12000,
    lowStockThreshold: 200,
    weight: 0.12,
    length: 10,
    width: 10,
    height: 4,
    tags: ['TWS Earbuds', 'Wireless Earbuds', 'ANC', 'B2B Electronics', 'Bluetooth Earphones'],
    status: 'APPROVED',
    rating: 4.4,
    reviewCount: 3,
    variants: [
      { id: 'v-e-black', type: 'Color', value: 'Matte Black', priceModifier: 0 },
      { id: 'v-e-white', type: 'Color', value: 'Glossy White', priceModifier: 0 }
    ],
    createdAt: '2026-02-15T11:00:00Z'
  },
  {
    id: 'prd-esp32-development-board',
    vendorId: 'vnd-nextgen-elec',
    vendorName: 'NextGen Electronics Corp',
    sku: 'MCU-ESP32-S3',
    name: 'ESP32-WROOM-32E WiFi & BLE Microcontroller (Pack of 100)',
    brand: 'Espressif Systems',
    shortDescription: 'Industrial bulk IoT development components. Dual-core Xtensa 32-bit LX6 controller.',
    fullDescription: 'High-performing OEM stock ESP32 modules. Features integrated 4MB SPI flash, RF antennas, PCB micro-prints, ideal for high volume IoT developers, smart lighting systems, agricultural telemetry modules, automated switches, and collegiate tech labs. Sold strictly in wholesale quantities.',
    category: 'Electronics & Mobiles',
    subCategory: 'IoT Boards & Components',
    images: [
      'https://images.unsplash.com/photo-1517055729445-2b1a8d0092bf?auto=format&fit=crop&w=600&q=80'
    ],
    retailPrice: 22000, // For retail packs
    wholesalePrice: 13500,
    minimumOrderQuantity: 5, // 5 packs of 100 = 500 units
    availableQuantity: 400,
    reservedQuantity: 12,
    soldQuantity: 550,
    lowStockThreshold: 10,
    weight: 2.5,
    length: 22,
    width: 15,
    height: 10,
    tags: ['ESP32', 'Microcontroller', 'IoT Wholesaler', 'Hardware Spares', 'Arduino Compatible'],
    status: 'APPROVED',
    rating: 4.9,
    reviewCount: 1,
    variants: [],
    createdAt: '2026-03-01T14:00:00Z'
  },

  // Groceries / Herbs
  {
    id: 'prd-organic-turmeric-powder',
    vendorId: 'vnd-organic-roots',
    vendorName: 'Organic Roots Spices Co.',
    sku: 'SPC-TUR-010',
    name: 'Pure Organic Turmeric Powder (Curcumin 5%+ High Potency)',
    brand: 'Organic Roots',
    shortDescription: 'Premium single-origin high-curcumin Salem turmeric powder, certified organic.',
    fullDescription: 'A Grade turmeric sourced straight from organic farms of Salem. Rich golden yellow color, deep earthy aroma, and highly potent health qualities. Tested extensively against heavy metal impurities. Gluten-free, zero fillers, non-irradiated. Double vacuum sealed packaging to maintain maximum freshness.',
    category: 'Groceries & Foods',
    subCategory: 'Bulk Spices & Masala',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
    ],
    retailPrice: 240, // 500g package
    wholesalePrice: 110, // Cost per kg in bulk 50kg bags
    minimumOrderQuantity: 50, // 50 kg minimum
    availableQuantity: 12000,
    reservedQuantity: 500,
    soldQuantity: 23000,
    lowStockThreshold: 1000,
    weight: 1.0,
    length: 40,
    width: 30,
    height: 15,
    tags: ['Turmeric', 'Spices Bulk', 'Curcumin High', 'Salem Turmeric', 'Organic Spices'],
    status: 'APPROVED',
    rating: 4.7,
    reviewCount: 3,
    variants: [
      { id: 'v-t-500g', type: 'Capacity', value: '500g Stand-up Pouch', priceModifier: 0 },
      { id: 'v-t-1kg', type: 'Capacity', value: '1kg Eco-Pack', priceModifier: 180 },
      { id: 'v-t-bulk50', type: 'Capacity', value: '50kg Jute Gunny (Bulk)', priceModifier: 7000 }
    ],
    createdAt: '2026-03-25T11:30:00Z'
  },

  // Unapproved newly uploaded product (B2B Office Furniture)
  {
    id: 'prd-ergonomic-mesh-chair',
    vendorId: 'vnd-apex-apparel', // Utilizing active approved vendor for test
    vendorName: 'Apex Apparel India Pty',
    sku: 'FUR-OFF-088',
    name: 'Executive Ergonomic Dynamic High-Back Mesh Chair',
    brand: 'Apex Comforts',
    shortDescription: 'High back office desking chair featuring 3D lumbar Support and adjustable arms.',
    fullDescription: 'Unfinished approval test. Engineered to guarantee posture safety. Equipped with a breathable Korean mesh, synchronous multi-tilt lock mechanism, sturdy heavy duty nylon wheel caster wheelbase, soft PU armrests. Sourced directly for corporate workspace projects.',
    category: 'Office & Home Furniture',
    subCategory: 'Ergonomic Desking',
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80'
    ],
    retailPrice: 9499,
    wholesalePrice: 4200,
    minimumOrderQuantity: 10,
    availableQuantity: 300,
    reservedQuantity: 0,
    soldQuantity: 0,
    lowStockThreshold: 15,
    weight: 16.0,
    length: 65,
    width: 65,
    height: 120,
    tags: ['Mesh Chair', 'Office Chair', 'B2B Furniture', 'Ergonomic Chair'],
    status: 'PENDING_APPROVAL', // Requires Admin intervention
    rating: 0,
    reviewCount: 0,
    variants: [],
    createdAt: '2026-06-21T09:00:00Z'
  }
];

export const SEED_COUPONS: Coupon[] = [
  {
    id: 'cpn-welcome-100',
    code: 'WELCOME100',
    type: 'FLAT',
    value: 100,
    minOrderValue: 499,
    isActive: true,
    expiryDate: '2027-12-31',
    description: 'Flat ₹100 off on your first standard retail order above ₹499.'
  },
  {
    id: 'cpn-bulk-save-10',
    code: 'BULKDEAL10',
    type: 'PERCENTAGE',
    value: 10,
    minOrderValue: 5000,
    maxDiscount: 2000,
    isActive: true,
    expiryDate: '2026-12-31',
    description: 'Save 10% on highly dynamic commercial bulk items. Maximum discount ₹2,000.'
  },
  {
    id: 'cpn-apex-fest',
    code: 'APEXFASHION',
    type: 'PERCENTAGE',
    value: 15,
    minOrderValue: 1500,
    vendorId: 'vnd-apex-apparel',
    isActive: true,
    expiryDate: '2026-08-30',
    description: 'Exclusive 15% off on Apex Apparel items for custom catalog fashion purchases.'
  }
];

export const SEED_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 999,
    duration: 'month',
    maxProducts: 100,
    features: [
      'List up to 100 products',
      'Standard Retail Storefront',
      'Basic Performance Analytics',
      'Standard Payment Settlements (T+3)',
      'Email Customer Support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 2999,
    duration: 'month',
    maxProducts: 1000,
    features: [
      'List up to 1,000 products',
      'Wired Wholesale & Retail store links',
      'Interactive Recharts BI Reports',
      'Custom discount tags & coupons',
      'Express Settlements (T+1)',
      'Priority Phone Support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 9999,
    duration: 'month',
    maxProducts: 999999,
    features: [
      'Unlimited product uploads',
      'Dedicated Custom Domain setup',
      'Automated Inventory APIs Integration',
      '0% commission overrides for sponsored zones',
      'Direct Key Account Manager',
      'Custom SLA & 24/7 Hotline support'
    ]
  }
];

export const SEED_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad-summer-wear',
    title: 'Up to 60% Off on Bulk Cotton Garments!',
    type: 'HOMEPAGE_BANNER',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=500',
    targetId: 'cat-fashion',
    position: 1,
    budget: 15000,
    clicks: 440,
    impressions: 12500,
    isActive: true,
    startDate: '2026-06-01',
    endDate: '2026-07-31'
  },
  {
    id: 'ad-sonicbuds-promo',
    title: 'SonicBass ANC Premium Earbuds - Sponsored Top Placement',
    type: 'FEATURED_PRODUCT',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    targetId: 'prd-tws-pro-earbuds',
    position: 2,
    budget: 8000,
    clicks: 180,
    impressions: 5900,
    isActive: true,
    startDate: '2026-06-15',
    endDate: '2026-07-15'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prd-premium-cotton-shirt',
    customerId: 'usr-cust-ram',
    customerName: 'Ramprasad Suthi',
    rating: 5,
    comment: 'Exceptional wholesale cotton grade. Standard size fitting fits perfectly, fabric doesn\'t shrink. Highly satisfied with Apex Apparel and will buy more lots!',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80'],
    createdAt: '2026-05-12T10:15:00Z'
  },
  {
    id: 'rev-02',
    productId: 'prd-premium-cotton-shirt',
    customerId: 'usr-cust-alok',
    customerName: 'Alok Mishra',
    rating: 4,
    comment: 'Quality Oxford shirt look. Blue color variant is slightly heavy, perfect for executive wears.',
    images: [],
    createdAt: '2026-05-20T14:22:00Z'
  },
  {
    id: 'rev-03',
    productId: 'prd-tws-pro-earbuds',
    customerId: 'usr-cust-priya',
    customerName: 'Priya Nair',
    rating: 4,
    comment: 'Awesome sound for this price level! ANC works decent in low drone traffic environments. Battery life is easily 6 hours on earbud units.',
    images: [],
    createdAt: '2026-06-02T16:05:00Z'
  }
];

export const SEED_ADDRESSES: CustomerAddress[] = [
  {
    id: 'adr-cust-1',
    customerId: 'usr-customer-demo',
    label: 'Home Delivery Address',
    name: 'Ramprasad Suthi',
    mobile: '+91 99911 22334',
    addressLine: 'A-212, Lotus Apartments, Sector 15, Dwarka',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    pincode: '110075',
    isDefault: true
  },
  {
    id: 'adr-cust-2',
    customerId: 'usr-customer-demo',
    label: 'Corporate Office',
    name: 'Ramprasad Suthi (DevHQ)',
    mobile: '+91 99911 88888',
    addressLine: 'DLF CyberCity, Building 10-B, Floor 44',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    pincode: '122002',
    isDefault: false
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VH-2026-1001',
    customerId: 'usr-customer-demo',
    customerName: 'Ramprasad Suthi',
    customerEmail: 'ramprasadsuthi@gmail.com',
    vendorId: 'vnd-apex-apparel',
    vendorBusinessName: 'Apex Apparel India Pty',
    items: [
      {
        productId: 'prd-premium-cotton-shirt',
        name: '100% Cotton Premium Men\'s Oxford Shirt',
        sku: 'TSH-COT-001',
        price: 450,
        quantity: 40, // wholesale order example
        sellType: 'WHOLESALE',
        selectedVariant: 'Size: L, Color: Classic White',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=150&q=80'
      }
    ],
    subtotal: 18000,
    gstAmount: 3240, // 18% GST
    shippingFee: 450,
    discountAmount: 1800, // Coupon applied
    couponApplied: 'BULKDEAL10',
    total: 19890,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    shippingAddress: SEED_ADDRESSES[0],
    createdAt: '2026-06-10T12:00:00Z',
    lastUpdated: '2026-06-13T10:00:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'VH-2026-1002',
    customerId: 'usr-customer-demo',
    customerName: 'Ramprasad Suthi',
    customerEmail: 'ramprasadsuthi@gmail.com',
    vendorId: 'vnd-nextgen-elec',
    vendorBusinessName: 'NextGen Electronics Corp',
    items: [
      {
        productId: 'prd-tws-pro-earbuds',
        name: 'NextGen SonicBass Active Noise Cancelling Earbuds',
        sku: 'TWS-EAR-07',
        price: 3499,
        quantity: 1, // Retail order example
        sellType: 'RETAIL',
        selectedVariant: 'Color: Matte Black',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=150&q=80'
      }
    ],
    subtotal: 3499,
    gstAmount: 629.82, // 18% standard electronic GST
    shippingFee: 80,
    discountAmount: 100, // Welcome coupon
    couponApplied: 'WELCOME100',
    total: 4108.82,
    paymentMethod: 'DEBIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    shippingAddress: SEED_ADDRESSES[0],
    createdAt: '2026-06-20T15:30:00Z',
    lastUpdated: '2026-06-21T18:00:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'VH-2026-1003',
    customerId: 'usr-customer-demo',
    customerName: 'Ramprasad Suthi',
    customerEmail: 'ramprasadsuthi@gmail.com',
    vendorId: 'vnd-organic-roots',
    vendorBusinessName: 'Organic Roots Spices Co.',
    items: [
      {
        productId: 'prd-organic-turmeric-powder',
        name: 'Pure Organic Turmeric Powder (Curcumin 5%+ High Potency)',
        sku: 'SPC-TUR-010',
        price: 110,
        quantity: 50, // Wholesale minimum MOQ
        sellType: 'WHOLESALE',
        selectedVariant: 'Capacity: 1kg Eco-Pack',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=150&q=80'
      }
    ],
    subtotal: 5500,
    gstAmount: 275, // 5% Food standard GST
    shippingFee: 300,
    discountAmount: 0,
    total: 6075,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING',
    orderStatus: 'CONFIRMED',
    shippingAddress: SEED_ADDRESSES[1],
    createdAt: '2026-06-22T09:12:00Z',
    lastUpdated: '2026-06-22T10:30:00Z'
  }
];

export const SEED_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'ntf-01',
    recipientId: 'ALL_ADMINS',
    title: 'New Vendor Registration Received',
    message: '"Krishna Heritage Crafts" from Jaipur has registered as a Wholesale/Retail seller and is pending verification reviews.',
    type: 'ALERT',
    isRead: false,
    createdAt: '2026-06-18T11:21:00Z'
  },
  {
    id: 'ntf-02',
    recipientId: 'ALL_ADMINS',
    title: 'Product Pending Approval Warning',
    message: '"Executive Ergonomic Dynamic High-Back Mesh Chair" uploaded by Apex Apparel needs editorial inspection before live publishing.',
    type: 'INFO',
    isRead: false,
    createdAt: '2026-06-21T09:02:00Z'
  },
  {
    id: 'ntf-03',
    recipientId: 'vnd-apex-apparel',
    title: 'Bulk Sale Notification!',
    message: 'Congratulations! You received a wholesale bulk order (VH-2026-1001) for 40 Cotton Shirts from customer Ramprasad Suthi.',
    type: 'SUCCESS',
    isRead: false,
    createdAt: '2026-06-10T12:02:00Z'
  }
];

export const SEED_VENDOR_SUBSCRIPTIONS: VendorSubscription[] = [
  {
    vendorId: 'vnd-apex-apparel',
    planId: 'professional',
    startDate: '2026-06-01',
    endDate: '2026-07-01',
    status: 'ACTIVE',
    autoRenew: true
  },
  {
    vendorId: 'vnd-nextgen-elec',
    planId: 'enterprise',
    startDate: '2026-05-15',
    endDate: '2026-11-15',
    status: 'ACTIVE',
    autoRenew: true
  },
  {
    vendorId: 'vnd-organic-roots',
    planId: 'starter',
    startDate: '2026-06-10',
    endDate: '2026-07-10',
    status: 'ACTIVE',
    autoRenew: false
  }
];

// ==========================================
// 2. ACTIVE LOCALSTORAGE ENGINE (STATE SYNC)
// ==========================================

function getStored<T>(key: string, defaultSeed: T[]): T[] {
  try {
    const val = localStorage.getItem(`vh_${key}`);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.error(`Error loading state ${key}`, e);
  }
  localStorage.setItem(`vh_${key}`, JSON.stringify(defaultSeed));
  return defaultSeed;
}

function setStored<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(`vh_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving state ${key}`, e);
  }
}

export class StateEngine {
  // Categories API
  static getCategories(): Category[] {
    return getStored<Category>('categories', SEED_CATEGORIES);
  }
  static saveCategory(cat: Category) {
    const data = this.getCategories();
    const idx = data.findIndex(c => c.id === cat.id);
    if (idx >= 0) data[idx] = cat;
    else data.push(cat);
    setStored('categories', data);
  }
  static deleteCategory(id: string) {
    const data = this.getCategories().filter(c => c.id !== id);
    setStored('categories', data);
  }

  // SubCategories API
  static getSubCategories(): SubCategory[] {
    return getStored<SubCategory>('subcategories', SEED_SUB_CATEGORIES);
  }
  static saveSubCategory(sub: SubCategory) {
    const data = this.getSubCategories();
    const idx = data.findIndex(s => s.id === sub.id);
    if (idx >= 0) data[idx] = sub;
    else data.push(sub);
    setStored('subcategories', data);
  }

  // Vendors API
  static getVendors(): Vendor[] {
    return getStored<Vendor>('vendors', SEED_VENDORS);
  }
  static saveVendor(vendor: Vendor) {
    const data = this.getVendors();
    const idx = data.findIndex(v => v.id === vendor.id);
    if (idx >= 0) data[idx] = vendor;
    else data.push(vendor);
    setStored('vendors', data);
  }
  static updateVendorStatus(id: string, status: Vendor['status']) {
    const data = this.getVendors();
    const idx = data.findIndex(v => v.id === id);
    if (idx >= 0) {
      data[idx].status = status;
      setStored('vendors', data);

      // Create Notification
      this.addNotification({
        id: `ntf-evt-${Date.now()}`,
        recipientId: data[idx].userId,
        title: `Your Business Status Updated`,
        message: `Administrators have marked your business "Apex Threads / Apex Apparel Pty" as ${status}.`,
        type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Products API
  static getProducts(): Product[] {
    return getStored<Product>('products', SEED_PRODUCTS);
  }
  static saveProduct(prod: Product) {
    const data = this.getProducts();
    const idx = data.findIndex(p => p.id === prod.id);
    if (idx >= 0) data[idx] = prod;
    else data.push(prod);
    setStored('products', data);
  }
  static updateProductStatus(id: string, status: Product['status']) {
    const data = this.getProducts();
    const idx = data.findIndex(p => p.id === id);
    if (idx >= 0) {
      data[idx].status = status;
      setStored('products', data);

      this.addNotification({
        id: `ntf-p-${Date.now()}`,
        recipientId: data[idx].vendorId,
        title: `Product Release Approved`,
        message: `Your catalog product "${data[idx].name}" is now marked as ${status} and is publicly listed.`,
        type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }
  static deleteProduct(id: string) {
    const data = this.getProducts().filter(p => p.id !== id);
    setStored('products', data);
  }
  static duplicateProduct(id: string) {
    const data = this.getProducts();
    const target = data.find(p => p.id === id);
    if (target) {
      const copy: Product = {
        ...target,
        id: `prd-dup-${Date.now()}`,
        sku: `${target.sku}-DUP`,
        name: `${target.name} (Copy)`,
        createdAt: new Date().toISOString(),
        soldQuantity: 0,
        reservedQuantity: 0,
        status: 'PENDING_APPROVAL' // Needs approval again
      };
      data.push(copy);
      setStored('products', data);
    }
  }

  // Coupons API
  static getCoupons(): Coupon[] {
    return getStored<Coupon>('coupons', SEED_COUPONS);
  }
  static saveCoupon(coupon: Coupon) {
    const data = this.getCoupons();
    const idx = data.findIndex(c => c.id === coupon.id);
    if (idx >= 0) data[idx] = coupon;
    else data.push(coupon);
    setStored('coupons', data);
  }
  static deleteCoupon(id: string) {
    const data = this.getCoupons().filter(c => c.id !== id);
    setStored('coupons', data);
  }

  // Reviews API
  static getReviews(): Review[] {
    return getStored<Review>('reviews', SEED_REVIEWS);
  }
  static addReview(review: Review) {
    const data = this.getReviews();
    data.unshift(review); // Prepend new review
    setStored('reviews', data);

    // Update product rating average
    const prods = this.getProducts();
    const pIdx = prods.findIndex(p => p.id === review.productId);
    if (pIdx >= 0) {
      const pReviews = data.filter(r => r.productId === review.productId);
      const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
      prods[pIdx].rating = Number(avg.toFixed(1));
      prods[pIdx].reviewCount = pReviews.length;
      this.saveProduct(prods[pIdx]);
    }
  }

  // Addresses API
  static getAddresses(customerId: string): CustomerAddress[] {
    return getStored<CustomerAddress>('addresses', SEED_ADDRESSES).filter(a => a.customerId === customerId);
  }
  static saveAddress(addr: CustomerAddress) {
    const data = getStored<CustomerAddress>('addresses', SEED_ADDRESSES);
    if (addr.isDefault) {
      // Set all other of this customer to false
      data.forEach(a => {
        if (a.customerId === addr.customerId) a.isDefault = false;
      });
    }
    const idx = data.findIndex(a => a.id === addr.id);
    if (idx >= 0) data[idx] = addr;
    else data.push(addr);
    setStored('addresses', data);
  }
  static deleteAddress(id: string) {
    const data = getStored<CustomerAddress>('addresses', SEED_ADDRESSES).filter(a => a.id !== id);
    setStored('addresses', data);
  }

  // Orders API
  static getOrders(): Order[] {
    return getStored<Order>('orders', SEED_ORDERS);
  }
  static saveOrder(order: Order) {
    const data = this.getOrders();
    const idx = data.findIndex(o => o.id === order.id);
    if (idx >= 0) data[idx] = order;
    else data.push(order);
    setStored('orders', data);
  }
  static updateOrderStatus(id: string, status: Order['orderStatus']) {
    const data = this.getOrders();
    const idx = data.findIndex(o => o.id === id);
    if (idx >= 0) {
      data[idx].orderStatus = status;
      data[idx].lastUpdated = new Date().toISOString();
      setStored('orders', data);

      // Notify customer
      this.addNotification({
        id: `ntf-ord-${Date.now()}`,
        recipientId: data[idx].customerId,
        title: `Order Status: ${status.replace(/_/g, ' ')}`,
        message: `Your Order ${data[idx].orderNumber} has been updated to "${status.replace(/_/g, ' ')}".`,
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }
  static updateOrderPaymentStatus(id: string, status: Order['paymentStatus']) {
    const data = this.getOrders();
    const idx = data.findIndex(o => o.id === id);
    if (idx >= 0) {
      data[idx].paymentStatus = status;
      data[idx].lastUpdated = new Date().toISOString();
      setStored('orders', data);
    }
  }

  // Notifications API
  static getNotifications(userId: string): SystemNotification[] {
    const all = getStored<SystemNotification>('notifications', SEED_NOTIFICATIONS);
    return all.filter(n => n.recipientId === userId || (userId === 'usr-admin-demo' && n.recipientId === 'ALL_ADMINS'));
  }
  static addNotification(ntf: SystemNotification) {
    const data = getStored<SystemNotification>('notifications', SEED_NOTIFICATIONS);
    data.unshift(ntf);
    setStored('notifications', data);
  }
  static markNotificationRead(id: string) {
    const data = getStored<SystemNotification>('notifications', SEED_NOTIFICATIONS);
    const idx = data.findIndex(n => n.id === id);
    if (idx >= 0) {
      data[idx].isRead = true;
      setStored('notifications', data);
    }
  }

  // Subscriptions Active API
  static getVendorSubscription(vendorId: string): VendorSubscription {
    const subs = getStored<VendorSubscription>('vendorsubs', SEED_VENDOR_SUBSCRIPTIONS);
    const sub = subs.find(s => s.vendorId === vendorId);
    if (sub) return sub;

    // Return dummy default
    return {
      vendorId,
      planId: 'starter',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: 'ACTIVE',
      autoRenew: false
    };
  }
  static subscribe(vendorId: string, planId: VendorSubscription['planId']) {
    const subs = getStored<VendorSubscription>('vendorsubs', SEED_VENDOR_SUBSCRIPTIONS);
    const idx = subs.findIndex(s => s.vendorId === vendorId);
    const sDate = new Date();
    const eDate = new Date();
    eDate.setMonth(eDate.getMonth() + 1);

    const newSub: VendorSubscription = {
      vendorId,
      planId,
      startDate: sDate.toISOString().split('T')[0],
      endDate: eDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      autoRenew: true
    };

    if (idx >= 0) subs[idx] = newSub;
    else subs.push(newSub);
    setStored('vendorsubs', subs);
  }

  // Advertisements
  static getAdvertisements(): Advertisement[] {
    return getStored<Advertisement>('ads', SEED_ADVERTISEMENTS);
  }
  static saveAdvertisement(ad: Advertisement) {
    const data = this.getAdvertisements();
    const idx = data.findIndex(a => a.id === ad.id);
    if (idx >= 0) data[idx] = ad;
    else data.push(ad);
    setStored('ads', data);
  }
}
