import { create } from 'zustand'

const persistKey = 'ui-store'

const useUIStore = create((set, get) => ({
    //菜单折叠状态：
    collapsed: false,

    //切换折叠状态
    toggleCollapsed: () => {
        const newValue = !get().collapsed //转换新状态
        set({ collapsed: newValue }) //保存折叠状态
        saveToLocalStorage() //存到本地
    },

    //全局loading
    globalLoading: false,

    setGlobalLoading: (loading) => {
        set({ globalLoading: loading })
    },

    //初始化（从localStorage恢复
    init: () => {
        const data = localStorage.getItem(persistKey)
        if(data) {
            set(JSON.parse(data))
        }
    }
}))

function saveToLocalStorage() {
    const { collapsed } = useUIStore.getState()
    localStorage.setItem(
        persistKey,
        JSON.stringify({ collapsed })
    )
}

export default useUIStore