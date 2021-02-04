import React, { useState } from 'react'
import axios from 'axios'

const url='https://pokeapi.co/api/v2/pokemon/';

export default function PokemonImage({pokeName}) {
    const [image, setImage] = useState([])

    axios.get(`${url}/pokeName`)
        .then(res=>{
            setImage(res.data.sprites.front_default)
        })

    return (
        <div  className='card-image'>
            <image src={image} />
        </div>
    )
}
