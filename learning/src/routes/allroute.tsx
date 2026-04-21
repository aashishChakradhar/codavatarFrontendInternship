import { type RouteObject } from "react-router-dom";
import Layout from "../layout/layout";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  isAuthenticated: boolean;
}
function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<h2>Loading Page...</h2>}>{node}</Suspense>;
}
function ProtectedRoute({ element, isAuthenticated }: ProtectedRouteProps) {
  return isAuthenticated ? element : <Navigate to="/" replace />;
}

const Form = lazy(() => import("../pages/form/form"));
const Submit = lazy(() => import("../pages/submit"));
const TodoList = lazy(() => import("../pages/todo/todo"));
const JunkApp = lazy(() => import("../pages/junk/junk"));
const CurrencyConverter = lazy(
  () => import("../pages/currencyConverter/currencyConverter"),
);

const isUserAuthenticated = true;

export const allRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(<Form />),
      },
      {
        path: "form",
        element: withSuspense(<Form />),
      },
      {
        path: "submit",
        element: withSuspense(<Submit />),
      },
    ],
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        path: "todo",
        element: (
          <ProtectedRoute
            element={withSuspense(<TodoList />)}
            isAuthenticated={isUserAuthenticated}
          />
        ),
      },
      {
        path: "junk",
        element: (
          <ProtectedRoute
            element={withSuspense(<JunkApp />)}
            isAuthenticated={isUserAuthenticated}
          />
        ),
      },
      {
        path: "converter",
        element: (
          <ProtectedRoute
            element={withSuspense(<CurrencyConverter />)}
            isAuthenticated={isUserAuthenticated}
          />
        ),
      },
    ],
  },
];

// const allrouter = createBrowserRouter(allRoutes);
