import { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { budgetAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { showToast } from '../utils/helpers';
import { AlertCircle } from 'lucide-react';

export const BudgetPage = () => {
  const [budget, setBudget] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await budgetAPI.getBudget();
      setBudget(response.data);
      setBudgetAmount(response.data.budget?.amount || '');
    } catch (error) {
      showToast('Failed to fetch budget', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!budgetAmount) newErrors.budgetAmount = 'Budget amount is required';
    else if (parseFloat(budgetAmount) <= 0) newErrors.budgetAmount = 'Budget must be greater than 0';
    return newErrors;
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      await budgetAPI.setBudget({
        amount: parseFloat(budgetAmount),
        monthYear,
      });

      await fetchBudget();
      setIsEditing(false);
      showToast('Budget set successfully!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to set budget', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !budget) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg">Loading budget...</p>
        </div>
      </MainLayout>
    );
  }

  const budgetLimit = budget?.budget?.amount || 0;
  const spent = budget?.currentExpense || 0;
  const remaining = budget?.remaining || 0;
  const percentage = budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0;
  const isOverBudget = remaining < 0;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-dark">Budget</h1>

        {/* Current Month Budget */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-dark mb-6">
            Current Month Budget
          </h2>

          {!isEditing ? (
            <>
              {budgetLimit > 0 ? (
                <div className="space-y-6">
                  {/* Budget Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Budget Limit</p>
                      <p className="text-2xl font-bold text-primary mt-2">
                        {formatCurrency(budgetLimit)}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Already Spent</p>
                      <p className="text-2xl font-bold text-red-600 mt-2">
                        {formatCurrency(spent)}
                      </p>
                    </div>
                    <div
                      className={`${isOverBudget ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg`}
                    >
                      <p className="text-gray-600 text-sm">
                        {isOverBudget ? 'Overspent' : 'Remaining'}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-2 ${
                          isOverBudget ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatCurrency(Math.abs(remaining))}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-dark">
                        Progress: {percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(spent)} of {formatCurrency(budgetLimit)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentage > 100
                            ? 'bg-red-500'
                            : percentage > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Warning Message */}
                  {isOverBudget && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                      <div>
                        <p className="font-semibold text-red-600">Budget Exceeded</p>
                        <p className="text-sm text-red-600 mt-1">
                          You have overspent by {formatCurrency(Math.abs(remaining))}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Edit Budget
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No budget set for this month</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Set Budget
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Monthly Budget Amount
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => {
                    setBudgetAmount(e.target.value);
                    if (errors.budgetAmount) setErrors({});
                  }}
                  placeholder="Enter budget amount"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.budgetAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  step="0.01"
                />
                {errors.budgetAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.budgetAmount}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Budget'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                  }}
                  className="flex-1 bg-gray-300 text-dark py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Budget Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-dark mb-3">Budget Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Set a realistic monthly budget based on your income</li>
            <li>• Review your budget regularly to ensure it aligns with your goals</li>
            <li>• Track all expenses to avoid exceeding your budget</li>
            <li>• Plan for unexpected expenses by keeping a buffer</li>
            <li>• Use the analytics page to identify spending patterns</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};
