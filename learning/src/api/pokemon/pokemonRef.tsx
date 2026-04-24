import { gql } from "@apollo/client";
import { useBackgroundQuery } from "@apollo/client/react";

interface PokemonProps {
  name: string;
}

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
  // error: string;
};

export const GET_POKEMON = gql`
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

export type PokemonDetailQueryVariables = PokemonProps;

export type PokemonDetailQueryRef = NonNullable<
  ReturnType<typeof useBackgroundQuery<GetPokemonQueryProps, PokemonProps>>[0]
>;
