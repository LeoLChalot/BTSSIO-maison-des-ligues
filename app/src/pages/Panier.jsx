import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panier from '../models/Panier'
import Article from '../models/Article'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'

const PagePanier = () => {
  const pseudo_param = useParams().pseudo
  const { isLoggedIn, isAdmin, pseudo, jwtToken, updateState } = useAuth()
  const [prixTotal, setPrixTotal] = useState(0)
  const [panier, setPanier] = useState(null)
  const [articles, setArticles] = useState([])
  const [rerender, setRerender] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async (id_article, id_panier) => {
    console.log('Début ft handleDelete')
    try {
      console.log(`Suppression de la ligne ${id_article} du panier de ${pseudo}`)
      // console.log(await panier.deleteArticleFromPanier(id))
      const requestPanier = new Panier(pseudo)
      const request = await requestPanier.deleteArticleFromPanier(id_article, id_panier)
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
      const requestCart = await cart.initCart()
      console.log({ requested_cart: requestCart })
      setPanier(requestCart)
      // const requestPrix = await requestCart.getPrixTotal()
      const requestArticles = requestCart.articles

      const cumulatedPrix = requestArticles.reduce(
        (total, article) => total + article.prix_total,
        0
      )

      setPrixTotal(cumulatedPrix)
      setArticles(requestArticles)
      console.log({
        message: "pendant l'initialisation du panier",
        articles,
        cumulatedPrix,
      })
    }
    fetchData()
  }, [rerender])

  return (
    <>
      <div id="page-panier">
        <h1>Page Panier | {prixTotal}€</h1>
        <div className="content">
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
                      <td>{article.prix_unite * article.quantite_articles}€</td>

                      <td>
                        <button onClick={() => handleDelete(article.id_article, article.id_panier)}>-</button>
                      </td>
                      <td>{article.quantite_articles}</td>
                      <td>
                        <button>+</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <ul className="list-panier">
                {articles.map((article) => (
                  <li className="item-panier" key={article.id}>
                    <img
                      src={
                        `http://localhost:3000/` +
                        article.photo.replace(/\\/g, '/')
                      }
                      width="100"
                      height="100"
                      className="cart-item"
                    />
                    <p>{article.nom}</p>
                    <p>
                      Quant. {article.quantite_articles}{' '}
                      
                    </p>
                    <p>{article.prix_unite * article.quantite_articles}€</p>
                    <button onClick={() => handleDelete(article.id)}>
                      supprimer
                    </button>
                  </li>
                ))}
              </ul> */}
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
