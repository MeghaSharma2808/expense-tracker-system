import { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { transactionAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Edit2, Trash2, Search } from 'lucide-react';
import { showToast } from '../utils/helpers';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, [filters.page, filters.type, filters.category, filters.limit]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getTransactions({
        type: filters.type || undefined,
        category: filters.category || undefined,
        page: filters.page,
        limit: filters.limit,
      });
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      showToast('Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        showToast('Transaction deleted successfully!');
      } catch (error) {
        showToast('Failed to delete transaction', 'error');
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await transactionAPI.updateTransaction(id, editData);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...editData } : t))
      );
      setEditingId(null);
      showToast('Transaction updated successfully!');
    } catch (error) {
      showToast('Failed to update transaction', 'error');
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
    t.category.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-dark">Transactions</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value, page: 1 }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Health">Health</option>
              <option value="Shopping">Shopping</option>
              <option value="Education">Education</option>
              <option value="Salary">Salary</option>
              <option value="Bonus">Bonus</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>

            {/* Limit */}
            <select
              value={filters.limit}
              onChange={(e) => setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No transactions found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Payment Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-light transition-colors">
                        <td className="px-6 py-4 text-sm text-dark">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-dark">
                          {editingId === transaction.id ? (
                            <input
                              type="text"
                              value={editData.description || ''}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              className="px-2 py-1 border border-gray-300 rounded"
                            />
                          ) : (
                            transaction.description
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-dark">
                          {editingId === transaction.id ? (
                            <input
                              type="text"
                              value={editData.category || ''}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                }))
                              }
                              className="px-2 py-1 border border-gray-300 rounded"
                            />
                          ) : (
                            transaction.category
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-dark">
                          {editingId === transaction.id ? (
                            <input
                              type="number"
                              value={editData.amount || ''}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  amount: parseFloat(e.target.value),
                                }))
                              }
                              className="px-2 py-1 border border-gray-300 rounded w-20"
                              step="0.01"
                            />
                          ) : (
                            formatCurrency(transaction.amount)
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {transaction.paymentMethod?.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          {editingId === transaction.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(transaction.id)}
                                className="text-green-600 hover:text-green-700 font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="text-primary hover:text-blue-600"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-light">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
