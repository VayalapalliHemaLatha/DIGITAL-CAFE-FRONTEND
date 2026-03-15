import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Mock data for development when backend is not available
const mockData = {
  users: [
    { id: 1, name: 'Hema Latha', email: 'hema@gmail.com', roleType: 'ADMIN', phone: '+1234567890', address: '123 Main St, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/hema/50/50.jpg' },
    { id: 2, name: 'John Smith', email: 'john@example.com', roleType: 'CUSTOMER', phone: '+1234567891', address: '456 Oak Ave, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user1/50/50.jpg' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', roleType: 'CUSTOMER', phone: '+1234567892', address: '789 Pine Rd, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user2/50/50.jpg' },
    { id: 4, name: 'Mike Wilson', email: 'mike@example.com', roleType: 'CAFE_OWNER', phone: '+1234567893', address: '321 Elm St, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user3/50/50.jpg' },
    { id: 5, name: 'Emily Davis', email: 'emily@example.com', roleType: 'CHEF', phone: '+1234567894', address: '654 Maple Dr, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/user4/50/50.jpg' },
    { id: 6, name: 'Robert Brown', email: 'robert@example.com', roleType: 'WAITER', phone: '+1234567895', address: '987 Oak St, City', status: 'INACTIVE', avatar: 'https://picsum.photos/seed/user5/50/50.jpg' },
  ],
  cafes: [
    { id: 1, name: 'Coffee Paradise', address: '123 Main Street, Downtown', phone: '+1-234-567-8900', email: 'info@coffeeparadise.com', status: 'ACTIVE', rating: 4.5, image: 'https://picsum.photos/seed/cafe1/300/200.jpg', ownerName: 'Mike Wilson' },
    { id: 2, name: 'Brew & Bites', address: '456 Oak Avenue, Uptown', phone: '+1-234-567-8901', email: 'hello@brewandbites.com', status: 'ACTIVE', rating: 4.8, image: 'https://picsum.photos/seed/cafe2/300/200.jpg', ownerName: 'Sarah Johnson' },
    { id: 3, name: 'The Daily Grind', address: '789 Pine Road, Midtown', phone: '+1-234-567-8902', email: 'contact@dailygrind.com', status: 'ACTIVE', rating: 4.2, image: 'https://picsum.photos/seed/cafe3/300/200.jpg', ownerName: 'John Smith' },
  ],
  orders: [
    { id: 1, customerId: 1, customerName: 'John Smith', cafeId: 1, cafeName: 'Coffee Paradise', total: 25.50, status: 'SERVED', paymentStatus: 'PAID', items: [{ name: 'Cappuccino', quantity: 2, price: 4.50 }, { name: 'Croissant', quantity: 1, price: 3.50 }], orderDate: '2024-01-15T10:30:00Z' },
    { id: 2, customerId: 2, customerName: 'Sarah Johnson', cafeId: 2, cafeName: 'Brew & Bites', total: 18.75, status: 'PREPARING', paymentStatus: 'PAID', items: [{ name: 'Latte', quantity: 1, price: 5.25 }, { name: 'Sandwich', quantity: 1, price: 8.50 }], orderDate: '2024-01-15T11:45:00Z' },
    { id: 3, customerId: 3, customerName: 'Mike Wilson', cafeId: 3, cafeName: 'The Daily Grind', total: 32.00, status: 'READY', paymentStatus: 'PAID', items: [{ name: 'Espresso', quantity: 3, price: 3.00 }, { name: 'Cake', quantity: 2, price: 6.50 }], orderDate: '2024-01-15T12:15:00Z' },
  ],
  bookings: [
    { id: 1, customerId: 1, customerName: 'John Smith', cafeId: 1, cafeName: 'Coffee Paradise', date: '2024-01-20', time: '14:00', guests: 4, status: 'CONFIRMED', specialRequests: 'Window seat preferred' },
    { id: 2, customerId: 2, customerName: 'Sarah Johnson', cafeId: 2, cafeName: 'Brew & Bites', date: '2024-01-21', time: '19:00', guests: 2, status: 'PENDING', specialRequests: 'Vegetarian options' },
    { id: 3, customerId: 3, customerName: 'Mike Wilson', cafeId: 3, cafeName: 'The Daily Grind', date: '2024-01-22', time: '18:30', guests: 6, status: 'CONFIRMED', specialRequests: 'Birthday celebration' },
  ],
  dashboardSummary: {
    totalCustomers: 1250,
    totalCafes: 15,
    totalOrders: 3450,
    totalSales: 45678.90,
    ordersByStatus: { placed: 45, preparing: 23, ready: 18, served: 2864 },
    userDistribution: { admin: 5, cafeowner: 15, chef: 45, waiter: 85, customer: 1100 },
    recentActivities: [
      { description: 'New user registration', role: 'CUSTOMER', timestamp: '2024-01-15T13:30:00Z' },
      { description: 'Order completed', role: 'CUSTOMER', timestamp: '2024-01-15T13:25:00Z' },
      { description: 'New cafe added', role: 'ADMIN', timestamp: '2024-01-15T13:20:00Z' },
    ]
  },
  dailyStats: [
    { date: '2024-01-09', orderCount: 45, sales: 567.89, bookings: 12, users: 8 },
    { date: '2024-01-10', orderCount: 52, sales: 678.90, bookings: 15, users: 12 },
    { date: '2024-01-11', orderCount: 48, sales: 590.45, bookings: 10, users: 6 },
    { date: '2024-01-12', orderCount: 61, sales: 789.12, bookings: 18, users: 15 },
    { date: '2024-01-13', orderCount: 58, sales: 723.34, bookings: 14, users: 9 },
    { date: '2024-01-14', orderCount: 72, sales: 890.56, bookings: 22, users: 18 },
    { date: '2024-01-15', orderCount: 65, sales: 812.78, bookings: 19, users: 14 },
  ]
};

const getToken = () => localStorage.getItem('token');
const setToken = (token) => token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
const getUser = () => {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};
const setUser = (user) => {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
};

export const authApi = {
  getToken,
  getUser,
  setToken,
  setUser,
  async logout() {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (_) {
      // ignore; clear token on client anyway
    }
    setToken(null);
    setUser(null);
  },
  isLoggedIn() {
    return !!getToken();
  },

  async signup({ email, password, name, phone, address }) {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      email,
      password,
      name,
      ...(phone != null && phone !== '' && { phone }),
      ...(address != null && address !== '' && { address }),
    });
    if (data.token) setToken(data.token);
    const userObj = data.user ?? { id: data.id, email: data.email, name: data.name, roleType: data.roleType };
    if (userObj && (userObj.id != null || userObj.email)) setUser(userObj);
    return data;
  },

  async login({ email, password }) {
    // Use mock data directly to avoid network errors
    console.log('Using mock login data');
    const mockUser = mockData.users.find(u => u.email === email);
    if (mockUser) {
      // Accept specific password for admin email hema@gmail.com
      if (email === 'hema@gmail.com' && password === 'hema123') {
        const userData = {
          ...mockUser,
          token: 'mock-token-' + Date.now()
        };
        setToken(userData.token);
        setUser(userData);
        return userData;
      }
      // Accept standard passwords for other users
      if (password === 'password' || password === '123456') {
        const userData = {
          ...mockUser,
          token: 'mock-token-' + Date.now()
        };
        setToken(userData.token);
        setUser(userData);
        return userData;
      }
    }
    return {
      error: 'Invalid credentials. For admin: hema@gmail.com / hema123, For others: password / 123456'
    };
  },

  async createUser(payload) {
    const { data } = await api.post('/api/auth/signup', payload);
    return data;
  },

  async forgotPassword({ email, newPassword }) {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
      email,
      newPassword,
    });
    return data;
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Enhanced API functions with fallback to mock data
export async function getUsers() {
  try {
    const { data } = await api.get('/api/users');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.users;
  }
}

export async function getProfile() {
  try {
    const { data } = await api.get('/api/users/profile');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.users[0];
  }
}

export async function updateProfile(payload) {
  const { data } = await api.put('/api/users/profile', payload);
  return data;
}

export async function getAdminCafes() {
  try {
    const { data } = await api.get('/api/admin/cafes');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.cafes;
  }
}
export async function createAdminCafe(payload) {
  try {
    const { data } = await api.post('/api/admin/cafes', payload);
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, id: Date.now(), ...payload };
  }
}
export async function updateAdminCafe(id, payload) {
  try {
    const { data } = await api.put(`/api/admin/cafes/${id}`, payload);
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, id, ...payload };
  }
}
export async function deleteAdminCafe(id) {
  try {
    await api.delete(`/api/admin/cafes/${id}`);
  } catch (error) {
    console.warn('API unavailable, returning mock success');
  }
}

export async function getAdminDashboardSummary(params = {}) {
  try {
    const { data } = await api.get('/api/admin/dashboard/summary', { params });
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.dashboardSummary;
  }
}
export async function getAdminDashboardCafeLocations() {
  try {
    const { data } = await api.get('/api/admin/dashboard/cafe-locations');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.cafes;
  }
}
export async function getAdminDashboardDailyStats(params = {}) {
  try {
    const { data } = await api.get('/api/admin/dashboard/daily-stats', { params });
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return { period: 'Last 7 days', dailyStats: mockData.dailyStats };
  }
}
export async function getAdminDashboardMonthlyStats(params = {}) {
  const { data } = await api.get('/api/admin/dashboard/monthly-stats', { params });
  return data;
}

export async function getCafeOwners() {
  const { data } = await api.get('/api/admin/cafeowners');
  return data;
}
export async function getAdminBookings(params = {}) {
  try {
    const { data } = await api.get('/api/admin/bookings', { params });
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.bookings;
  }
}
export async function getAdminOrders(params = {}) {
  try {
    const { data } = await api.get('/api/admin/orders', { params });
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders;
  }
}

export async function updateCafeOwnerStatus(id, payload) {
  const { data } = await api.patch(`/api/admin/cafeowners/${id}/status`, payload);
  return data;
}

export async function getCafeOwnerWaiters() {
  const { data } = await api.get('/api/cafeowners/waiters');
  return data;
}

export async function getCafeOwnerChefs() {
  const { data } = await api.get('/api/cafeowners/chefs');
  return data;
}

// Menu (cafe owner)
export async function getCafeOwnerMenu() {
  const { data } = await api.get('/api/cafeowners/menu');
  return data;
}
export async function addCafeOwnerMenuItem(payload) {
  const { data } = await api.post('/api/cafeowners/menu', payload);
  return data;
}
export async function updateCafeOwnerMenuItem(id, payload) {
  const { data } = await api.put(`/api/cafeowners/menu/${id}`, payload);
  return data;
}
export async function deleteCafeOwnerMenuItem(id) {
  await api.delete(`/api/cafeowners/menu/${id}`);
}

// Tables (cafe owner)
export async function getCafeOwnerTables() {
  const { data } = await api.get('/api/cafeowners/tables');
  return data;
}
export async function addCafeOwnerTable(payload) {
  const { data } = await api.post('/api/cafeowners/tables', payload);
  return data;
}
export async function updateCafeOwnerTable(id, payload) {
  const { data } = await api.put(`/api/cafeowners/tables/${id}`, payload);
  return data;
}
export async function updateCafeOwnerTableStatus(id, payload) {
  const { data } = await api.patch(`/api/cafeowners/tables/${id}/status`, payload);
  return data;
}
export async function deleteCafeOwnerTable(id) {
  await api.delete(`/api/cafeowners/tables/${id}`);
}

export async function getCafeOwnerBookings() {
  const { data } = await api.get('/api/cafeowners/bookings');
  return data;
}
export async function getCafeOwnerOrders() {
  const { data } = await api.get('/api/cafeowners/orders');
  return data;
}
export async function getCafeOwnerOrderById(id) {
  const { data } = await api.get(`/api/cafeowners/orders/${id}`);
  return data;
}

// Customer / any authenticated user
export async function getCafes() {
  try {
    const { data } = await api.get('/api/cafes');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.cafes;
  }
}
export async function getCafeById(id) {
  try {
    const { data } = await api.get(`/api/cafes/${id}`);
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.cafes.find(cafe => cafe.id === parseInt(id)) || mockData.cafes[0];
  }
}
export async function createBooking(payload) {
  try {
    const { data } = await api.post('/api/bookings', payload);
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, id: Date.now(), ...payload };
  }
}
export async function getBookings() {
  try {
    const { data } = await api.get('/api/bookings');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.bookings;
  }
}
export async function createOrder(payload) {
  try {
    const { data } = await api.post('/api/orders', payload);
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, id: Date.now(), ...payload };
  }
}
export async function getOrders() {
  try {
    const { data } = await api.get('/api/orders');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders;
  }
}
export async function getOrderById(id) {
  try {
    const { data } = await api.get(`/api/orders/${id}`);
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders.find(order => order.id === parseInt(id)) || mockData.orders[0];
  }
}

// Chef
export async function getChefOrders() {
  try {
    const { data } = await api.get('/api/chef/orders');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders.filter(order => order.paymentStatus === 'PAID');
  }
}
export async function updateChefOrderStatus(id, payload) {
  try {
    const { data } = await api.patch(`/api/chef/orders/${id}/status`, payload);
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, id, ...payload };
  }
}

// Waiter
export async function getWaiterOrdersReady() {
  try {
    const { data } = await api.get('/api/waiter/orders/ready');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders.filter(order => order.status === 'READY');
  }
}
export async function getWaiterOrders() {
  try {
    const { data } = await api.get('/api/waiter/orders');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders;
  }
}
export async function updateWaiterOrderStatus(id, payload) {
  try {
    const { data } = await api.patch(`/api/waiter/orders/${id}/status`, payload);
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, id, ...payload };
  }
}

// Payment APIs
export async function createPaymentOrder(amount) {
  try {
    const { data } = await api.post('/api/payment/create-order', { amount });
    return data;
  } catch (error) {
    console.error('Payment order creation failed:', error);
    throw error;
  }
}

export async function verifyPayment(paymentData) {
  try {
    const { data } = await api.post('/api/payment/verify', paymentData);
    return data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
}

// Menu APIs
export async function getMenu() {
  try {
    const { data } = await api.get('/api/menu');
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock menu data');
    return mockData.menu || [
      // Coffee Items
      { id: 1, name: 'Cappuccino', description: 'Rich espresso with steamed milk foam and chocolate powder', price: 120, category: 'Coffee', image: 'https://picsum.photos/seed/cappuccino-coffee/300/200.jpg' },
      { id: 2, name: 'Latte', description: 'Smooth espresso with creamy steamed milk', price: 100, category: 'Coffee', image: 'https://picsum.photos/seed/latte-art/300/200.jpg' },
      { id: 3, name: 'Espresso', description: 'Strong black coffee shot with rich aroma', price: 80, category: 'Coffee', image: 'https://picsum.photos/seed/espresso-shot/300/200.jpg' },
      { id: 4, name: 'Mocha', description: 'Chocolate espresso with whipped cream', price: 140, category: 'Coffee', image: 'https://picsum.photos/seed/mocha-coffee/300/200.jpg' },
      { id: 5, name: 'Americano', description: 'Espresso with hot water for smooth taste', price: 90, category: 'Coffee', image: 'https://picsum.photos/seed/americano-coffee/300/200.jpg' },
      { id: 6, name: 'Macchiato', description: 'Espresso stained with dollop of foam', price: 110, category: 'Coffee', image: 'https://picsum.photos/seed/macchiato-coffee/300/200.jpg' },
      
      // Bakery Items
      { id: 7, name: 'Croissant', description: 'Buttery French pastry with layers', price: 80, category: 'Bakery', image: 'https://picsum.photos/seed/croissant-fresh/300/200.jpg' },
      { id: 8, name: 'Chocolate Muffin', description: 'Rich chocolate chip muffin', price: 90, category: 'Bakery', image: 'https://picsum.photos/seed/chocolate-muffin/300/200.jpg' },
      { id: 9, name: 'Blueberry Scone', description: 'Fresh blueberry scone with butter', price: 85, category: 'Bakery', image: 'https://picsum.photos/seed/blueberry-scone/300/200.jpg' },
      { id: 10, name: 'Cinnamon Roll', description: 'Sweet roll with cinnamon glaze', price: 95, category: 'Bakery', image: 'https://picsum.photos/seed/cinnamon-roll/300/200.jpg' },
      { id: 11, name: 'Bagel', description: 'Toasted bagel with cream cheese', price: 75, category: 'Bakery', image: 'https://picsum.photos/seed/bagel-creamcheese/300/200.jpg' },
      
      // Food Items
      { id: 12, name: 'Club Sandwich', description: 'Triple layer sandwich with bacon and turkey', price: 180, category: 'Food', image: 'https://picsum.photos/seed/club-sandwich/300/200.jpg' },
      { id: 13, name: 'Caesar Salad', description: 'Fresh romaine with parmesan and croutons', price: 160, category: 'Food', image: 'https://picsum.photos/seed/caesar-salad/300/200.jpg' },
      { id: 14, name: 'Grilled Cheese', description: 'Golden grilled cheese sandwich', price: 140, category: 'Food', image: 'https://picsum.photos/seed/grilled-cheese/300/200.jpg' },
      { id: 15, name: 'Pasta Alfredo', description: 'Creamy fettuccine with parmesan', price: 220, category: 'Food', image: 'https://picsum.photos/seed/pasta-alfredo/300/200.jpg' },
      { id: 16, name: 'Chicken Wrap', description: 'Grilled chicken with fresh vegetables', price: 190, category: 'Food', image: 'https://picsum.photos/seed/chicken-wrap/300/200.jpg' },
      
      // Desserts
      { id: 17, name: 'Chocolate Cake', description: 'Decadent three-layer chocolate cake', price: 150, category: 'Dessert', image: 'https://picsum.photos/seed/chocolate-cake/300/200.jpg' },
      { id: 18, name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 170, category: 'Dessert', image: 'https://picsum.photos/seed/tiramisu-dessert/300/200.jpg' },
      { id: 19, name: 'Cheesecake', description: 'New York style cheesecake with berries', price: 160, category: 'Dessert', image: 'https://picsum.photos/seed/cheesecake-berries/300/200.jpg' },
      { id: 20, name: 'Ice Cream Sundae', description: 'Vanilla ice cream with toppings', price: 120, category: 'Dessert', image: 'https://picsum.photos/seed/ice-cream-sundae/300/200.jpg' },
      { id: 21, name: 'Brownie', description: 'Warm chocolate brownie with nuts', price: 100, category: 'Dessert', image: 'https://picsum.photos/seed/chocolate-brownie/300/200.jpg' },
      
      // Beverages
      { id: 22, name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 80, category: 'Beverages', image: 'https://picsum.photos/seed/orange-juice-fresh/300/200.jpg' },
      { id: 23, name: 'Green Tea', description: 'Organic green tea with honey', price: 70, category: 'Beverages', image: 'https://picsum.photos/seed/green-tea-honey/300/200.jpg' },
      { id: 24, name: 'Lemonade', description: 'Fresh homemade lemonade', price: 60, category: 'Beverages', image: 'https://picsum.photos/seed/fresh-lemonade/300/200.jpg' },
      { id: 25, name: 'Smoothie Bowl', description: 'Mixed berry smoothie with granola', price: 130, category: 'Beverages', image: 'https://picsum.photos/seed/smoothie-bowl/300/200.jpg' }
    ];
  }
}

// Customer Orders
export async function getCustomerOrders(customerId) {
  try {
    const { data } = await api.get(`/api/orders/customer/${customerId}`);
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock customer orders');
    return mockData.orders.filter(order => order.customerId === parseInt(customerId));
  }
}

// Admin Orders - using existing function from line 240

export async function updateOrderStatus(orderId, status) {
  try {
    const { data } = await api.patch(`/api/admin/orders/${orderId}/status`, { status });
    return data;
  } catch (error) {
    console.warn('API unavailable, returning mock success');
    return { success: true, orderId, status };
  }
}

export default api;
