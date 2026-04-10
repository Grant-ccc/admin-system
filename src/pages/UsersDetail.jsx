import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from  'react'
import { Card, Descriptions, Button, Select, message } from 'antd'
import axios from 'axios'
import api from '../api'
import UserAvatar from '../components/UserAvatar'

export default function UsersDetail() {
    const { id } = useParams() //useParams 是 React Router 提供的 hook，用来获取 URL 里的动态参数。
    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const fetchUser = async () => {
        const res = await api.get(`/api/users/${id}`) //axios 返回的响应对象
        //res.data      → HTTP 响应体（你的 Mock 返回的整个 JSON）
        //res.data.data → JSON 里的 data 字段
        setUser(res.data.data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (!user) return <div>加载中...</div>

    return (
        <Card title="用户详情" style={{ margin: 20 }}>
            <UserAvatar name={user.name} avatar={user.avatar} size={80} />
            <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
                <Descriptions.Item label="年龄">{user.age}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
            </Descriptions>

            <Button style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
                返回
            </Button>
        </Card>
    )
}