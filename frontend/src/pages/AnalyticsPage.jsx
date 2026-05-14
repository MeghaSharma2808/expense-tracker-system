import { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { transactionAPI } from '../services/api';
import { showToast } from '../utils/helpers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAnalyticsData();
      setAnalyticsData(response.data);
    } catch (error) {
      showToast('Failed to fetch analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }

  const monthlyTrend = analyticsData?.monthlyTrend || [];
  const categoryBreakdown = analyticsData?.categoryBreakdown || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-dark">Analytics</h1>

        {monthlyTrend.length > 0 ? (
          <>
            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-dark mb-4">Monthly Income vs Expense</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trend Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-dark mb-4">Monthly Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" />
                  <Bar dataKey="expense" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No monthly data available
          </div>
        )}

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-dark mb-4 text-center">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-dark mb-4">Category Breakdown</h2>
              <div className="space-y-3">
                {categoryBreakdown.map((item, index) => {
                  const totalSpent = categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0);
                  const percentage = ((item.value / totalSpent) * 100).toFixed(1);
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-dark capitalize">{item.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-dark w-16 text-right">
                        {percentage}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No category data available
          </div>
        )}

        {/* Summary Statistics */}
        {monthlyTrend.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-dark mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ₹{monthlyTrend.reduce((sum, m) => sum + m.income, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Expense</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  ₹{monthlyTrend.reduce((sum, m) => sum + m.expense, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Net Savings</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  ₹{(monthlyTrend.reduce((sum, m) => sum + m.income, 0) - monthlyTrend.reduce((sum, m) => sum + m.expense, 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
