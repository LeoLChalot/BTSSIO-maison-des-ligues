import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Panier from '../models/Panier'

const PagePanier = () => {
  const { pseudo } = useParams()
  const [panier, setPanier] = useState([])

  const getPanier = async (pseudo) => {
    console.log(pseudo)
    const { data } = await Panier.getPanier(pseudo)
    console.log(data)
    console.log(data.panier.articles)
    setPanier([...data.panier.articles])
    console.log(panier)
  }

  useEffect(() => {
    getPanier(pseudo)
    console.log(panier)
  }, [pseudo])

  return (
    <div>
      <h1>Page Panier</h1>
      {panier.length > 0 ? (
        panier.map((article) => <p>{article.nom}</p>)
      ) : (
        <p>Vous n'avez rien dans votre panier...</p>
      )}
    </div>
  )
}

export default PagePanier
