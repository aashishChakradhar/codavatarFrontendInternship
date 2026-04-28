import { useState, type ChangeEvent } from "react";
import usePokemon from "../../api/pokemon/pokemon";
import { Suspense } from "react";

import { SpinnerCustom } from "../spinner/spinner";

function PokemonResult({ name }: { name: string }) {
  const { pokemon, errorMessage } = usePokemon(name);

  if (errorMessage) return <div>{errorMessage}</div>;
  if (!pokemon) return <div>No Pokemon found</div>;

  return (
    <div>
      <h3>{pokemon.name ?? "Unknown"}</h3>
      <p>Height: {pokemon.height ?? "Unknown"}</p>
      <p>Weight: {pokemon.weight ?? "Unknown"}</p>
      <p>Species: {pokemon.species?.name ?? "Unknown"}</p>
    </div>
  );
}

export default function Pokemon() {
  const [selectedPokemon, setSelectedPokemon] = useState<string>("pikachu");
  const [searchPokemon, setSearchPokemon] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchPokemon(e.target.value);
  };

  return (
    <div className="border w-2/5 min-h-2/3">
      Pokemon Api Component
      <input
        className="border"
        type="text"
        onChange={handleChange}
        value={searchPokemon}
      />
      <Suspense fallback={<SpinnerCustom />}>
        <PokemonResult name={selectedPokemon} />
      </Suspense>
    </div>
  );
}
