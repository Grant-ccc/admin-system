import { create } from "zustand"
import usePermissionStore from './usePermissionStore'

//持久化：让token和userInfo刷新之后还在
const persistKey = 'auth-store' //键名

//状态管理器
//set唯一合法的状态修改入口 更新状态的时候使用
//get保证在任何时刻都能拿到最新状态 避免闭包陷阱（异步函数里面必须用get获取最新值，不能直接引用外部变量
const useAuthStore = create((set, get) => ({ 
    token: null, //认证令牌
    userInfo: null, //登录人信息（id name role avatar
    isInitialized: false, //标记是否已经从localStorage恢复完毕

    //登录逻辑（可以在这里调用真实的api
    login: async (values) => { //传入登录人信息中
        //Mock登录
        const { username, password } = values 
        
        //验证用户和密码
        if (username === 'admin' && password === '123456') { //匹配mock登录账号并且设置对应角色
            const token = 'mock-token-admin' //实际上应该是后端返回的JWT token
            const userInfo = {
                id: 1,
                name: '管理员',
                role: 'admin', //权限管理
                avatar: ''
            }
            set({ token,userInfo }) //更新
            saveToLocalStorage() //保存localStorage中
            usePermissionStore.getState().initPermissions() //根据role初始化该用户的权限
            return true //登陆成功
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

        //用户名或密码错误 登录失败！
        return false
    },

    //登出
    logout: () => {
        set({ token: null, userInfo: null }) //清空token和userInfo
        localStorage.removeItem(persistKey) //清除auth store
    },

    //初始化（从localStorage恢复状态  ->用户刷新界面不需要重新登陆
    init: () => {
        const data = localStorage.getItem(persistKey) 
        if(data){ //恢复状态
            const parsed = JSON.parse(data)
            set({ ...parsed, isInitialized: true })  // 恢复数据并标记初始化完成
        }else { //如果没有数据 用户需要重新登录 token和userInfo保持null
            set({ isInitialized: true })  //没有数据也要标记完成
        }
        
    }
}))

//保存到localStorage -> 每次状态改变时调用，确保数据持久化
function saveToLocalStorage() { //localStorage浏览器提供的本地API （数据持久化
    const { token, userInfo } = useAuthStore.getState() //获取最新状态
    localStorage.setItem( //键值对
        persistKey,  //key
        JSON.stringify({ token, userInfo }) //value:序列化为JSON字符串存储
    )
}

export default useAuthStore