import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/layout";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Form = lazy(() => import("../pages/form/form.pages"));
const Submit = lazy(() => import("../pages/submit.page"));
const TodoList = lazy(() => import("../pages/todo/todo.page"));
const JunkApp = lazy(() => import("../pages/junk/junk.page"));
const CurrencyConverter = lazy(
  () => import("../components/currencyConverter/currencyConverter.container"),
);

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<h2>Loading Page...</h2>}>{node}</Suspense>;
}

interface ProtectedRouteProps {
  element: React.ReactNode;
  isAuthenticated: boolean;
}
function ProtectedRoute({ element, isAuthenticated }: ProtectedRouteProps) {
  return isAuthenticated ? element : <Navigate to="/" replace />;
}

// For now, set this to true for testing. In production, check from a Context or Auth service
const isUserAuthenticated = false;

const router = createBrowserRouter([
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
        index: true,
        element: (
          <ProtectedRoute
            element={withSuspense(<Form />)}
            isAuthenticated={isUserAuthenticated}
          />
        ),
      },
      {
        path: "form",
        element: (
          <ProtectedRoute
            element={withSuspense(<Form />)}
            isAuthenticated={isUserAuthenticated}
          />
        ),
      },
      {
        path: "submit",
        element: (
          <ProtectedRoute
            element={withSuspense(<Submit />)}
            isAuthenticated={isUserAuthenticated}
          />
        ),
      },
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
        path: "class-converter",
        element: (
          <ProtectedRoute
            element={withSuspense(<CurrencyConverter />)}
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
]);

export default router;
