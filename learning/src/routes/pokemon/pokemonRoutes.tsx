import { type RouteObject } from "react-router-dom";

import { lazy, Suspense } from "react";

import { SpinnerCustom } from "@/components/spinner/spinner";

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<SpinnerCustom />}>{node}</Suspense>;
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
