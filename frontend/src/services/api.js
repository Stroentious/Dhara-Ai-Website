import axios from 'axios'

// In production (Vercel): VITE_API_URL = "https://your-app.onrender.com/api"
// In development: falls back to "/api" which Vite proxies to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor: add auth token from localStorage and strip leading slash to join baseURL correctly
api.interceptors.request.use(config => {
  const token = localStorage.getItem('dharaai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1)
  }
  return config
})

// Response interceptor: handle errors without abrupt redirects
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn("API 401 status received.")
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => api.post('auth/login-json', { email, password }),
  register: (data) => api.post('auth/register', data)
}

export const fieldsAPI = {
  list: () => api.get('fields'),
  get: (id) => api.get(`fields/${id}`),
  create: (data) => api.post('fields', data),
  update: (id, data) => api.put(`fields/${id}`, data),
  delete: (id) => api.delete(`fields/${id}`)
}

export const sensorsAPI = {
  latest: (fieldId) => api.get(`sensors/latest/${fieldId}`),
  history: (fieldId, limit = 168) => api.get(`sensors/history/${fieldId}?limit=${limit}`)
}

export const weatherAPI = {
  current: () => api.get('weather')
}

export const dashboardAPI = {
  get: (fieldId) => api.get(`dashboard/${fieldId}`)
}

export const alertsAPI = {
  list: (fieldId) => api.get(`alerts/${fieldId}`),
  resolve: (alertId) => api.put(`alerts/${alertId}/resolve`)
}

export const waterAPI = {
  history: (fieldId) => api.get(`water/${fieldId}`),
  log: (data) => api.post('water', data)
}

export const fertilizerAPI = {
  history: (fieldId) => api.get(`fertilizer/${fieldId}`),
  log: (data) => api.post('fertilizer', data)
}

export const chatAPI = {
  send: (message, fieldId) => api.post('chat', { message, field_id: fieldId })
}

export default api
