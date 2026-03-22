import { create } from 'zustand'
import useAuthStore from './useAuthStore'
import { permissionTree } from '../config/permissionTree'
import { menuConfig } from '../config/menuConfig'

//模拟权限表 （未来会从后端获取
const rolePermissions = {
    admin: [
        'dashboard:view',
        'users:view',
        'users:add',
        'users:edit',
        'users:delete',
        'roles:view',
        'roles:add',
        'roles:edit',
        'roles:delete'
    ],
    user: [
        'dashboard:view',
        'users:view'
    ]
}

export const usePermissionStore = create((set, get) => ({
    //当前用户拥有的权限
    permissions: [],

    //全场权限树（用于角色管理
    permissionTree,

    //初始化权限（根据当前用户的role，设置permissions
    initPermissions: () => {
        const userInfo = useAuthStore.getState().userInfo
        const role = userInfo?.role
        if(!role) return

        const perms = rolePermissions[role] || []
        set({ permissions: perms })
    },

    //判断是否有某个权限
    hasPermission: (perm) => {
        return get().permissions.includes(perm)
    },

    //根据权限过滤菜单（动态菜单
    getMenuByPermission: () => {
        const perms = get().permissions

        const filterMenu = (menus) => {
            return menus 
              .filter((item) => !item.permission || perms.includes(item.permission))
              .map((item) => ({
                  ...item,
                  children: item.children ? filterMenu(item.children) : undefined
              }))
        }
        return filterMenu(menuConfig)
    }
}))

export default usePermissionStore