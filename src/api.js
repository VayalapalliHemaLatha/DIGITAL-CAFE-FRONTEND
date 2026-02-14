import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

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
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    if (data.token) setToken(data.token);
    const userObj = data.user ?? { id: data.id, email: data.email, name: data.name, roleType: data.roleType };
    if (userObj && (userObj.id != null || userObj.email)) setUser(userObj);
    return data;
  },

  async createUser(payload) {
    const { data } = await api.post('/api/auth/signup', payload);
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

export async function getUsers() {
  const { data } = await api.get('/api/users');
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/api/users/profile');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put('/api/users/profile', payload);
  return data;
}

export async function getAdminCafes() {
  const { data } = await api.get('/api/admin/cafes');
  return data;
}
export async function createAdminCafe(payload) {
  const { data } = await api.post('/api/admin/cafes', payload);
  return data;
}
export async function updateAdminCafe(id, payload) {
  const { data } = await api.put(`/api/admin/cafes/${id}`, payload);
  return data;
}
export async function deleteAdminCafe(id) {
  await api.delete(`/api/admin/cafes/${id}`);
}

export async function getCafeOwners() {
  const { data } = await api.get('/api/admin/cafeowners');
  return data;
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
  const { data } = await api.get('/api/cafes');
  return data;
}
export async function getCafeById(id) {
  const { data } = await api.get(`/api/cafes/${id}`);
  return data;
}
export async function createBooking(payload) {
  const { data } = await api.post('/api/bookings', payload);
  return data;
}
export async function getBookings() {
  const { data } = await api.get('/api/bookings');
  return data;
}
export async function createOrder(payload) {
  const { data } = await api.post('/api/orders', payload);
  return data;
}
export async function getOrders() {
  const { data } = await api.get('/api/orders');
  return data;
}
export async function getOrderById(id) {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
}

// Chef
export async function getChefOrders() {
  const { data } = await api.get('/api/chef/orders');
  return data;
}
export async function updateChefOrderStatus(id, payload) {
  const { data } = await api.patch(`/api/chef/orders/${id}/status`, payload);
  return data;
}

// Waiter
export async function getWaiterOrdersReady() {
  const { data } = await api.get('/api/waiter/orders/ready');
  return data;
}
export async function getWaiterOrders() {
  const { data } = await api.get('/api/waiter/orders');
  return data;
}
export async function updateWaiterOrderStatus(id, payload) {
  const { data } = await api.patch(`/api/waiter/orders/${id}/status`, payload);
  return data;
}

export default api;
