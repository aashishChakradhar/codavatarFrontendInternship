import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/layout";
import { lazy, Suspense } from "react";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(<Form />) },
      { path: "form", element: withSuspense(<Form />) },
      { path: "submit", element: withSuspense(<Submit />) },
      { path: "todo", element: withSuspense(<TodoList />) },
      { path: "junk", element: withSuspense(<JunkApp />) },
      { path: "class-converter", element: withSuspense(<CurrencyConverter />) },
      { path: "converter", element: withSuspense(<CurrencyConverter />) },
    ],
  },
]);

export default router;
