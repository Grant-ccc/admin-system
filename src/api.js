import axios from 'axios'
import { message } from 'antd'
import useAuthStore from './store/useAuthStore'
import { useNavigate } from 'react-router-dom'

//创建axios实例
const api = axios.create({
    baseURL: '/',
    timeout: 5000
})

//请求拦截器： 自动带token(从store读取token)
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        message.error('网络错误，请稍后重试')

        if(error.response && error.response.status === 401){
            message.error('登录已过期，请重新登录')
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export default api