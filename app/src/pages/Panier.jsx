import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panier from '../models/Panier'
import Article from '../models/Article'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'


const PagePanier = () => {
  const pseudo_param = useParams().pseudo
  const { isLoggedIn, isAdmin, pseudo, jwtToken, updateState } = useAuth()
  const [prix, setPrix] = useState(0)
  const [panier, setPanier] = useState(null)
  const [articles, setArticles] = useState([])
  const [rerender, setRerender] = useState(false)
  const navigate = useNavigate()

  const getPanier = async (pseudo) => {
    try {
      console.log(`Avant l'appel à Panier.getCart(${pseudo})`)
      const fetchPanier = await Panier.getCart(pseudo)
      console.log(`Apres l'appel à Panier.getCart(${pseudo}) : ${fetchPanier}`)
      if (!fetchPanier) {
        console.error('Panier introuvable')
        return
      }
      const articles = fetchPanier.getArticles()
      if (!articles) {
        console.error('Articles introuvables')
        return
      }
      setPanier(fetchPanier)
      setPrix(fetchPanier.getPrixTotal())
      setArticles(articles)
      setRerender(true)
    } catch (error) {
      console.error('Erreur lors de la récupération du panier :', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const panierUser = new Panier(panier.id_panier, pseudo)
      await panierUser.deleteArticleFromPanier(id)
      setRerender(true)
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'article du panier",
        error
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn || pseudo_param !== pseudo) {
        navigate('/notyou')
        return
      }
      await getPanier(pseudo)
    }
    fetchData()
    setRerender(false)
  }, [panier, rerender])

  return (
    <>
      <div id="page-panier">
        <h1>Page Panier | {prix}€</h1>
        <div className="content">
          {articles?.length > 0 ? (
            <ul className="list-panier">
              {articles.map((article) => (
                <li className="item-panier" key={article.id}>
                  {article.nom}
                  <button onClick={() => handleDelete(article.id)}>
                    supprimer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div id="error">
              <div
                className="message"
                style={{ textAlign: 'center', padding: '20px' }}
              >
                <p>Vous n'avez rien dans votre panier...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PagePanier
