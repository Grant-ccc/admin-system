import { create } from 'zustand'

const persistKey = 'ui-store'

const useUIStore = create((set, get) => ({
    //菜单折叠状态：
    collapsed: false,

    toggleCollapsed: () => {
        const newValue = !get().collapsed
        set({ collapsed: newValue })
        saveToLocalStorage()
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