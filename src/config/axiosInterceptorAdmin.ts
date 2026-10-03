import axios from "axios";
import { CONFIG } from "./appConfig";
import { enqueueSnackbar } from "notistack";
import { clearCurrentAdmin } from "../redux/admin/authAdmin.redux";
import { persistor, store } from "../redux/store";
import authAdminAPI from "../api/admin/authAdmin.api";

const axiosInterceptorAdmin = axios.create({
    baseURL: CONFIG.API_HOST,
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

axiosInterceptorAdmin.interceptors.response.use(
    (res) => res,
    async (error: any) => {
        const originalRequest = error?.config

        if (!originalRequest) {
            enqueueSnackbar('An unknown error occurred.', { variant: 'error' })
            return Promise.reject(error)
        }

        const isUnauthorized = error.response?.status === 401
        const isRefreshRequest = originalRequest.url?.includes('/admin/refresh-token')
        const isLoginRequest = originalRequest.url?.includes('/admin/login')
        const message =
            error.response?.data?.message || error.message || 'An error occurred'

        if (!isUnauthorized || isRefreshRequest || isLoginRequest) {
            enqueueSnackbar(message, { variant: 'error' })
            return Promise.reject(error)
        }

        if (originalRequest._retry) {
            enqueueSnackbar('Session expired. Please sign in again.', {
                variant: 'error',
            })
            return Promise.reject(error)
        }

        originalRequest._retry = true

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(axiosInterceptorAdmin(originalRequest)),
                    reject,
                })
            })
        }

        isRefreshing = true

        try {
            await authAdminAPI.onRefreshToken()
            processQueue()
            return axiosInterceptorAdmin(originalRequest)

        } catch (refreshError: any) {

            processQueue(refreshError)

            enqueueSnackbar(
                refreshError?.response?.data?.message ||
                'Session expired. Please sign in again.',
                { variant: 'error' }
            )

            store.dispatch(clearCurrentAdmin())
            await persistor.purge()
            await authAdminAPI.onLogOut()

            setTimeout(() => {
                window.location.href = '/admin/login'
            }, 1500)

            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)

export default axiosInterceptorAdmin
