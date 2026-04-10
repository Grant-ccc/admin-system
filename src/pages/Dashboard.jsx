import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { Card, Row, Col, Table } from 'antd'
import { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard() {
    const [stat, setStat] = useState({}) //顶部四个统计卡片数据
    const [visitTrend, setVisitTrend] = useState([]) //访问趋势折线图数据
    const [orderCompare, setOrderCompare] = useState([]) //存储订单对比柱状图数据
    const [roleDist, setRoleDist] = useState([]) //角色占比饼图数据
    const [systemHealth, setSystemHealth] = useState([]) //系统健康度雷达
    const [latestOrders, setLatestOrders] = useState([]) //最新订单表格数据

    useEffect(() => { //等到第一次渲染结束之后才去拉取数据
        //并行请求 不相互等待 提高加载速度
        //数据更新 每个 setXxx 会触发组件重新渲染，但因为有多个状态，可能会渲染多次 实际中可以用 Promise.all 合并，但这里分开写更清晰
        api.get('/api/dashboard/stat').then(res => setStat(res.data))
        api.get('/api/dashboard/visit-trend').then(res => setVisitTrend(res.data))
        api.get('/api/dashboard/order-compare').then(res => setOrderCompare(res.data))
        api.get('/api/dashboard/role-distribution').then(res => setRoleDist(res.data))
        api.get('/api/dashboard/system-health').then(res => setSystemHealth(res.data))
        api.get('/api/dashboard/latest-orders').then(res => setLatestOrders(res.data))
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>

            <Row gutter={16}>
                <Col span={6}><Card title="用户数">{stat.userCount}</Card></Col>
                <Col span={6}><Card title="订单数">{stat.orderCount}</Card></Col>
                <Col span={6}><Card title="访问量">{stat.visitCount}</Card></Col>
                <Col span={6}><Card title="销售额">{stat.salesAmount}</Card></Col>
            </Row>

            {/* 折线图 */}
            <Card title="访问趋势" style={{ marginTop: 20 }}>
                <ReactECharts
                    option={{
                        xAxis: { type: 'category', data: visitTrend.map(i => i.date) },
                        yAxis: { type: 'value' },
                        series: [{ data: visitTrend.map(i => i.value), type: 'line', smooth: true }]
                    }}
                    style={{ height: 300 }}
                />
            </Card>

            {/* 柱状图 */}
            <Card title="订单对比" style={{ marginTop: 20 }}>
                <ReactECharts
                    option={{
                        tooltip: {},
                        legend: { data: ['本周', '上周'] },
                        xAxis: { type: 'category', data: orderCompare.week },
                        yAxis: { type: 'value' },
                        series: [
                            { name: '本周', type: 'bar', data: orderCompare.thisWeek },
                            { name: '上周', type: 'bar', data: orderCompare.lastWeek }
                        ]
                    }}
                    style={{ height: 300 }}
                />
            </Card>

            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                    <Card title="角色占比" style={{ marginTop: 20 }}>
                        <ReactECharts
                            option={{
                                tooltip: { trigger: 'item' },
                                legend: {
                                    orient: 'vertical',
                                    right: '10%',
                                    top: 'center'
                                },
                                series: [{
                                    type: 'pie',
                                    radius: '60%',
                                    center: ['40%', '50%'],
                                    data: roleDist,
                                    label: { show: true, formatter: '{b}: {d}%' }
                                }]
                            }}
                            style={{ height: 300 }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="系统健康度" style={{ marginTop: 20 }}>
                        <ReactECharts
                            option={{
                                radar: {
                                    indicator: systemHealth.indicators,
                                    radius: '65%',  // ← 加大
                                    center: ['50%', '55%']  // ← 居中
                                },
                                series: [{
                                    type: 'radar',
                                    data: [{
                                        value: systemHealth.values,
                                        areaStyle: { opacity: 0.3 },  // ← 加填充色
                                        lineStyle: { color: '#1677ff' },
                                        itemStyle: { color: '#1677ff' }
                                    }]
                                }]
                            }}
                            style={{ height: 300 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 最新订单 */}
            <Card title="最新订单" style={{ marginTop: 20 }}>
                <Table
                    rowKey="id"
                    dataSource={latestOrders}
                    columns={[
                        { title: '订单ID', dataIndex: 'id' },
                        { title: '用户', dataIndex: 'user' },
                        { title: '金额', dataIndex: 'amount' },
                        { title: '时间', dataIndex: 'date' }
                    ]}
                />
            </Card>
        </div>
    )
}
