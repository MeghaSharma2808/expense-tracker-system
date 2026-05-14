import express from 'express';
import {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
  getAnalyticsData,
} from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, addTransaction);
router.get('/', authenticateToken, getTransactions);
router.get('/dashboard-data', authenticateToken, getDashboardData);
router.get('/analytics-data', authenticateToken, getAnalyticsData);
router.get('/:id', authenticateToken, getTransactionById);
router.put('/:id', authenticateToken, updateTransaction);
router.delete('/:id', authenticateToken, deleteTransaction);

export default router;
