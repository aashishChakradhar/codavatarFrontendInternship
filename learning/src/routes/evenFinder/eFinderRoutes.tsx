import { type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<h2>Loading...</h2>}>{node}</Suspense>;
}

const EventFinderLayout = lazy(() => import("../../layout/evenFinder/layout"));
const Index = lazy(() => import("../../pages/evenFinder/index"));
const EventPage = lazy(
  () => import("../../pages/evenFinder/eventDetail/eventPage"),
);

export const eventFinderRoutes: RouteObject[] = [
  {
    path: "/event-finder",
    element: <EventFinderLayout />,
    children: [
      { index: true, element: withSuspense(<Index />) },
      { path: "index", element: withSuspense(<Index />) },
      { path: "page/:id", element: withSuspense(<EventPage />) },
    ],
  },
];

// const eventRouter = createBrowserRouter(eventFinderRoutes);
