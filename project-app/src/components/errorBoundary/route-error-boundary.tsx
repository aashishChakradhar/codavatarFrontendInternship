import { changeRole } from "@/constants/role"
import type { RootState } from "@/redux/store"
import type { Role } from "@/utils/authentication/authentication"
import { useSelector } from "react-redux"
import {
  Link,
  Navigate,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom"

export default function RouteErrorBoundary() {
  const error = useRouteError()

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

  let title = "Access Denied"
  let description = "You cannot access this page."

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    description =
      typeof error.data === "string"
        ? error.data
        : "The requested route failed to load."
  } else if (error instanceof Error) {
    description = error.message
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <Link
        to={`/${effectiveRole}/`}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Go to home {effectiveRole}
      </Link>
    </div>
  )
}
