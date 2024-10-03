const express = require('express');
const ensureAuthenticated = require('../Middlewares/Auth'); // Adjust path as necessary
const {
    getAllTransactions,
    addTransaction,
    deleteTransaction
} = require('../Controllers/ExpenseController');

const router = express.Router();

// Apply the authentication middleware to all expense routes
router.use(ensureAuthenticated);

// Define expense routes
router.get('/', getAllTransactions); // GET /expenses
router.post('/', addTransaction); // POST /expenses
router.delete('/:expenseId', deleteTransaction); // DELETE /expenses/:expenseId

module.exports = router; // Export the router
