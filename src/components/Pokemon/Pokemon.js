import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonImage from '../utils/PokemonImage';

const url = 'https://pokeapi.co/api/v2/pokemon';

export default function Pokemon() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        const pokeArray = res.data.results;
        setPokemon(pokeArray);
        console.log(pokeArray);
      })
      .catch((err) => console.log(err));
    // console.log(poke)
    // return () => {

    // }
  }, []);

  return (
    <>
      {pokemon.map((pokemon) => {
        return (
          <div className="card">
            <div className="card-header">{pokemon.name}</div>
            <PokemonImage pokeName={pokemon.name} />
          </div>
        );
      })}
    </>
  );
}
