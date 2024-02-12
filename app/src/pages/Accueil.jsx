import React from 'react'
import { signal } from '@preact/signals-react'
import './page.css'
import CarouselFlowbite from '../components/Carousel/Carousel'


const Accueil = () => {
  return (
    <>
        <CarouselFlowbite
          title="Maison des Ligues"
          subtitle="Le sport en bonnes conditions"
          buttonText="Boutique"
        />

    </>
  )
}

export default Accueil
