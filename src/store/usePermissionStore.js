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

//状态管理器
export const usePermissionStore = create((set, get) => ({
    //当前用户拥有的权限
    permissions: [],

    //全场权限树（用于角色的按钮级权限管理
    permissionTree,

    //初始化权限（根据当前用户的role，设置permissions
    initPermissions: () => {
        const userInfo = useAuthStore.getState().userInfo //登录人信息
        const role = userInfo?.role //找准用户被分配的角色
        if(!role) return

        const perms = rolePermissions[role] || [] //利用上面的权限表对应 精细化到按钮
        set({ permissions: perms }) //修改当前用户拥有的权限
    },

    //判断是否有某个权限
    hasPermission: (perm) => {
        return get().permissions.includes(perm)
    },

    //根据权限过滤菜单（动态菜单
    //负责侧边栏的渲染
    getMenuByPermission: () => {
        const perms = get().permissions //获取最新的角色权限

        const filterMenu = (menus) => {
            return menus 
              .filter((item) => !item.permission || perms.includes(item.permission)) //①直接就是说没权限（相当于全权限）②包含该权限（对的上）  两个之间满一个条件就保留
              .map((item) => ({
                  ...item,  // 复制菜单项的所有属性（如 key、label、permission）
                  children: item.children ? filterMenu(item.children) : undefined  // 如果有子菜单，递归调用 filterMenu 过滤子菜单；否则设为 undefined
              }))
        }
        return filterMenu(menuConfig)
    }
}))

export default usePermissionStore