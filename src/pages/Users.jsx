import { Table, Button, Popconfirm, message, Modal, Form, Input, Select } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api'
import UserAvatar from '../components/UserAvatar'
import useAuthStore from '../store/useAuthStore'
import usePermissionStore from '../store/usePermissionStore'

export default function Users(){
    const [form] = Form.useForm()

    const [users, setUsers] = useState([])

    const [open, setOpen] = useState(false) //状态控制弹窗是否显示

    const [editOpen, setEditOpen] = useState(false) //控制编辑弹窗是否显示
    const [currentUser, setCurrentUser] =useState(null) //保存当前要编辑的用户数据
    const [keyword, setKeyword] = useState('')

    const navigate = useNavigate()

    //分页参数
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    const userInfo = useAuthStore((state) => state.userInfo)
    const role = userInfo?.role

    const hasPermission = usePermissionStore((s) => s.hasPermission)

    //不管e是事件对象还是数组 return时候一定是一个文件数组
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e
        }
        return e?.fileList
    }

    //delete
    const deleteUser = (id) => {
        //filter会遍历数组 true被留下 false被过滤
        setUsers(users.filter((u) => u.id !== id)) //留下不等于id的用户留下（精准删除
        message.success('删除成功！') //ant里面的全局提示框
    }

    //create
    const addUser = async (values) => {
        await api.post('/api/users', values)
        message.success('添加成功！')
        setOpen(false)
        fetchUsers(page, pageSize, keyword)
    }

    //create的表单
    const openEdit = (record) => {
        setCurrentUser(record)
        setEditOpen(true)
        form.setFieldsValue(record) // 手动回填数据
    }

    //update
    const updateUser = async (values) => {
        const updated = users.map(u =>
            u.id === currentUser.id ? {...u, ...values} : u
        )

        setUsers([...updated])
        message.success('修改成功！')
        setEditOpen(false)
    }

    //查找（这个是前端查找
    // const filteredUsers = users.filter(u =>
    //     u.name.includes(keyword) || u.email.includes(keyword)
    // )

    //刷新 带上分页参数
    const fetchUsers = async (page = 1, pageSize = 5, kw = keyword) => {
        setLoading(true)
        try{
            const res = await api.get('/api/users', {
                params: {  page, pageSize, keyword: kw }
            })
            setUsers(res.data.data) //此页的用户列表
            setTotal(res.data.total) //总共条数
            setPage(page)
            setPageSize(pageSize)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers(1, pageSize)
    }, [])

    //ant table 表格列定义
    const columns = [
        { 
            title: '头像',
            render: (_, record) => (
                <UserAvatar name={record.name} avatar={record.avatar} size={40} />
            )
         },
        { title: 'ID', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '年龄', dataIndex: 'age' },
        { title: '邮箱', dataIndex: 'email' },
        {
            title: '操作',
            //自定义的渲染
            // _ 当前单元格的值（你这里没用，所以写 _）
            // record 当前这一整行的数据对象
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => navigate(`/users/${record.id}`)}>
                        查看详情
                    </Button>
                    {
                        hasPermission('users:edit') && (
                            <Button type="link" onClick={() => openEdit(record)}>编辑</Button>
                        )
                    }
            
                    {/* //popconfirm把按钮包起来，点击按钮时先弹出确认框，用户点“确定”后才执行删除。 */}
                    {
                        hasPermission('users:delete') && (
                            <Popconfirm
                              title="确定删除吗？"
                              onConfirm={() => deleteUser(record.id)}
                            >
                                <Button danger type="link">删除</Button>
                            </Popconfirm>
                        )
                    }
                    
                </>
                
            )
        }
    ]

    return(
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2>用户管理</h2>

                <div style={{ display: 'flex', gap: 10 }}>
                    <Input
                      placeholder="搜索姓名或邮箱"
                      value={keyword}
                      onChange={(e) => {
                        const kw = e.target.value
                        setKeyword(kw)
                        fetchUsers(1, pageSize, kw)
                      }}
                      style={{ width: 200 }}
                    />

                   { hasPermission('users:add') && <Button type="primary" onClick={() => setOpen(true)}>添加用户</Button> }
                    <Button onClick={() => fetchUsers(page, pageSize, keyword)}>刷新</Button>
                </div>
            </div>

            <Table 
              rowKey={(record) => record.id + record.name + record.email}
              columns={columns}
              dataSource={users}
              loading={loading}
              pagination={{ 
                current: page,
                pageSize,
                total,
                onChange: (p, ps) => { //点击分页 触发onChange 调用fetch
                    fetchUsers(p, ps, keyword) //请求对应页数据 更新users 表格刷新
                }
              }} //分页显示 每页五条
            />

            <Modal
              title="添加用户"
              open={open}
              onCancel={() => setOpen(false)} //弹窗显示与否
              footer={null}
              destroyOnHidden
              getContainer={false} //
            >
                <Form
                  layout="vertical"
                  onFinish={addUser}
                >
                    <Form.Item label="姓名" name="name" rules={[{ required: true, message:'请输入姓名' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="年龄" name="age" rules={[{ required: true, message:'请输入年龄' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="邮箱" name="email" rules={[{ required: true, message:'请输入邮箱' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
              title="编辑用户"
              open={editOpen}
              onCancel={() => setEditOpen(false)} //弹窗显示与否
              footer={null}
            >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={updateUser}
                >
                    <Form.Item label="姓名" name="name" rules={[{ required: true, message:'请输入姓名' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="年龄" name="age" rules={[{ required: true, message:'请输入年龄' }]}>
                        <Input type="number"/>
                    </Form.Item>

                    <Form.Item label="邮箱" name="email" rules={[{ required: true, message:'请输入邮箱' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}