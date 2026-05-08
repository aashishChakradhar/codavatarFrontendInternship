import { lazy, Suspense } from "react"
import { type RouteObject } from "react-router-dom"

import { SpinnerCustom } from "@/components/spinner/spinner"

const LoginPage = lazy(() => import("@/pages/forms/loginPage"))
const SignupPage = lazy(() => import("@/pages/forms/signupPage"))

const withSuspense = (node: React.ReactNode) => {
  return <Suspense fallback={<SpinnerCustom />}>{node}</Suspense>
}

export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/signup",
    element: withSuspense(<SignupPage />),
  },
]
