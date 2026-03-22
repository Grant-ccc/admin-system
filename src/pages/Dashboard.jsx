import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { Card, Row, Col,Table } from 'antd'
import { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard(){
    const [stat, setStat] = useState({})
    const [visitTrend, setVisitTrend] = useState([])
    const [orderCompare, setOrderCompare] = useState([])
    const [roleDist, setRoleDist] = useState([])
    const [systemHealth, setSystemHealth] = useState([])
    const [latestOrders, setLatestOrders] = useState([])

    useEffect(() => {
        api.get('/api/dashboard/stat').then(res => setStat(res.data))
        api.get('/api/dashboard/visit-trend').then(res => setVisitTrend(res.data))
        api.get('/api/dashboard/order-compare').then(res => setOrderCompare(res.data))
        api.get('/api/dashboard/role-distribution').then(res => setRoleDist(res.data))
        api.get('/api/dashboard/system-health').then(res => setSystemHealth(res.data))
        api.get('/api/dashboard/latest-orders').then(res => setLatestOrders(res.data))
    }, [])

    //折线图配置
    useEffect(() => {
        if (visitTrend.length > 0) {
            const chart = echarts.init(document.getElementById('visitChart'))
            chart.setOption({
                xAxis: { type: 'category', data: visitTrend.map(i => i.data) },
                yAxis: { type: 'value' },
                series:[{ data: visitTrend.map(i => i.value), type: 'line', smooth: true }]
            })
        }
    }, [visitTrend])

    //柱状图
    useEffect(() => {
        if (orderCompare.week) {
            const chart = echarts.init(document.getElementById('orderChart'))
            chart.setOption({
                tooltip: {},
                legend: { data: ['本周', '上周'] },
                xAxis: { type: 'category', data: orderCompare.week },
                yAxis: { type: 'value' },
                series: [
                    { name: '本周', type: 'bar', data: orderCompare.thisWeek },
                    { name: '上周', type: 'bar', data: orderCompare.lastWeek }
                ]
            })
        }
    }, [orderCompare])

    //饼图配置
    useEffect(() => {
        if(roleDist.length > 0){
            const chart = echarts.init(document.getElementById('roleChart'))
            chart.setOption({
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
            })
        }
    }, [roleDist])

    //雷达图
    useEffect(() => {
        if (systemHealth.indicators) {
            const chart = echarts.init(document.getElementById('healthChart'))
            chart.setOption({
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
            })
        }
    }, [systemHealth])

    //最新用户表格
    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '邮箱', dataIndex: 'email' },
    ]

    const latestUsers = [
        { id: 1, name: '张三', email:'zhangsan@example.com' },
        { id: 2, name: '李四', email:'lisi@example.com' }
    ]

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
                <div id="visitChart" style={{ height: 300 }}></div>
            </Card>

            {/* 柱状图 */}
            <Card title="订单对比" style={{ marginTop: 20 }}>
                <div id="orderChart" style={{ height: 300 }}></div>
            </Card>

            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                    <Card title="角色占比" style={{ marginTop: 20 }}>
                        <div id="roleChart" style={{ height: 300 }}></div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="系统健康度" style={{ marginTop: 20 }}>
                        <div id="healthChart" style={{ height: 300 }}></div>
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
