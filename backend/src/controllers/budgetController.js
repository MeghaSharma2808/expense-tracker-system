import { Budget, Transaction } from '../models/index.js';
import { Op } from 'sequelize';

export const setBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, monthYear } = req.body;

    if (!amount || !monthYear) {
      return res.status(400).json({ message: 'Amount and monthYear are required' });
    }

    // Check if budget already exists for this month
    const existingBudget = await Budget.findOne({
      where: { userId, monthYear },
    });

    let budget;
    if (existingBudget) {
      await existingBudget.update({ amount });
      budget = existingBudget;
    } else {
      budget = await Budget.create({
        userId,
        amount,
        monthYear,
      });
    }

    res.status(201).json({
      message: 'Budget set successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set budget', error: error.message });
  }
};

export const getBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budget = await Budget.findOne({
      where: { userId, monthYear },
    });

    // Get current month expenses
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const expenses = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        date: {
          [Op.gte]: currentMonth,
          [Op.lt]: nextMonth,
        },
      },
    });

    const totalExpense = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    res.json({
      budget: budget || { userId, monthYear, amount: 0 },
      currentExpense: totalExpense,
      remaining: budget ? budget.amount - totalExpense : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budget', error: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await Budget.findOne({
      where: { id, userId },
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.destroy();

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget', error: error.message });
  }
};
