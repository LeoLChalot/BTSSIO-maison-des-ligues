import React from 'react'
import { signal } from '@preact/signals-react'
import './page.css'
import Banner from '../components/Banner/Banner'


const Accueil = () => {
  return (
    <section id="page-accueil" className="page">
      <Banner
        title="Maison des Ligues"
        subtitle="Le sport en bonnes conditions"
        buttonText="Boutique"
      />
    </section>
  )
}

export default Accueil
