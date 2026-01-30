import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://contriz-backend.onrender.com/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Group APIs
export const groupAPI = {
  create: (data) => api.post('/groups', data),
  getAll: () => api.get('/groups'),
  getOne: (id) => api.get(`/groups/${id}`),
  addMember: (groupId, email) => api.post(`/groups/${groupId}/members`, { email })
};

// Expense APIs
export const expenseAPI = {
  create: (data) => api.post('/expenses', data),
  getByGroup: (groupId) => api.get(`/expenses/group/${groupId}`),
  getBalances: (groupId) => api.get(`/expenses/group/${groupId}/balances`),
  getSettlements: (groupId) => api.get(`/expenses/group/${groupId}/settle`)
};

export default api;