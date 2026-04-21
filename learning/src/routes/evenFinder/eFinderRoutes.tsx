import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<h2>Loading...</h2>}>{node}</Suspense>;
}

const EventFinderLayout = lazy(() => import("../../layout/evenFinder/layout"));
const CurrencyConverter = lazy(
  () => import("../../pages/currencyConverter/currencyConverter"),
);
const Index = lazy(() => import("../../pages/evenFinder/index"));

export const eventFinderRoutes: RouteObject[] = [
  {
    path: "/event-finder",
    element: <EventFinderLayout />,
    children: [
      { index: true, element: withSuspense(<Index />) },
      { path: "index", element: withSuspense(<Index />) },
      { path: "currency", element: withSuspense(<CurrencyConverter />) },
    ],
  },
];

// const eventRouter = createBrowserRouter(eventFinderRoutes);
