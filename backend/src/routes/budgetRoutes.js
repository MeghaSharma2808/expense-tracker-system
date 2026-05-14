import express from 'express';
import {
  setBudget,
  getBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, setBudget);
router.get('/', authenticateToken, getBudget);
router.delete('/:id', authenticateToken, deleteBudget);

export default router;
