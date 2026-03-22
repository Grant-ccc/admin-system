import { useEffect, useState } from 'react'
import {Table, Button, Space, Modal, message } from 'antd'
import api from '../../api'
import RoleEdit from './RoleEdit'

export default function RoleList() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState(null)
    const [open, setOpen] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        const res = await api.get('/api/roles')
        setList(res.data)
        setLoading(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async (id) => {
        await api.delete(`/api/roles/${id}`)
        message.success('删除成功')
        fetchData()
    }

    const columns = [
        { title: '角色名称', dataIndex: 'name' },
        { title: '描述', dataIndex: 'description' },
        {
            title: '操作',
            render: (_, record) => (
                <Space>
                    <Button 
                      type="link"
                      onClick={() => {
                        setEditData(record)
                        setOpen(true)
                      }}
                    >
                        编辑
                    </Button>
                    <Button danger type="link" onClick={() => handleDelete(record.id)}>
                        删除
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <>
            <Button
              typr="primary"
              onClick={() => {
                setEditData(null)
                setOpen(true)
              }}
              style={{ marginBottom: 16 }}
            >
                新增角色
            </Button>

            <Table  
              roeKey="id"
              columns={columns}
              dataSource={list}
              loading={loading}
            />

            {open && (
                <RoleEdit
                  open={open}
                  onClose={() => setOpen(false)}
                  data={editData}
                  refresh={fetchData}
                />
            )}
        </>
    )
}