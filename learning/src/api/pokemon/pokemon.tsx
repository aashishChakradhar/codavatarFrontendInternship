import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/client/react";

interface PokemonProps {
  name: string;
}

// export type PokemonData = NonNullable<GetPokemonQueryProps["pokemon"]>;

export type GetPokemonQueryProps = {
  pokemon: {
    name: string | null;
    height: number | null;
    weight: number | null;
    types:
      | {
          type: {
            id: number | null;
            name: string | null;
          } | null;
        }[]
      | null;
    species: {
      name: string | null;
    } | null;
  } | null;
};

const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      name
      height
      weight
      types {
        type {
          id
          name
        }
      }
      species {
        name
      }
    }
  }
`;

export default function usePokemon(name: string): {
  pokemon: GetPokemonQueryProps["pokemon"];
  errorMessage: string | null;
} {
  const { error, data } = useSuspenseQuery<GetPokemonQueryProps, PokemonProps>(
    GET_POKEMON,
    {
      variables: {
        name,
      },
    },
  );

  if (error)
    return {
      pokemon: null,
      errorMessage: "Error fetching the data",
    };

  return { pokemon: data?.pokemon ?? null, errorMessage: null };
}
