import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { CONFIG } from './appConfig'
import authApi from '../api/Auth.api'
import { clearCurrentUser } from '../redux/auth.redux'
import { store, persistor } from '../redux/store'

const axiosInterceptor = axios.create({
  baseURL: CONFIG.API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve()
    }
  })
  failedQueue = []
}

axiosInterceptor.interceptors.response.use(
  (res) => res,
  async (error: any) => {
    const originalRequest = error?.config

    if (!originalRequest) {
      enqueueSnackbar('Có lỗi không xác định xảy ra.', { variant: 'error' })
      return Promise.reject(error)
    }

    const isUnauthorized = error.response?.status === 401
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh')
    const isLoginRequest = originalRequest.url?.includes('/auth/login')
    const message =
      error.response?.data?.message || error.message || 'Đã có lỗi xảy ra'

    if (!isUnauthorized || isRefreshRequest || isLoginRequest) {
      enqueueSnackbar(message, { variant: 'error' })
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      enqueueSnackbar('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
        variant: 'error',
      })
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosInterceptor(originalRequest)),
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      
      await authApi.onRefreshToken()     
      processQueue()  
      return axiosInterceptor(originalRequest)
    
    } catch (refreshError: any) {
      
      processQueue(refreshError)
      
      enqueueSnackbar(
        refreshError?.response?.data?.message ||
          'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        { variant: 'error' }
      )
      
      store.dispatch(clearCurrentUser())
      await persistor.purge()
      await authApi.onLogOut()
      
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
      
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInterceptor