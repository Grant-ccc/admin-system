export const menuConfig = [
    {
        key: '/dashboard', //路由
        label: '仪表盘', //名称
        permission: 'dashboard:view' //对应权限
    },
    {
        key: '/users',
        label: '用户管理',
        permission: 'users:view'
    },
    { 
        key: '/roles', 
        label: '角色管理', 
        permission: 'roles:view' 
    }
] //菜单数组