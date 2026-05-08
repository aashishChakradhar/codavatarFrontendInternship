import { lazy, Suspense } from "react"
import { type RouteObject } from "react-router-dom"
import { SpinnerCustom } from "@/components/spinner/spinner"

import ProtectedRoute from "@/utils/authentication/authentication"

const withSuspense = (node: React.ReactNode) => {
  return <Suspense fallback={<SpinnerCustom />}>{node}</Suspense>
}

const ReceptionLayout = lazy(
  () => import("@/layout/receptionLayout/receptionLayout")
)
const All = lazy(() => import("@/pages/all"))
const Report = lazy(() => import("@/pages/forms/reportFormPage"))
const DashboardPage = lazy(() => import("@/pages/menuPage/menuPage"))

export const receptionRoutes: RouteObject[] = [
  {
    path: "/reception/",
    element: (
      <ProtectedRoute
        element={withSuspense(<ReceptionLayout />)}
        allowedRoles={["reception"]}
      />
    ),
    children: [
      {
        index: true,
        element: withSuspense(<All />),
      },
      {
        path: "dashboard",
        element: withSuspense(<DashboardPage />),
      },
      {
        path: "all",
        element: withSuspense(<All />),
      },
      {
        path: "report",
        element: withSuspense(<Report />),
      },
    ],
  },
]
