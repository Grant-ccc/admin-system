import axios from 'axios'
import { message } from 'antd'
import useAuthStore from './store/useAuthStore'
import { useNavigate } from 'react-router-dom'

//没有axios之前使用fetch手动处理的 还蛮多蛮乱的

//创建axios实例（方便复用
const api = axios.create({
    baseURL: '/', //所有请求都会以当前域名根路径为前缀，适合代理转发或Mock
    timeout: 5000 //5秒内没收到响应直接中断请求然后抛出error
})

//设置拦截器（在特定节点做统一处理
//请求拦截器（request）：请求发送之前执行
//响应拦截器（response）：响应到达之后 但是在微事件之前执行（.then() .catch()）

//请求拦截器： 自动加token(从store读取token)
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token //读取token
        if (token) {
            //headers 自定义请求头
            //Authorization请求头：携带身份证
            config.headers.Authorization = token
        }
        return config //用于实际请求
    },
    (error) => {
        return Promise.reject(error)
    }
)

//响应拦截器（错误回调） 检查一下有没有什么问题 反馈给用户
api.interceptors.response.use(
    (response) => { //状态码为2XX时触发
        return response
    },
    (error) => {
        message.error('网络错误，请稍后重试')  //通用错误提示

        if(error.response && error.response.status === 401){ //检查状态码 401就是身份未认证
            message.error('登录已过期，请重新登录')
            localStorage.removeItem('token') //清除本地token
            window.location.href = '/login' //强制跳转到登陆页面 -> 丢失所有内存中的状态（但重新登陆无所谓的啦
            //为什么不用useNavigate？
            //useNavigate是ReactHook 只能在函数组件的顶层和自定义hook中使用
            //不能再普通js模块（像拦截器））调用
            //硬要搞的话还蛮复杂的我看
        }

        return Promise.reject(error)
    }
)

export default api