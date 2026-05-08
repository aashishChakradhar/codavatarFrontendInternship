import { createBrowserRouter } from "react-router-dom"
import { publicRoutes } from "./publicRoutes"
import { adminRoutes } from "./specificRoutes/adminRoutes"
import RouteErrorBoundary from "../components/errorBoundary/route-error-boundary"
import { kitchenRoutes } from "./specificRoutes/kitchenRoutes"
import { receptionRoutes } from "./specificRoutes/receptionRoutes"
import { restroRoutes } from "./specificRoutes/restroRoutes"

const allRouter = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      ...publicRoutes,
      ...adminRoutes,
      ...kitchenRoutes,
      ...receptionRoutes,
      ...restroRoutes,
    ],
  },
])

export default allRouter
