import axios from 'axios';

// Render Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://expense-tracker-backend-dpto.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// AUTH API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) =>
    api.post('/auth/change-password', data),
};

// TRANSACTION API
export const transactionAPI = {
  addTransaction: (data) =>
    api.post('/transactions', data),

  getTransactions: (params) =>
    api.get('/transactions', { params }),

  getTransaction: (id) =>
    api.get(`/transactions/${id}`),

  updateTransaction: (id, data) =>
    api.put(`/transactions/${id}`, data),

  deleteTransaction: (id) =>
    api.delete(`/transactions/${id}`),

  getDashboardData: () =>
    api.get('/transactions/dashboard-data'),

  getAnalyticsData: () =>
    api.get('/transactions/analytics-data'),
};

// BUDGET API
export const budgetAPI = {
  setBudget: (data) =>
    api.post('/budget', data),

  getBudget: () =>
    api.get('/budget'),

  deleteBudget: (id) =>
    api.delete(`/budget/${id}`),
};

export default api;
