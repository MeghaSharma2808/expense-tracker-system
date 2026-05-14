// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format month-year
export const formatMonthYear = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
  });
};

// Show toast notification
export const showToast = (message, type = 'success') => {
  const event = new CustomEvent('toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
};

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎬',
    utilities: '💡',
    health: '🏥',
    shopping: '🛍️',
    education: '📚',
    salary: '💰',
    bonus: '🎁',
    investment: '📈',
    other: '📌',
  };
  return icons[category?.toLowerCase()] || '📌';
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#FFE66D',
    utilities: '#95E1D3',
    health: '#FF6348',
    shopping: '#FF69B4',
    education: '#4D96FF',
    salary: '#51CF66',
    bonus: '#FFD700',
    investment: '#6C5CE7',
    other: '#CCCCCC',
  };
  return colors[category?.toLowerCase()] || '#CCCCCC';
};
