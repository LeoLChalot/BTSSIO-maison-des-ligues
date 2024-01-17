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

  const handleDelete = async (id) => {
    console.log('Début ft handleDelete')
    try {
      console.log(`Suppression de la ligne ${id} du panier de ${pseudo}`)
      // console.log(await panier.deleteArticleFromPanier(id))
      const requestPanier = new Panier(pseudo);
      const request = await requestPanier.deleteArticleFromPanier(id)
      console.log('Fin ft handleDelete', request)
      request ? setRerender((rerender) => !rerender) : console.error('Erreur')
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'article du panier",
        error
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const cart = new Panier(pseudo)
      const requestCart = await cart.initCart().then((res) => {
        console.log({ res: res })
      })
      console.log({ cart: cart })
      setPanier(requestCart)
      const requestPrix = await cart.getPrixTotal()
      const requestArticles = cart.getArticles()

      console.log({
        cart: cart,
        requestPrix: requestPrix,
        requestArticles: requestArticles,
      })

      setPrix(requestPrix)
      setArticles(requestArticles)
      console.log({
        message: "pendant l'initialisation du panier",
        articles,
        prix,
      })
    }
    fetchData()
  }, [rerender])

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
            <div className="error" id="error">
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
