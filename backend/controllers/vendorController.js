/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import db from '../db.js';

/**
 * Express Controller handling vendor registration, listings, and verification workflows.
 */
export const registerVendor = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      userId,
      businessName,
      businessType,
      ownerName,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      city,
      state,
      country,
      pincode,
      bankName,
      bankHolderName,
      bankAccountNumber,
      bankIfsc,
      upiId
    } = req.body;

    // Validate GST Format (Simple India Regex Check)
    if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
      return res.status(400).json({ error: 'Invalid GST Number layout format.' });
    }

    const vendorId = `vnd-${Date.now()}`;

    // Insert Vendor details
    const insertVendorQuery = `
      INSERT INTO vendors (
        id, user_id, business_name, business_type, owner_name, gst_number, pan_number, 
        email, mobile, address, city, state, country, pincode, 
        bank_name, bank_holder_name, bank_account_number, bank_ifsc, upi_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    await connection.execute(insertVendorQuery, [
      vendorId, userId, businessName, businessType, ownerName, gstNumber, panNumber,
      email, mobile, address, city, state, country, pincode,
      bankName, bankHolderName, bankAccountNumber, bankIfsc, upiId
    ]);

    // Insert Audit Log entry
    const insertAuditQuery = `
      INSERT INTO audit_logs (actor_id, action, target_table, target_id, details)
      VALUES (?, 'REGISTER_VENDOR', 'vendors', ?, ?)
    `;
    await connection.execute(insertAuditQuery, [
      userId,
      vendorId,
      JSON.stringify({ businessName, registeredAt: new Date().toISOString() })
    ]);

    await connection.commit();
    res.status(201).json({ success: true, vendorId, message: 'Vendor registration submitted. Pending Admin approval.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

export const approveVendor = async (req, res) => {
  const { vendorId } = req.params;
  const { status, actorId } = req.body; // status: APPROVED, REJECTED, SUSPENDED

  if (!['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status update specified.' });
  }

  try {
    const updateQuery = 'UPDATE vendors SET status = ? WHERE id = ?';
    await db.execute(updateQuery, [status, vendorId]);

    // Create system notification for vendor user
    const [rows] = await db.execute('SELECT user_id, business_name FROM vendors WHERE id = ?', [vendorId]);
    if (rows.length > 0) {
      const vendorUser = rows[0];
      await db.execute(`
        INSERT INTO notifications (id, recipient_id, title, message, type)
        VALUES (?, ?, 'Business Status Updated', ?, 'INFO')
      `, [
        `ntf-${Date.now()}`,
        vendorUser.user_id,
        `Your vendor store "${vendorUser.business_name}" is marked as ${status} by admin.`
      ]);
    }

    // Audit log
    await db.execute(`
      INSERT INTO audit_logs (actor_id, action, target_table, target_id, details)
      VALUES (?, 'UPDATE_VENDOR_STATUS', 'vendors', ?, ?)
    `, [actorId, vendorId, JSON.stringify({ updatedStatus: status })]);

    res.json({ success: true, message: `Vendor updated successfully to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendorAnalytics = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM products WHERE vendor_id = ?) as total_products,
        (SELECT COUNT(*) FROM orders WHERE vendor_id = ?) as total_orders,
        (SELECT IFNULL(SUM(total), 0) FROM orders WHERE vendor_id = ? AND payment_status = 'PAID') as total_revenue
    `;
    const [stats] = await db.execute(statsQuery, [vendorId, vendorId, vendorId]);
    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
