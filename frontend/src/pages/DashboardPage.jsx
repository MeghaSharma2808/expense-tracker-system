import { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { transactionAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getDashboardData();
      setDashboardData(response.data);

      // Fetch analytics data for monthly trend
      const analyticsResponse = await transactionAPI.getAnalyticsData();
      setMonthlyData(analyticsResponse.data.monthlyTrend || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      label: 'Total Income',
      value: dashboardData?.totalIncome || 0,
      icon: TrendingUp,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Expense',
      value: dashboardData?.totalExpense || 0,
      icon: TrendingDown,
      color: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: 'Balance',
      value: dashboardData?.balance || 0,
      icon: Wallet,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Monthly Expense',
      value: dashboardData?.currentMonthExpense || 0,
      icon: Target,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-dark">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-dark mt-2">
                      {formatCurrency(stat.value)}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className={`${stat.iconColor}`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-dark mb-4">Monthly Trend</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-dark mb-4">Recent Transactions</h2>
            {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-light rounded-lg">
                    <div>
                      <p className="font-medium text-dark">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                    <span
                      className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {dashboardData?.categoryBreakdown && Object.keys(dashboardData.categoryBreakdown).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-dark mb-4">Spending by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(dashboardData.categoryBreakdown).map(([category, amount]) => (
                <div key={category} className="p-4 bg-light rounded-lg">
                  <p className="text-gray-600 capitalize">{category}</p>
                  <p className="text-xl font-bold text-dark mt-2">{formatCurrency(amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
