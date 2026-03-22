import { Card, Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Login(){
    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()

    //好精简哇
    const onFinish = async (values) => {
        const ok = await login(values)

        if (ok){
            navigate('/')
        } else {
            message.error('账号或密码错误')
        }
    }

    return (
        <div style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
            <Card title="后台管理系统" style={{ width: 350 }}>
                <Form onFinish={onFinish}>
                    <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input placeholder="用户名：admin" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password placeholder="密码：123456" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}