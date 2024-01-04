import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Panier from '../models/Panier'

const PagePanier = () => {
  const { pseudo } = useParams()
  const [panier, setPanier] = useState([])

  const getPanier = async (pseudo) => {
    console.log(pseudo)
    await Panier.getPanier(pseudo).then((data) => {
      console.log(data.panier.articles)
      setPanier([...data.panier.articles])
    })
    // console.log(data.panier.articles);

    // setPanier([...data.panier.articles]);
    console.log(panier)
  }

  useEffect(() => {
    getPanier(pseudo)
    console.log(panier)
  }, [pseudo])

  return (
    <div>
      <h1>Page Panier</h1>
      {panier ? (
        panier.map((article) => {
          <div>
            <p>{article}</p>
          </div>
        })
      ) : (
        <h1>Aucun article</h1>
      )}
    </div>
  )
}

export default PagePanier
