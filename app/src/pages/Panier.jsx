import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panier from '../models/Panier'

const PagePanier = () => {
  const { pseudo } = useParams()
  const [panier, setPanier] = useState([])
  const ls = localStorage
  const navigate = useNavigate()

  const getPanier = async (pseudo) => {
    try {
      console.log('getPanier')
      const oauth = ls.getItem('oauth_token')
      const {data}  = await Panier.getPanier(oauth, pseudo)
      console.log(data)

      if (data && data.panier) {
        const panierArticles = data.panier.articles ?? []
        setPanier([...panierArticles])
      } else {
        console.error(
          'Réponse invalide lors de la récupération du panier :',
          data
        )
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du panier :', error)
    }
  }

  useEffect(() => {
    if (!ls.getItem('isAuth') || ls.getItem('pseudo') != pseudo)
      navigate('/unauthorized')
    getPanier(pseudo)
  }, [pseudo])

  return (
    <>
      <div id="page-panier">
        <h1>Page Panier</h1>
        <div className="content">
          {panier?.length > 0 ? (
            panier.map((article) => <p>{article.nom}</p>)
          ) : (
            <div id="error">
              <div className="message" style={{ textAlign: 'center', padding: '20px' }}>
                <p>
                  Vous n'avez rien dans votre panier... Ou celui ci ne vous
                  appartient pas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PagePanier
