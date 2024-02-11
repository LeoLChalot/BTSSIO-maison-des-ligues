import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panier from '../models/Panier'
import Article from '../models/Article'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'

const PagePanier = () => {
  const pseudo_param = useParams().pseudo
  const { isLoggedIn, isAdmin, pseudo, jwtToken, id_panier, updateState } =
    useAuth()
  const [prixTotal, setPrixTotal] = useState(0)
  const [panier, setPanier] = useState(null)
  const [articles, setArticles] = useState([])
  const [rerender, setRerender] = useState(false)
  const navigate = useNavigate()

  const handleAction = async (id_article, id_panier, action) => {
    try {
      const get_panier = new Panier(pseudo)
      if (action == 'delete') {
        console.log(
          `Suppression de l'article id: ${id_article} du panier de ${pseudo}`
        )
        await get_panier.deleteArticleFromPanier(id_article, id_panier)
      } else if (action == 'add') {
        console.log(
          `Ajout de l'article id: ${id_article} au panier de ${pseudo}`
        )
        await get_panier.addArticleToPanier(id_article, id_panier)
      }
      setRerender((rerender) => !rerender)
    } catch (error) {
      console.error(
        "Erreur lors de l'action sur l'article dans le panier",
        error
      )
    }
  }

  const validerPanier = async () => {
    try {
      const get_panier = new Panier(pseudo)
      await get_panier.confirmPanier()
      console.log({ 'rerender before': rerender })
      setRerender((rerender) => !rerender)
      console.log({ 'rerender after': rerender })
    } catch (error) {
      console.error('Erreur lors de la validation du panier', error)
    }
  }

  useEffect(() => {
    pseudo === pseudo_param
      ? console.log('Pseudo OK')
      : navigate(`/panier/${pseudo}`)
    const fetchData = async () => {
      const new_panier = new Panier(pseudo)
      const requestPanier = await new_panier.initCart()
      const requestArticles = requestPanier.getArticles()
      const cumulatedPrix = await requestPanier.getPrixTotal()

      const id_panier = requestPanier.getId()

      setPanier(requestPanier)
      setPrixTotal(cumulatedPrix)
      setArticles(requestArticles)
      console.log({
        message: 'Initialisation du panier',
        id_panier,
        articles: requestArticles,
        cumulatedPrix,
      })
    }
    fetchData()
  }, [rerender])

  return (
    <>
      <div id="page-panier">
        <h1>Page Panier | {prixTotal}€</h1>
        <div className="panier-container">
          {articles?.length > 0 ? (
            <>
              <table>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <img
                          src={
                            `http://localhost:3000/` +
                            article.photo.replace(/\\/g, '/')
                          }
                          width="100"
                          height="100"
                          className="cart-item"
                        />
                      </td>
                      <td>{article.nom}</td>
                      <td>
                        {(
                          article.prix_unite * article.quantite_articles
                        ).toFixed(2)}
                        €
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleAction(
                              article.id_article,
                              article.id_panier,
                              'delete'
                            )
                          }
                        >
                          -
                        </button>
                      </td>
                      <td>{article.quantite_articles}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleAction(
                              article.id_article,
                              article.id_panier,
                              'add'
                            )
                          }
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="submit" onClick={() => validerPanier(id_panier)}>
                Valider
              </button>
            </>
          ) : (
            <div className="empty-div" id="empty-div">
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
