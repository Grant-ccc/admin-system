import Mock from 'mock.js'

let roleList = [
    {
        id: 1,
        name: '管理员',
        description: '系统最高权限',
        permissions: [
            'dashboard:viwe',
            'users:view',
            'users:add',
            'users:edit',
            'users:delete',
            'roles:view',
            'roles:add',
            'roles:edit',
            'roles:delete'
        ]
    },
    {
        id: 2,
        name: '普通用户',
        description: '只能看基础数据',
        permissions: [
            'dashboard:view',
            'users:view'
        ]
    }
]

//获取角色列表
Mock.mock('/api/roles', 'get', () => {
    return {
        code: 200,
        data: roleList
    }
})

//新增角色
Mock.mock('/api/roles', 'post', (options) => {
    const body = JSON.parse(options.body)
    const newRole = {
        id: Date.now(), //模拟唯一ID
        ...body
    }
    roleList.push(newRole)
    return { code: 200, data: newRole }
})

//编辑角色
Mock.mock(/\/api\/roles\/\d+/, 'put', (options) => {
    const id = Number(options.url.split('/').pop())
    roleList = roleList.filter((item) => item.id !== id)
    return { code: 200 }
})