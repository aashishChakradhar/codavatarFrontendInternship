import { Suspense } from "react";
import Pokemon from "../../components/pokemon/pokemonComponent";
import PokemonRef from "../../components/pokemon/pokemonRefComponent";
import PokemonList from "../../components/pokemon/pokemonListComponent";

export default function PokemonPage() {
  return (
    <div className="bg-blue-100 h-dvh flex lg:flex-col items-center">
      Pokemon Page
      <Suspense fallback={<h2> Searching...</h2>}>
        {/* <Pokemon /> */}
        {/* <PokemonRef /> */}
        <PokemonList />
      </Suspense>
    </div>
  );
}
