const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getTransactionSummary } = require('../controllers/transaction.controller');

router.use(protect);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totals:
 *                   type: object
 *                   properties:
 *                     income: { type: 'number' }
 *                     expense: { type: 'number' }
 *                     net: { type: 'number' }
 *                 breakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getTransactionSummary);

module.exports = router;
