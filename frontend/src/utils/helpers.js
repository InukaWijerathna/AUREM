export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const getErrorMessage = (error) =>
  error?.data?.message || error?.message || 'Something went wrong';

export const truncate = (str, length = 100) =>
  str?.length > length ? `${str.substring(0, length)}...` : str;

export const slugToTitle = (slug) =>
  slug
    ?.split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const addToRecentlyViewed = (product) => {
  try {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = viewed.filter((p) => p._id !== product._id);
    const updated = [product, ...filtered].slice(0, 6);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  } catch {}
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  } catch {
    return [];
  }
};
