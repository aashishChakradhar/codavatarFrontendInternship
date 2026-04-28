import { Suspense } from "react";
import PokemonList from "../../components/pokemon/pokemonListComponent";
import { SkeletonCard } from "@/components/skeleton/skeleton";

export default function PokemonPage() {
  return (
    <div className="bg-blue-100 h-dvh flex lg:flex-col items-center">
      Pokemon Page
      <Suspense fallback={<SkeletonCard />}>
        {/* <Pokemon /> */}
        {/* <PokemonRef /> */}
        <PokemonList />
      </Suspense>
    </div>
  );
}
