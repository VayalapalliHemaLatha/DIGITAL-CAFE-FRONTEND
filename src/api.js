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

  async signup({ email, password, name }) {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      email,
      password,
      name,
    });
    if (data.token) setToken(data.token);
    if (data.user) setUser(data.user);
    return data;
  },

  async login({ email, password }) {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    if (data.token) setToken(data.token);
    if (data.user) setUser(data.user);
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

export default api;
