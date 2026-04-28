import { gql } from "@apollo/client";
import { useSuspenseQuery, useQuery } from "@apollo/client/react";
import { useMemo } from "react";

type PokemonWithType = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

type PokemonListProp = {
  pokemons: {
    results: {
      id: number;
      name: string;
      image: string;
    }[];
  };
};

type PokemonTypesProp = Record<
  string,
  {
    types:
      | {
          type: {
            name: string | null;
          } | null;
        }[]
      | null;
  } | null
>;

const GET_POKEMON_LIST_QUERY = gql`
  query GetPokemons {
    pokemons(limit: 10, offset: 0) {
      results {
        id
        name
        image
      }
    }
  }
`;

export default function usePokemonList(): {
  pokemons: PokemonWithType[];
  errorMessage: string | null;
  loading: boolean;
} {
  // Fetch the list of Pokémon (suspends while loading)
  const { error, data } = useSuspenseQuery<PokemonListProp>(
    GET_POKEMON_LIST_QUERY,
  );

  // Build a batched types query for all Pokémon
  const pokemonTypeQuery = useMemo(() => {
    const results = data?.pokemons.results ?? [];

    if (results.length === 0) {
      return null;
    }

    return gql`
      query PokemonTypes {
        ${results
          .map(
            (pokemon, index) =>
              `pokemon_${index}: pokemon(name: ${JSON.stringify(pokemon.name)}) {
              types {
                type {
                  name
                }
              }
            }`,
          )
          .join("\n")}
      }
    `;
  }, [data?.pokemons.results]);

  // Fetch all types in one query
  const { data: typeData, loading: typesLoading } = useQuery<PokemonTypesProp>(
    pokemonTypeQuery || GET_POKEMON_LIST_QUERY,
    {
      skip: !pokemonTypeQuery,
    },
  );

  // Combine list and types data
  const pokemonsWithTypes = useMemo(() => {
    if (!data?.pokemons.results) return [];

    return data.pokemons.results.map((pokemon, index) => {
      const types =
        typeData?.[`pokemon_${index}`]?.types
          ?.map((entry) => entry.type?.name)
          .filter(
            (name): name is string => name !== null && name !== undefined,
          ) ?? [];

      return {
        ...pokemon,
        types,
      };
    });
  }, [data?.pokemons.results, typeData]);

  if (error) {
    return {
      pokemons: [],
      errorMessage: "Error fetching Pokémon list",
      loading: false,
    };
  }

  return {
    pokemons: pokemonsWithTypes,
    errorMessage: null,
    loading: typesLoading,
  };
}
