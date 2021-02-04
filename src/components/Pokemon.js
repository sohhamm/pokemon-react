import React, { useState, useEffect } from 'react'

const url='https://pokeapi.co/api/v2/pokemon'

export default function Pokemon() {
    const [pokemon, setPokemon] = useState([])

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const pokeArray = data.results;
                console.log(pokeArray)
            })
        // console.log(poke)
        // return () => {
            
        // }
    }, [pokemon])

    return (
        <>
            
            
        </>
    )
}
