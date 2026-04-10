import { Button, Layout, Menu } from 'antd'
import useAuthStore from '../store/useAuthStore'
import useUIStore from '../store/useUIStore'
import usePermissionStore from '../store/usePermissionStore'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { menuConfig } from '../config/menuConfig'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
    const navigate = useNavigate(); //提供了 React Router v6 的跳转函数 单页跳转
    const location = useLocation(); //提供了当前路由信息，用来让菜单自动高亮对应项

    const logout = useAuthStore((state) => state.logout) //登出
    const userInfo = useAuthStore((state) => state.userInfo)
    const collapsed = useUIStore((state) => state.collapsed) //折叠状态
    const toggleCollapsed = useUIStore((state) => state.toggleCollapsed) //折叠状态切换方法

    const permissions = usePermissionStore((s) => s.permissions) //当前用户权限列表
    const menuItems = menuConfig.filter( //
        item => !item.permission || permissions.includes(item.permission)
    )

    return ( //做一些稳定型的界面（对sidebar和header
        <Layout style={{ minHeight:'100vh' }}>
            <Sider collapsed={collapsed}>
                <Menu
                  theme="dark" //主题色
                  mode="inline" //菜单类型 垂直 水平 内嵌  vertical | horizontal | inline
                  selectedKeys={[location.pathname]} //当前选中的菜单项 key 数组 location高亮
                  items={menuItems} //菜单内容
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
                    {/* //Outlet 是 React Router 的占位组件，渲染匹配的子路由组件 */}
                    <Outlet /> 
                </Content>
            </Layout>
        </Layout>
    )
}