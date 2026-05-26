import axios from 'axios'

// URL base da API. Em dev assume FastAPI local; em deploy, define VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL,
  timeout: 15000,
})

export default api
