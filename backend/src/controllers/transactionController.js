import { Transaction } from '../models/index.js';
import { Op } from 'sequelize';

export const addTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, type, category, date, paymentMethod, description, notes } = req.body;

    // Validate input
    if (!amount || !type || !category || !date || !paymentMethod) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      category,
      date: new Date(date),
      paymentMethod,
      description,
      notes,
    });

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add transaction', error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build filter conditions
    const where = { userId };
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      transactions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transaction', error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { amount, type, category, date, paymentMethod, description, notes } = req.body;

    const transaction = await Transaction.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update({
      amount: amount || transaction.amount,
      type: type || transaction.type,
      category: category || transaction.category,
      date: date ? new Date(date) : transaction.date,
      paymentMethod: paymentMethod || transaction.paymentMethod,
      description: description !== undefined ? description : transaction.description,
      notes: notes !== undefined ? notes : transaction.notes,
    });

    res.json({
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update transaction', error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get all transactions for user
    const allTransactions = await Transaction.findAll({
      where: { userId },
    });

    // Get current month transactions
    const currentMonthTransactions = await Transaction.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: currentMonth,
          [Op.lt]: nextMonth,
        },
      },
    });

    // Calculate totals
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const currentMonthExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balance = totalIncome - totalExpense;

    // Get recent transactions
    const recentTransactions = await Transaction.findAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit: 5,
    });

    // Get category breakdown
    const categoryBreakdown = {};
    allTransactions.forEach(t => {
      if (t.type === 'expense') {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + parseFloat(t.amount);
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance,
      currentMonthExpense,
      recentTransactions,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
};

export const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['date', 'ASC']],
    });

    // Get monthly data
    const monthlyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyData[monthKey].income += parseFloat(t.amount);
      } else {
        monthlyData[monthKey].expense += parseFloat(t.amount);
      }
    });

    // Format monthly data for charts
    const monthlyTrend = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }));

    // Get category breakdown
    const categoryData = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryData[t.category] = (categoryData[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const categoryBreakdown = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({
      monthlyTrend,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics data', error: error.message });
  }
};
