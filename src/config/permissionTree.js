//整个系统的权限树配置，先写死在前端（后面可以修改成后端返回
export const permissionTree = [
    {
        id: 'dashboard',  //一个模块的根权限
        label: '仪表盘',  //展示给人的名字
        children: [
            { id: 'dashboard:view', label: '查看仪表盘' } //具体操作权限
        ]
    },
    {
        id: 'users',
        label: '用户管理',
        children: [  //表明这是一个树结构 夫操作节点是模块，子节点是具体
            { id: 'users:view', label: '查看用户' },
            { id: 'users:add', label: '添加用户' },
            { id: 'users:edit', label: '编辑用户' },
            { id: 'users:delete', label: '删除用户' }
        ]
    },
    {
        id: 'roles',
        label: '角色管理', 
        children: [
            { id: 'roles:view', label: '查看角色' },
            { id: 'roles:add', label: '添加角色' },
            { id: 'roles:edit', label: '编辑角色' },
            { id: 'roles:delete', label: '删除角色' }
        ]
    }
]