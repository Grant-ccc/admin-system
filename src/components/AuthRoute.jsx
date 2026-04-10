import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function AuthRoute({ children }) {
    const token = useAuthStore((state) => state.token)
    const isInitialized = useAuthStore((state) => state.isInitialized)

    //初始化完成之前，不渲染任何内容（避免直接到登录页）
    if (!isInitialized) {
        return null
    }

    if(!token){
        return <Navigate to="/login" replace />
    }

    return children;
}