import { create } from "zustand"
import usePermissionStore from './usePermissionStore'

//持久化：让token和userInfo刷新之后还在
const persistKey = 'auth-store'

const useAuthStore = create((set, get) => ({
    token: null,
    userInfo: null,

    //设置token
    setToken: (token) => {
        set({ token })
        saveToLocalStorage()
    },

    //设置用户信息
    setUserInfo: (info) => {
        set({ userInfo: info })
        saveToLocalStorage()
    },

    //登录逻辑（可以在这里调用真实的api
    login: async (values) => {
        //Mock登录
        const { username, password } = values
        
        if (username === 'admin' && password === '123456') {
            const token = 'mock-token-admin'
            const userInfo = {
                id: 1,
                name: '管理员',
                role: 'admin',
                avatar: ''
            }
            set({ token,userInfo })
            saveToLocalStorage()
            usePermissionStore.getState().initPermissions() 
            return true
        }

        if (username === 'user' && password === '123456') {
            const token = 'mock-token-user'
            const userInfo = {
                id: 2,
                name: '普通用户',
                role: 'user',
                avatar: ''
            }
            set({ token,userInfo })
            saveToLocalStorage()
            usePermissionStore.getState().initPermissions() 
            return true
        }

        return false
    },

    //登出
    logout: () => {
        set({ token: null, userInfo: null })
        localStorage.removeItem(persistKey)
    },

    //初始化（从localStorage恢复状态
    init: () => {
        const data = localStorage.getItem(persistKey)
        if(data){
            const parsed = JSON.parse(data)
            set(parsed)
        }
    }
}))

//保存到localStorage
function saveToLocalStorage() {
    const { token, userInfo } = useAuthStore.getState()
    localStorage.setItem(
        persistKey,
        JSON.stringify({ token, userInfo })
    )
}

export default useAuthStore