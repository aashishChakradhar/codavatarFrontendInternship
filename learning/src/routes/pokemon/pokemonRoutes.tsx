import { type RouteObject } from "react-router-dom";

import { lazy, Suspense } from "react";

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<h2>Loading...</h2>}>{node}</Suspense>;
}

const PokemonLayout = lazy(() => import("../../layout/Pokemon/pokemonLayout"));
const PokemonPage = lazy(() => import("../../pages/pokemon/pokemonPage"));

export const pokemonRoutes: RouteObject[] = [
  {
    path: "/pokemon",
    element: <PokemonLayout />,
    children: [{ index: true, element: withSuspense(<PokemonPage />) }],
  },
];
