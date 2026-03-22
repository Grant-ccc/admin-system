import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Login from './pages/Login'
import UsersDetail from './pages/UsersDetail'
import './App.css'
import AuthRoute from './components/AuthRoute'
import useAuthStore from './store/useAuthStore'
import useUIStore from './store/useUIStore'
import usePermissionStore from './store/usePermissionStore'
import RoleList from './pages/role/RoleList'

//配置路由中
function App() {
  const initUI = useUIStore((state) => state.init)
  const initAuth = useAuthStore((s) => s.init)
  const initPermissions = usePermissionStore((s) => s.initPermissions)

  useEffect(() => {
    initAuth()
    initUI()
    initPermissions()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <AuthRoute>
          <AdminLayout />
        </AuthRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UsersDetail />} />
        <Route path="roles" element={<RoleList />} />
      </Route>
    </Routes>
  )
}

export default App
