import { lazy, Suspense } from "react"
import { type RouteObject } from "react-router-dom"
import { SpinnerCustom } from "@/components/spinner/spinner"

import ProtectedRoute from "@/utils/authentication/authentication"

const withSuspense = (node: React.ReactNode) => {
  return <Suspense fallback={<SpinnerCustom />}>{node}</Suspense>
}

const KitchenLayout = lazy(() => import("@/layout/kitchenLayout/kitchenLayout"))
const All = lazy(() => import("@/pages/all"))
const Report = lazy(() => import("@/pages/forms/reportFormPage"))
const OrderPage = lazy(() => import("@/pages/orderPage/orderKitchenPage"))

export const kitchenRoutes: RouteObject[] = [
  {
    path: "/kitchen/",
    element: (
      <ProtectedRoute
        element={withSuspense(<KitchenLayout />)}
        allowedRoles={["kitchen"]}
      />
    ),
    children: [
      {
        index: true,
        element: withSuspense(<All />),
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
