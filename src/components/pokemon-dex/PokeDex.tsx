import React from 'react';
import { gql, useQuery } from '@apollo/client';

const getPokemonNames = gql`
  query MyQuery {
    pokemon_v2_pokemon(limit: 20) {
      name
      order
    }
  }
`;

export default function PokeDex() {
  const { data, loading, error } = useQuery(getPokemonNames);

  if (error) return <p>error fetching pokemon names</p>;

  if (loading) return <p>loading....</p>;

  return (
    <div>
      {/* <Navbar /> */}
      {data.pokemon_v2_pokemon.map((pokemon) => (
        <div key={pokemon.order}>{pokemon.name}</div>
      ))}
    </div>
  );
}
