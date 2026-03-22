import Mock from 'mockjs'

// 1. 顶部统计卡片
Mock.mock('/api/dashboard/stat', 'get', () => {
  return {
    userCount: Mock.Random.integer(1000, 5000),
    orderCount: Mock.Random.integer(200, 1000),
    visitCount: Mock.Random.integer(5000, 20000),
    salesAmount: Mock.Random.integer(100000, 500000)
  }
})

// 2. 折线图：访问趋势
Mock.mock('/api/dashboard/visit-trend', 'get', () => {
  return Mock.mock({
    'list|7': [
      {
        date: '@date("MM-dd")',
        value: '@integer(200, 2000)'
      }
    ]
  }).list
})

// 3. 柱状图：订单对比（本周 vs 上周）
Mock.mock('/api/dashboard/order-compare', 'get', () => {
  return {
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    thisWeek: Mock.mock({ 'arr|7': ['@integer(20, 100)'] }).arr,
    lastWeek: Mock.mock({ 'arr|7': ['@integer(20, 100)'] }).arr
  }
})

// 4. 饼图：角色占比
Mock.mock('/api/dashboard/role-distribution', 'get', () => {
  return [
    { name: '管理员', value: Mock.Random.integer(10, 50) },
    { name: '普通用户', value: Mock.Random.integer(100, 500) }
  ]
})

// 5. 雷达图：系统健康度
Mock.mock('/api/dashboard/system-health', 'get', () => {
  return {
    indicators: [
      { name: 'CPU', max: 100 },
      { name: '内存', max: 100 },
      { name: '磁盘 IO', max: 100 },
      { name: '网络', max: 100 },
      { name: '数据库', max: 100 }
    ],
    values: Mock.mock({ 'arr|5': ['@integer(40, 100)'] }).arr
  }
})

// 6. 最新订单
Mock.mock('/api/dashboard/latest-orders', 'get', () => {
  return Mock.mock({
    'list|5': [
      {
        id: '@id',
        user: '@cname',
        amount: '@integer(50, 500)',
        date: '@datetime("MM-dd HH:mm")'
      }
    ]
  }).list
})
