import { Modal, Form, Input, Tree, message } from 'antd'
import { usePermissionStore } from '../../store/usePermissionStore'
import api from '../../api'

export default function RoleEdit({ open, onClose, data, refresh }) {
    const [form] = Form.useForm()
    const permissionTree = usePermissionStore((s) => s.permissionTree)
    const onOk = async () => {
        const values = await form.validateFields()

        const payload = {
            ...values,
            permissions: values.permissions
        }

        if(data){
            await api.put(`/api/roles/${data.id}`, payload)
            message.success('编辑成功')
        } else{
            await api.post('/api/roles', payload)
            message.success('新增成功')
        }

        refresh()
        onClose()
    }

    return (
        <Modal
          title={data ? '编辑角色' : '新增角色'}
          open={open}
          onOk={onOk}
          onCancel={onClose}
        >
            <Form form={form} initialValues={data}>
                <Form.Item
                  label="角色名称"
                  name="name"
                  rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="描述" name="description">
                    <Input />
                </Form.Item>

                <Form.Item label="权限" name="permissions">
                    <Tree
                      checkable
                      defaultExpandAll
                      fieldNames={{ title: 'label', key : 'id', children: 'children' }}
                      treeData={permissionTree}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}