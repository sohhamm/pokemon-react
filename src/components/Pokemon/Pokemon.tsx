import * as React from 'react';

export default function Pokemon() {
  const [pokemon, setPokemon] = React.useState([]);

  return (
    <>
      {pokemon.map((pokemon) => {
        return (
          <div className="card">
            <div className="card-header">{pokemon.name}</div>
            {/* <PokemonImage pokeName={pokemon.name} /> */}
          </div>
        );
      })}
    </>
  );
}
