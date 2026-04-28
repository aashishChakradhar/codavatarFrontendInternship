import usePokemon from "../../api/pokemon/pokemonIndAPI";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PokemonResult({ name }: { name: string }) {
  const { pokemon, errorMessage } = usePokemon(name);

  if (errorMessage) return <div>{errorMessage}</div>;
  if (!pokemon) return <div>No Pokemon found</div>;
  const typeNames =
    pokemon.types
      ?.map((entry) => entry?.type?.name)
      .filter((n): n is string => typeof n === "string" && n.length > 0) ?? [];

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={
          pokemon.sprites?.front_default ?? "https://avatar.vercel.sh/shadcn1"
        }
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-contain"
      />
      <CardHeader>
        <CardTitle className="flex justify-between">
          {pokemon.name ?? "Unknown"}{" "}
          <Badge variant="secondary">
            {typeNames.length > 0 ? typeNames.join(", ") : "Unknown"}
          </Badge>
        </CardTitle>
        <CardContent className="w-full">
          <p>Height: {pokemon.height ?? "Unknown"}</p>
          <p>Weight: {pokemon.weight ?? "Unknown"}</p>
          <p>Species: {pokemon.species?.name ?? "Unknown"}</p>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
