import { gql } from "@apollo/client";

export const GET_POKEMONS = gql`
  query GetPokemons {
    pokemons(limit: 10, offset: 0) {
      results {
        id
        name
      }
    }
  }
`;
