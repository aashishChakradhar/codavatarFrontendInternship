import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import { type RootState } from "@/redux/store"

type Role = "admin" | "reception" | "kitchen" | "restro" | "none"

interface ProtectedRouteProps {
  element: React.ReactNode
  allowedRoles?: Role[]
}

function ProtectedRoute({ element, allowedRoles }: ProtectedRouteProps) {
  const currentUser = useSelector((state: RootState) => state.user)

  if (!currentUser.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (currentUser.isAdmin) {
    return element
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role as Role)) {
    return <Navigate to={`/${currentUser.role}/`} replace />
  }

  return element
}

export default ProtectedRoute
