import { Table, Button, Popconfirm, message, Modal, Form, Input, Select } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api'
import UserAvatar from '../components/UserAvatar'
import useAuthStore from '../store/useAuthStore'
import usePermissionStore from '../store/usePermissionStore'

export default function Users(){
    const [form] = Form.useForm() //antd表单方法调用 -> Form.useForm对表单数据进行交互

    const [users, setUsers] = useState([]) //所有的用户信息存储在这里

    const [open, setOpen] = useState(false) //状态控制添加新用户弹窗是否（bool）显示

    const [editOpen, setEditOpen] = useState(false) //控制编辑弹窗是否显示
    const [currentUser, setCurrentUser] =useState(null) //当前要编辑的用户数据
    const [keyword, setKeyword] = useState('') //给搜索栏的关键词

    const navigate = useNavigate() //跳转 userDetails

    //分页参数（这种包裹式算不算保护？
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false) //是否显示加载状态（bool 给Table用

    const userInfo = useAuthStore((state) => state.userInfo) //登录人的信息哈
    const role = userInfo?.role

    const hasPermission = usePermissionStore((s) => s.hasPermission) //按钮权限控制

    // //不管e是事件对象还是数组 return时候一定是一个文件数组
    // const normFile = (e) => {
    //     if (Array.isArray(e)) {
    //         return e
    //     }
    //     return e?.fileList
    // }

    //delete
    const deleteUser = async(id) => { //用id标识来筛选
        await api.delete(`/api/users/${id}`);
        message.success('删除成功！');
        fetchUsers(page, pageSize, keyword); // 重新获取当前页数据 方便展示
    }

    //create
    const addUser = async (values) => {
        await api.post('/api/users', values) //向users界面请求（接管给mock
        message.success('添加成功！')
        setOpen(false) //添加新用户窗口合上
        fetchUsers(page, pageSize, keyword)
    }

    //edit的表单
    const openEdit = (record) => {
        setCurrentUser(record)
        setEditOpen(true)
        //设置表单的值（该值将直接传入 form store 中并且重置错误信息。
        //如果你不希望传入对象被修改，请克隆后传入）
        form.setFieldsValue(record) 
    }

    //update（编辑
    const updateUser = async (values) => {
        const updated = users.map(u => //找到要被编辑的对象
            u.id === currentUser.id ? {...u, ...values} : u
        )

        setUsers([...updated]) //放入修改后的内容。。
        message.success('修改成功！')
        setEditOpen(false) //编辑表单关闭
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
                params: { page, pageSize, keyword: kw } //url查询参数
            })
            setUsers(res.data.data) //这里把 Mock 返回的数据设置给 users
            setTotal(res.data.total) //总共条数
            setPage(page)
            setPageSize(pageSize)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers(1, pageSize) //锁回第一页
    }, [])

    //ant table 表格列定义
    const columns = [
        { 
            title: '头像',
            render: (_, record) => ( //函数原定3个参数 但由于完全不用到第一个 只想用第2个 相当于占位符
                //antd中table元素的render函数三个参数
                //①text：当前单元格的值（对应dataIndex字段的值
                //②record：当前行的整条数据
                //③index：当前行的索引（第几行，从0开始
                <UserAvatar name={record.name} avatar={record.avatar} size={40} />
            )
         },
        { title: 'ID', dataIndex: 'id'  },//dataIndex 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
        { title: '姓名', dataIndex: 'name' },//title 列头显示文字
        { title: '年龄', dataIndex: 'age' },
        { title: '邮箱', dataIndex: 'email' },
        {
            title: '操作',
            //生成复杂数据的渲染函数，参数分别为当前单元格的值，当前行数据，行索引
            //(value: V, record: T, index: number): ReactNode
            render: (_, record) => (
                <>
                    {/* type就是完全语法糖来的(primary | dashed | link | text | default
                    预设的按钮样式：主按钮(primary)、次按钮(default 默认)、虚线按钮(dashed)、文本按钮(text)和链接按钮(link) */}
                    <Button type="link" onClick={() => navigate(`/users/${record.id}`)}> {/* //跳转路径转到对应详情界面 */}
                        查看详情
                    </Button>
                    {
                        hasPermission('users:edit') && ( //权限检查
                            <Button type="link" onClick={() => openEdit(record)}>编辑</Button> //onclick 点击按钮之后事件回调
                        )
                    }
            
                    {
                        //popconfirm把按钮包起来，点击按钮时先弹出确认框，用户点“确定”后才执行删除。
                        hasPermission('users:delete') && (
                            <Popconfirm //气泡确认
                              title="确定删除吗？"
                              onConfirm={() => deleteUser(record.id)} //点击确认时的回调
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
                      onChange={(e) => { //onChange 输入框内容发生变化时的回调
                        //e.target出发时间的DOM元素
                        //e.target.value输入框当前的最新内容
                        const kw = e.target.value //搜索关键词
                        setKeyword(kw) //关键词赋值中。。。
                        fetchUsers(1, pageSize, kw)//火速查找，请求第一页内容
                      }}
                      style={{ width: 200 }}
                    />

                   { hasPermission('users:add') && <Button type="primary" onClick={() => setOpen(true)}>添加用户</Button> }
                    <Button onClick={() => fetchUsers(page, pageSize, keyword)}>刷新</Button>
                </div>
            </div>

            <Table 
              rowKey={(record) => record.id + record.name + record.email} //表格行 key 的取值，可以是字符串或一个函数
              columns={columns} //行的形式
              dataSource={users} //数据数组
              loading={loading} //页面是否加载中
              pagination={{ //分页器
                current: page, //当前页数
                pageSize, //每页条数
                total, //数据总数
                //页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
                //function(page, pageSize)
                onChange: (p, ps) => { //点击分页 触发onChange 调用fetch
                    fetchUsers(p, ps, keyword) //请求对应页数据 更新users 表格刷新
                }
              }} //分页显示 每页五条
            />

            <Modal
              title="添加用户"
              open={open} //对话框是否可见bool
              onCancel={() => setOpen(false)} //弹窗显示与否 点击遮罩层或右上角叉或取消按钮的回调
              footer={null} //底部内容，当不需要默认底部按钮时，可以设为 footer={null}
              destroyOnHidden //关闭时销毁 Modal 里的子元素 下次添加新元素就没有残留（写出来此时意思为true
              getContainer={false} //指定 Modal 挂载的节点，但依旧为全屏展示，false 为挂载在当前位置
            >
                <Form
                  layout="vertical" //表单布局 horizontal（头紧接着input | vertical（头 换行 input | inline（一行式
                  onFinish={addUser} //提交表单且数据验证成功后回调事件
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