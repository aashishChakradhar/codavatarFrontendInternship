import { useBackgroundQuery, useReadQuery } from "@apollo/client/react";
import { GET_POKEMONS } from "../../api/pokemon/pokemonlist";
import { Suspense, useState } from "react";
import PokemonRef from "./pokemonRefComponent";
import {
  GET_POKEMON,
  type GetPokemonQueryProps,
  type PokemonDetailQueryVariables,
} from "../../api/pokemon/pokemonRef";

type Pokemon = {
  id: number;
  name: string;
};

type GetPokemonsQuery = {
  pokemons: {
    results: Pokemon[];
  };
};

export default function PokemonList() {
  const [listQueryRef] = useBackgroundQuery<GetPokemonsQuery>(GET_POKEMONS);
  const { error, data } = useReadQuery(listQueryRef);

  const [selected, setSelected] = useState<string>("pikachu");
  const [detailQueryRef] = useBackgroundQuery<
    GetPokemonQueryProps,
    PokemonDetailQueryVariables
  >(GET_POKEMON, {
    variables: {
      name: selected,
    },
  });

  if (error) return <p>Error loading Pokémon</p>;

  return (
    <div className="p-5 ">
      <h2>10 Pokémon</h2>

      <ul>
        {data?.pokemons.results.map((p) => (
          <li
            key={p.id}
            className="p-1 border cursor-pointer"
            onClick={() => setSelected(p.name)}
          >
            {p.name}
          </li>
        ))}
      </ul>

      <Suspense fallback={<p>Loading selected Pokémon...</p>}>
        {!detailQueryRef ? (
          <p>Preparing selected Pokémon query...</p>
        ) : (
          <PokemonRef queryRef={detailQueryRef} />
        )}
      </Suspense>
    </div>
  );
}
