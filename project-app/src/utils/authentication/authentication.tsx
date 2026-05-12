import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import { type RootState } from "@/redux/store"
import { changeRole } from "@/constants/role"

export type Role = "admin" | "reception" | "kitchen" | "restro" | "none"

interface ProtectedRouteProps {
  element: React.ReactNode
  allowedRoles?: Role[]
}

function ProtectedRoute({ element, allowedRoles }: ProtectedRouteProps) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const loading = useSelector((state: RootState) => state.user.loading)
  const hasToken = Boolean(localStorage.getItem("access_token"))

  if (!currentUser) {
    if (loading || hasToken) {
      return null
    }

    return <Navigate to="/login" replace />
  }

  const effectiveRole = changeRole(currentUser.role)

  if (currentUser.isAdmin) {
    return element
  }

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to={`/${effectiveRole}/`} replace />
  }

  return element
}

export default ProtectedRoute
