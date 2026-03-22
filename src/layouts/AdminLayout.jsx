import { Button, Layout, Menu } from 'antd'
import useAuthStore from '../store/useAuthStore'
import useUIStore from '../store/useUIStore'
import usePermissionStore from '../store/usePermissionStore'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { menuConfig } from '../config/menuConfig'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
    const navigate = useNavigate(); //提供了 React Router v6 的跳转函数。
    const location = useLocation(); //提供了当前路由信息，用来让菜da自动高亮。

    const logout = useAuthStore((state) => state.logout)
    const userInfo = useAuthStore((state) => state.userInfo)
    const role = userInfo?.role

    const collapsed = useUIStore((state) => state.collapsed)
    const toggleCollapsed = useUIStore((state) => state.toggleCollapsed)

    const permissions = usePermissionStore((s) => s.permissions)
    const menuItems = menuConfig.filter(
        item => !item.permission || permissions.includes(item.permission)
    )

    return (
        <Layout style={{ minHeight:'100vh' }}>
            <Sider collapsed={collapsed}>
                <Menu
                  theme="dark"
                  mode="inline"
                  selectedKeys={[location.pathname]} //自动高亮
                  items={menuItems}
                  onClick={(item) => navigate(item.key)} //跳转
                />

            </Sider>

            <Layout>
                <Header style={{ 
                    background: '#fff',    
                    display: 'flex',
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0 24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={toggleCollapsed}
                        />
                        <span style={{ fontWeight: 'bold', fontSize: 16 }}>后台管理系统</span>
                    </div>
                    
                    <Button 
                        icon={<LogoutOutlined />}
                        onClick={() => {
                          logout()
                          navigate('/login')
                        }}
                    >
                        退出登录
                    </Button>
                </Header>
                
                <Content style={{ margin:'16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}