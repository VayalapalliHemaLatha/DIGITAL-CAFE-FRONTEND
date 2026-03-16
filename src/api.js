import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Mock data for development when backend is not available
const mockData = {
  users: [
    { id: 1, name: 'Hema Latha', email: 'hema@gmail.com', roleType: 'ADMIN', phone: '+1234567890', address: '123 Main St, City', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/hema/50/50.jpg' },
    { id: 7, name: 'Penki', email: 'penki@gmail.com', roleType: 'CUSTOMER', phone: '', address: '', status: 'ACTIVE', avatar: 'https://picsum.photos/seed/penki/50/50.jpg' },
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
    { id: 1, customerId: 1, customerName: 'John Smith', cafeId: 1, cafeName: 'Coffee Paradise', total: 25.50, status: 'SERVED', paymentStatus: 'PAID', items: [{ name: 'Artisan Cappuccino', quantity: 2, price: 4.50, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&fit=crop' }, { name: 'Butter Croissant', quantity: 1, price: 3.50, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&fit=crop' }], orderDate: '2024-01-15T10:30:00Z' },
    { id: 2, customerId: 2, customerName: 'Sarah Johnson', cafeId: 2, cafeName: 'Brew & Bites', total: 18.75, status: 'PREPARING', paymentStatus: 'PAID', items: [{ name: 'Signature Latte', quantity: 1, price: 5.25, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=100&fit=crop' }, { name: 'Pain au Chocolat', quantity: 1, price: 8.50, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=100&fit=crop' }], orderDate: '2024-01-15T11:45:00Z' },
    { id: 3, customerId: 3, customerName: 'Mike Wilson', cafeId: 3, cafeName: 'The Daily Grind', total: 32.00, status: 'READY', paymentStatus: 'PAID', items: [{ name: 'Double Espresso', quantity: 3, price: 3.00, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&fit=crop' }, { name: 'Berry Sensation Tart', quantity: 2, price: 6.50, image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=100&fit=crop' }], orderDate: '2024-01-15T12:15:00Z' },
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
    const userObj = data.user ?? {
      id: data.userId ?? data.id,
      email: data.email,
      name: data.name,
      roleType: data.roleType ?? 'CUSTOMER',
    };
    if (userObj && (userObj.id != null || userObj.email)) setUser(userObj);
    return data;
  },

  async login({ email, password }) {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    if (data.token) setToken(data.token);
    const userObj = data.user ?? {
      id: data.userId ?? data.id,
      email: data.email,
      name: data.name,
      roleType: data.roleType ?? 'CUSTOMER',
    };
    if (userObj && (userObj.id != null || userObj.email)) setUser(userObj);
    return data;
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
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockData.orders;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders;
  }
}

export async function updateCafeOwnerStatus(id, payload) {
  const { data } = await api.patch(`/api/admin/cafeowners/${id}/status`, payload);
  return data;
}

const mockStaff = [
  { id: 1, name: 'Waiter One', role: 'WAITER', active: true },
  { id: 2, name: 'Chef One', role: 'CHEF', active: true },
];

export async function getCafeOwnerWaiters() {
  try {
    const { data } = await api.get('/api/cafeowners/waiters');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockStaff.filter(s => (s.role || '').toLowerCase() === 'waiter');
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockStaff.filter(s => (s.role || '').toLowerCase() === 'waiter');
  }
}

export async function getCafeOwnerChefs() {
  try {
    const { data } = await api.get('/api/cafeowners/chefs');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockStaff.filter(s => (s.role || '').toLowerCase() === 'chef');
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockStaff.filter(s => (s.role || '').toLowerCase() === 'chef');
  }
}

const mockCafeOwnerMenu = [
  { id: 1, name: 'Artisan Cappuccino', price: 120, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&fit=crop' },
  { id: 2, name: 'Signature Latte', price: 100, category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&fit=crop' },
  { id: 3, name: 'Turkish Gold Coffee', price: 140, category: 'Coffee', image: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?w=400&fit=crop' },
  { id: 4, name: 'Artisan Sourdough', price: 180, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop' },
  { id: 5, name: 'Madagascar Creme Brulee', price: 180, category: 'Dessert', image: 'https://images.unsplash.com/photo-1470124118117-0524a29a5fc7?w=400&fit=crop' },
  { id: 6, name: 'Red Velvet Lava Cake', price: 210, category: 'Dessert', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&fit=crop' },
  { id: 7, name: 'Cold Pressed Orange', price: 120, category: 'Beverages', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&fit=crop' },
  { id: 8, name: 'Blueberry Smoothie Bowl', price: 240, category: 'Beverages', image: 'https://images.unsplash.com/photo-1494597706938-de2cd7341979?w=400&fit=crop' },
];

// Menu (cafe owner)
export async function getCafeOwnerMenu() {
  try {
    const { data } = await api.get('/api/cafeowners/menu');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockCafeOwnerMenu;
  } catch (error) {
    console.warn('API unavailable, using mock menu');
    return mockCafeOwnerMenu;
  }
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

const mockCafeOwnerTables = [
  { id: 1, tableNumber: 'T1', capacity: 2, status: 'AVAILABLE' },
  { id: 2, tableNumber: 'T2', capacity: 4, status: 'OCCUPIED' },
  { id: 3, tableNumber: 'T3', capacity: 6, status: 'AVAILABLE' },
];

// Tables (cafe owner)
export async function getCafeOwnerTables() {
  try {
    const { data } = await api.get('/api/cafeowners/tables');
    const list = Array.isArray(data) ? data : (data?.tables ?? []);
    return list.length > 0 ? list : mockCafeOwnerTables;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockCafeOwnerTables;
  }
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
  try {
    const { data } = await api.get('/api/cafeowners/bookings');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockData.bookings;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.bookings;
  }
}
export async function getCafeOwnerOrders() {
  try {
    const { data } = await api.get('/api/cafeowners/orders');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockData.orders;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.orders;
  }
}
export async function getCafeOwnerOrderById(id) {
  try {
    const { data } = await api.get(`/api/cafeowners/orders/${id}`);
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock order');
    return mockData.orders.find(o => o.id === parseInt(id, 10)) || mockData.orders[0];
  }
}

// Customer / any authenticated user
export async function getCafes() {
  try {
    const { data } = await api.get('/api/cafes');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockData.cafes;
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
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockData.bookings;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return mockData.bookings;
  }
}
export async function createOrder(payload) {
  const { data } = await api.post('/api/orders', payload);
  return data;
}
export async function getOrders() {
  try {
    const { data } = await api.get('/api/orders');
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list : mockData.orders;
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

// Payment APIs (legacy amount-based)
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

export async function createOrderFromCart(payload) {
  const { data } = await api.post('/api/orders/from-cart', payload);
  return data;
}

// Order-based Razorpay (backend: create Razorpay order, then verify signature)
export async function createOrderPayment(orderId) {
  const { data } = await api.post(`/api/orders/${orderId}/payment/create`);
  return data;
}

export async function verifyOrderPayment(orderId, payload) {
  const { data } = await api.post(`/api/orders/${orderId}/payment/verify`, payload);
  return data;
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
      { id: 1, name: 'Artisan Cappuccino', description: 'Rich espresso with velvet steamed milk foam and cocoa dusting', price: 120, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&fit=crop' },
      { id: 2, name: 'Signature Latte', description: 'Smooth double-shot espresso with creamy micro-foam', price: 100, category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=600&fit=crop' },
      { id: 3, name: 'Double Espresso', description: 'Intense, full-bodied black coffee shot with golden crema', price: 80, category: 'Coffee', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&fit=crop' },
      { id: 4, name: 'Turkish Gold Coffee', description: 'Traditional unfiltered coffee with hints of cardamom', price: 140, category: 'Coffee', image: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?w=600&fit=crop' },
      { id: 5, name: 'Caramel Macchiato', description: 'Espresso marked with vanilla and buttery caramel drizzle', price: 150, category: 'Coffee', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&fit=crop' },
      
      // Bakery Items
      { id: 7, name: 'Butter Croissant', description: 'Traditional French layering with high-fat Normandy butter', price: 80, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&fit=crop' },
      { id: 8, name: 'Pain au Chocolat', description: 'Flaky pastry filled with premium dark chocolate batons', price: 95, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&fit=crop' },
      { id: 9, name: 'Almond Frangipane', description: 'Twice-baked croissant with almond cream and toasted flakes', price: 110, category: 'Bakery', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&fit=crop' },
      { id: 10, name: 'Artisan Sourdough', description: 'Slow-fermented 48-hour loaf with a rich, tangy crust', price: 180, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&fit=crop' },
      
      // Gourmet Main Food
      { id: 12, name: 'Seared Lamb Chops', description: 'Herb-crusted lamb served with red wine reduction', price: 450, category: 'Food', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop' },
      { id: 13, name: 'Wild Sea Bass', description: 'Pan-seared sea bass with lemon butter and asparagus', price: 380, category: 'Food', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&fit=crop' },
      { id: 14, name: 'Quinoa Power Bowl', description: 'Organic quinoa with roasted kale, avocado, and tahini', price: 280, category: 'Food', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&fit=crop' },
      { id: 15, name: 'Wagyu Beef Burger', price: 350, description: 'Premium Wagyu beef on a brioche bun with truffle aioli', category: 'Food', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&fit=crop' },
      { id: 16, name: 'Signature Pizza', price: 290, description: 'Neapolitan style with charcoal-blistered crust', category: 'Food', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&fit=crop' },
      
      // Gourmet Selections
      { id: 31, name: 'Truffle Lobster Tail', description: 'Butter-poached lobster with shavings of black winter truffle', price: 850, category: 'Gourmet', image: 'https://images.unsplash.com/photo-1553163147-d1643cb1662f?w=600&fit=crop' },
      { id: 32, name: 'Filet Mignon Rossini', description: 'Center-cut beef topped with foie gras and Madeira sauce', price: 1200, category: 'Gourmet', image: 'https://images.unsplash.com/photo-1546039907-7e0e54ad4581?w=600&fit=crop' },
      { id: 33, name: 'Herb Crusted Scallops', description: 'Jumbo scallops with salsa verde and cauliflower purée', price: 650, category: 'Gourmet', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&fit=crop' },
      
      // Decadent Desserts
      { id: 17, name: 'Madagascar Creme Brulee', description: 'Classic custard with a hand-torched sugar crust', price: 180, category: 'Dessert', image: 'https://images.unsplash.com/photo-1470124118117-0524a29a5fc7?w=600&fit=crop' },
      { id: 18, name: 'Red Velvet Lava Cake', description: 'Warm velvet cake with a molten chocolate core', price: 210, category: 'Dessert', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&fit=crop' },
      { id: 19, name: 'Berry Sensation Tart', description: 'Shortcrust pastry with seasonal berries and vanilla cream', price: 160, category: 'Dessert', image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&fit=crop' },
      
      // Premium Beverages
      { id: 22, name: 'Cold Pressed Orange', description: '100% pure Valencia oranges squeezed daily', price: 120, category: 'Beverages', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&fit=crop' },
      { id: 23, name: 'Hibiscus Green Tea', description: 'Organic green tea infused with dried hibiscus petals', price: 90, category: 'Beverages', image: 'https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=600&fit=crop' },
      { id: 24, name: 'Blueberry Smoothie Bowl', description: 'Acai base with wild mountain berries and granola', price: 240, category: 'Beverages', image: 'https://images.unsplash.com/photo-1494597706938-de2cd7341979?w=600&fit=crop' }
    ];
  }
}

// Customer Orders
export async function getCustomerOrders(customerId) {
  try {
    const { data } = await api.get(`/api/orders/customer/${customerId}`);
    const list = Array.isArray(data) ? data : [];
    if (list.length > 0) return list;
    return mockData.orders.filter(order => order.customerId === parseInt(customerId, 10));
  } catch (error) {
    console.warn('API unavailable, using mock customer orders');
    return mockData.orders.filter(order => order.customerId === parseInt(customerId, 10));
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
