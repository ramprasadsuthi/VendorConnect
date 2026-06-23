/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { registerVendor, approveVendor, getVendorAnalytics } from '../controllers/vendorController.js';

const router = express.Router();

/**
 * Middleware: Simple mock Authenticate JWT and check specific user Role
 */
export const checkRole = (rolesAllowed) => {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role']; // Passed securely by API gateway
    if (!userRole) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!rolesAllowed.includes(userRole)) {
      return res.status(403).json({ error: 'Access Denied: Insufficient permissions.' });
    }
    next();
  };
};

// --- VENDOR ENDPOINTS ---
router.post('/vendors/register', registerVendor);
router.post('/vendors/:vendorId/approve', checkRole(['ADMIN']), approveVendor);
router.get('/vendors/:vendorId/analytics', checkRole(['ADMIN', 'VENDOR']), getVendorAnalytics);

// --- PRODUCT CATALOG ENDPOINTS ---
router.post('/products', checkRole(['VENDOR']), async (req, res) => {
  // Real implementation would handle multiple product image S3 uploads
  res.status(201).json({ success: true, message: 'Product submitted for review.' });
});

export default router;
