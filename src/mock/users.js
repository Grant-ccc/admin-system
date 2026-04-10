import Mock from 'mockjs'

const allUsers = Mock.mock({ //根据数据模板生成模拟数据。
    'data|50-80':[ //生成一个数组 数组长度限定
        {
            'id|+1': 1, //自增id，从1开始
            name: '@cname', //随机中文名
            'age|18-40': 1, //范围随机数
            email: '@email',
        }
    ]
}).data //得到纯净用户数组 存在addUsers里面->内存数据库

// 永远把条件严格的放前面，条件宽松的放后面

//获取单个用户的详情
Mock.mock(/\/api\/users\/\d+$/, 'get', (options) => { //“/\/api\/users\/\d+$/”精准匹配以数字ID结尾的URL \d+代表一个或者多个数字
  const id = Number(options.url.split('/').pop()) //通过 split('/').pop() 获取最后一段并转为数字
  const user = allUsers.find(u => u.id === id) //找到对应的用户id查找

  return {
    data: user || null //找到就给函数返回
  };
});

// 删除用户
Mock.mock(/\/api\/users\/\d+$/, 'delete', (options) => {
    const id = Number(options.url.split('/').pop()); //获取要删除的元素id
    const index = allUsers.findIndex(u => u.id === id); //找到这个角色
    if (index !== -1) { //只要存在
        allUsers.splice(index, 1); //从index开始删除一个元素
    }
    return { success: true };
});

//获取用户列表（分页+搜索
Mock.mock(/\/api\/users.*$/, 'get', (options) => { // “/\/api\/users.*$/”匹配任何以/api/users开头的get请求 .*代表零个或者多个任意字符
    const url = new URL(options.url, 'http://localhost') //利用浏览器内置URL构造函数

    //提取参数
    const page = Number(url.searchParams.get('page') || 1) //第n页
    const pageSize = Number(url.searchParams.get('pageSize') || 5) //每页的数量
    const keyword = url.searchParams.get('keyword') || '' //搜索关键词

    //先过滤（搜索功能
    const filtered = allUsers.filter(u => //flitered筛选后的总数据
        u.name.includes(keyword) || u.email.includes(keyword) //保留有关键词的元素
    )

    //再分页（找出属于当前页面用户
    const start = (page - 1) * pageSize //起始位置用户
    const end = start + pageSize //结束位置
    const pageData = filtered.slice(start, end) //切出这一段数组

    return {
        data: pageData, //当前页用户数据
        total: filtered.length //过滤后总条数（用来显示总共的页数
    }
})

//Mock.mock(rurl, rtype, function(options)) 记录用于生成响应数据的函数。
//当拦截到匹配rurl和rtype的Ajax请求时，函数function(options)将被执行，
//并将执行结果作为响应数据返回。

//新增用户
Mock.mock('/api/users', 'post', (options) => {
    const newUser = JSON.parse(options.body) //解析对象
    newUser.id = allUsers.length + 1 //id标识生成
    allUsers.push(newUser) //放入
    return { success: true }
})

// Mock.mock('/api/login', 'post', (options) => {
//     const body = JSON.parse(options.body)
//     const { username, password } = body
//     if (username === 'admin' && password === '123456'){
//         return {
//             code: 200,
//             token: 'mock-token-admin',
//             role: 'admin'
//         }
//     }

//     if(username === 'user' && password === '123456') {
//         return {
//             code: 200,
//             token: 'mock-token-user',
//             role: 'user'
//         }
//     }

//     return{
//         code: 401,
//         message: '账号或密码错误'
//     }
// })

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