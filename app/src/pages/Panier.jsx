import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panier from '../models/Panier'
import panierVide from '/panier-vide.png'
import { useAuth } from '../hooks/useAuth'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { Button } from 'flowbite-react'
import axios from 'axios'

const PagePanier = () => {
  const pseudo_param = useParams().pseudo
  const { pseudo, id_panier } =
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
      toast.info('Panier validé !')
      setRerender((rerender) => !rerender)

    } catch (error) {
      console.error('Erreur lors de la validation du panier', error)
    }
  }

  const articleStandBy = async (id_panier, id_article) => {
    const requestStandby = await axios.post(
      `http://localhost:3000/m2l/panier/standby/${id_panier}`,
      { "id_article": id_article }
    )

    console.log('Mise en fil d\'attente de l\'article dans le panier de ' + pseudo)
    console.log(requestStandby)
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
  }, [navigate, pseudo, pseudo_param, rerender])

  return (
    <>
      <div id="page-panier">
        {prixTotal == 0 ?
          <h1 className="page-title text-3xl font-bold">Page Panier</h1>
          : <h1 className="page-title text-3xl font-bold">Page Panier - {prixTotal} €</h1>}
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
                        <Button
                          // color="failure"
                          onClick={() =>
                            handleAction(
                              article.id_article,
                              article.id_panier,
                              'delete'
                            )
                          }
                        >
                          <p className='font-bold text-white'>-</p>
                        </Button>
                      </td>
                      <td>{article.quantite_articles}</td>
                      <td>
                        <Button
                          onClick={() =>
                            handleAction(
                              article.id_article,
                              article.id_panier,
                              'add'
                            )
                          }
                        >
                          <p className='font-bold text-white'>+</p>
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => articleStandBy(article.id_article, article.id_panier)}>File</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button type="submit" onClick={() => validerPanier(id_panier)}>
                Valider
              </Button>
            </>
          ) : (
            <div className='p-6 text-center border-0 shadow-none'>
              <img src={panierVide} alt="panier vide" width="300" />
              <p className='mx-auto text-xl'>Vous n'avez rien dans votre panier...</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default PagePanier
