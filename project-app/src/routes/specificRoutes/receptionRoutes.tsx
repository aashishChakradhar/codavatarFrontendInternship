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
const Billing = lazy(() => import("@/pages/billingPage/billingPage"))
const TablesPage = lazy(() => import("@/pages/tablePage/tablePage"))
const OrdersPage = lazy(() => import("@/pages/orderPage/orderKitchenPage"))

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
        element: withSuspense(<Billing />),
      },
      {
        path: "tables",
        element: withSuspense(<TablesPage />),
      },
      {
        path: "orders",
        element: withSuspense(<OrdersPage />),
      },
      {
        path: "billing",
        element: withSuspense(<Billing />),
      },
      {
        path: "report",
        element: withSuspense(<Report />),
      },
      {
        path: "all",
        element: withSuspense(<All />),
      },
    ],
  },
]
