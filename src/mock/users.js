import Mock from 'mockjs'

const allUsers = Mock.mock({
    'data|50-80':[
        {
            'id|+1': 1,
            name: '@cname',
            'age|18-40': 1,
            email: '@email',
        }
    ]
}).data

// 永远把条件严格的放前面，条件宽松的放后面
Mock.mock(/\/api\/users\/\d+$/, 'get', (options) => {
  const id = Number(options.url.split('/').pop());
  const user = allUsers.find(u => u.id === id);

  return {
    data: user || null
  };
});

Mock.mock(/\/api\/users.*$/, 'get', (options) => {
    const url = new URL(options.url, 'http://localhost')

    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 5)
    const keyword = url.searchParams.get('keyword') || ''

    //先过滤
    const filtered = allUsers.filter(u =>
        u.name.includes(keyword) || u.email.includes(keyword)
    )

    //再分页
    const start = (page - 1) * pageSize
    const end = start + pageSize

    const pageData = filtered.slice(start, end)

    return {
        data: pageData,
        total: filtered.length
    }
})

//在 users.js 里也加一个 POST 接口，把新用户 push 进 allUsers
Mock.mock('/api/users', 'post', (options) => {
    const newUser = JSON.parse(options.body)
    newUser.id = allUsers.length + 1
    allUsers.push(newUser)
    return { success: true }
})

Mock.mock('/api/login', 'post', (options) => {
    const body = JSON.parse(options.body)
    const { username, password } = body
    if (username === 'admin' && password === '123456'){
        return {
            code: 200,
            token: 'mock-token-admin',
            role: 'admin'
        }
    }

    if(username === 'user' && password === '123456') {
        return {
            code: 200,
            token: 'mock-token-user',
            role: 'user'
        }
    }

    return{
        code: 401,
        message: '账号或密码错误'
    }
})

// 模拟角色数据
const allRoles = [
    { 
        id: 1, 
        name: 'admin', 
        description: '管理员，拥有所有权限',
        permissions:[
            'dashboard:view',
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
        name: 'user', 
        description: '普通用户，只能查看',
        permissions: [
            'dashboard:view',
            'users:view'
            ]
    }
]

// 获取角色列表
Mock.mock('/api/roles', 'get', () => {
    return allRoles
})

// 新增角色
Mock.mock('/api/roles', 'post', (options) => {
    const newRole = JSON.parse(options.body)
    newRole.id = allRoles.length + 1
    allRoles.push(newRole)
    return { success: true }
})

// 编辑角色
Mock.mock(/\/api\/roles\/\d+$/, 'put', (options) => {
    const id = Number(options.url.split('/').pop())
    const data = JSON.parse(options.body)
    const index = allRoles.findIndex(r => r.id === id)
    if (index !== -1) allRoles[index] = { ...allRoles[index], ...data }
    return { success: true }
})

// 删除角色
Mock.mock(/\/api\/roles\/\d+$/, 'delete', (options) => {
    const id = Number(options.url.split('/').pop())
    const index = allRoles.findIndex(r => r.id === id)
    if (index !== -1) allRoles.splice(index, 1)
    return { success: true }
})