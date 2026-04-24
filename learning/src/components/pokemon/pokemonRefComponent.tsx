import { useReadQuery } from "@apollo/client/react";
import { type PokemonDetailQueryRef } from "../../api/pokemon/pokemonRef";

function PokemonResult({ queryRef }: { queryRef: PokemonDetailQueryRef }) {
  const { data } = useReadQuery(queryRef);

  //   if (error) return <div>Error fetching the data</div>;

  const pokemon = data?.pokemon ?? null;
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

export default function PokemonRef({
  queryRef,
}: {
  queryRef: PokemonDetailQueryRef;
}) {
  return (
    <div className="border p-10">
      Pokemon Api Component Read background
      <PokemonResult queryRef={queryRef} />
    </div>
  );
}
