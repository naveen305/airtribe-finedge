const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetComparison
} = require('../controllers/budget.controller');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Monthly budget management
 */

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Create a monthly budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *             properties:
 *               month:
 *                 type: string
 *                 example: "2026-03"
 *               incomeGoal:
 *                 type: number
 *               expenseLimit:
 *                 type: number
 *               savingsTarget:
 *                 type: number
 *               categories:
 *                 type: object
 *     responses:
 *       201:
 *         description: Budget created
 *       400:
 *         description: Budget already exists or invalid data
 *       401:
 *         description: Not authorized
 */
router.post('/', createBudget);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets for the logged-in user
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets
 *       401:
 *         description: Not authorized
 */
router.get('/', getBudgets);

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Get a single budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget found
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Not authorized
 */
router.get('/:id', getBudgetById);

/**
 * @swagger
 * /api/budgets/{id}:
 *   patch:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               incomeGoal:
 *                 type: number
 *               expenseLimit:
 *                 type: number
 *               savingsTarget:
 *                 type: number
 *               categories:
 *                 type: object
 *     responses:
 *       200:
 *         description: Budget updated
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Not authorized
 */
router.patch('/:id', updateBudget);

/**
 * @swagger
 * /api/budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Not authorized
 */
router.delete('/:id', deleteBudget);

/**
 * @swagger
 * /api/budgets/{id}/comparison:
 *   get:
 *     summary: Compare budget targets vs actual transactions for the month
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comparison data returned
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Not authorized
 */
router.get('/:id/comparison', getBudgetComparison);

module.exports = router;
