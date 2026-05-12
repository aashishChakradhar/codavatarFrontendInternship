import { lazy, Suspense } from "react"
import { type RouteObject } from "react-router-dom"
import { SpinnerCustom } from "@/components/spinner/spinner"

import ProtectedRoute from "@/utils/authentication/authentication"

const withSuspense = (node: React.ReactNode) => {
  return <Suspense fallback={<SpinnerCustom />}>{node}</Suspense>
}

const RestroLayout = lazy(() => import("@/layout/restroLayout/restroLayout"))
const Report = lazy(() => import("@/pages/forms/reportFormPage"))
const TablePage = lazy(() => import("@/pages/tablePage/tablePage"))
const DashboardPage = lazy(() => import("@/pages/all"))
const MenuPage = lazy(() => import("@/pages/menuPage/menuPage"))
const OrderPage = lazy(() => import("@/pages/orderPage/orderRestroPage"))

export const restroRoutes: RouteObject[] = [
  {
    path: "/restro/",
    element: (
      <ProtectedRoute
        element={withSuspense(<RestroLayout />)}
        allowedRoles={["restro"]}
      />
    ),
    children: [
      {
        index: true,
        element: withSuspense(<MenuPage />),
      },
      { path: "dashboard", element: withSuspense(<DashboardPage />) },
      {
        path: "menu",
        element: withSuspense(<MenuPage />),
      },
      {
        path: "table",
        element: withSuspense(<TablePage />),
      },
      {
        path: "order",
        element: withSuspense(<OrderPage />),
      },
      {
        path: "report",
        element: withSuspense(<Report />),
      },
    ],
  },
]
