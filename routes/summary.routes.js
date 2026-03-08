const express = require('express');
const router = express.Router();
const { getTransactionSummary } = require('../controllers/transaction.controller');

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Fetch income-expense summary with category breakdown
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Summary returned successfully
 *       401:
 *         description: Not authorized
 */
router.get('/', getTransactionSummary);

module.exports = router;
