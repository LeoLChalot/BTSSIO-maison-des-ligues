/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import panierVide from '/panier-vide.png'
import { useAuth } from '../hooks/useAuth'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { Button } from 'flowbite-react'
import axios from 'axios'

const PagePanier = () => {
  const pseudo_param = useParams().pseudo
  const { pseudo, panier_id, token } =
    useAuth()
  const [prixTotal, setPrixTotal] = useState(0)
  const [panier, setPanier] = useState(null)
  const [articles, setArticles] = useState([])
  const [rerender, setRerender] = useState(false)
  const navigate = useNavigate()
  const baseUrl = `http://` + JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')


  const addToCart = async (id_article) => {
    console.log(
      `Ajout de l'article id: ${id_article} au panier de ${pseudo}`
    )
    const headers = {
      'Content-Type': 'application/json',
	'Authorization': `Bearer ${token}`
    }
    const body = {
      id_article: id_article,
      quantite: 1,
    }
    const config = {
      headers,
      withCredentials: true,
    }
    const request = await axios.post(
      `${baseUrl}/m2l/panier/add/${panier.id}`,
      body,
      config
    )
    request.status == 200 ? toast.success(request.data.message) : toast.error(request.data.message)
    setRerender((rerender) => !rerender)
  }
  const deleteToCart = async (id_article) => {
    console.log(
      `Suppression de l'article id: ${id_article} du panier de ${pseudo}`
    )
    const request = await axios.delete(`${baseUrl}/m2l/panier/delete_one/${panier.id}?id_article=${id_article}`)
    request.status == 200 ? toast.info(request.data.message) : toast.error(request.data.message)
    setRerender((rerender) => !rerender)
  }


  const validerPanier = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
      const body = {
        panier: panier
      }
      const config = {
        headers,
        withCredentials: true,
      }
      const request = await axios.post(
        `${baseUrl}/m2l/panier/validate/${pseudo}`,
        body,
        config
      )
      request.status == 200 ? toast.success(request.data.message) : toast.error(request.data.message)
      setRerender((rerender) => !rerender)

    } catch (error) {
      console.error('Erreur lors de la validation du panier', error)
    }
  }

  const articleStandBy = async (id_panier, id_article) => {
    const requestStandby = await axios.post(
      `${baseUrl}/m2l/panier/standby/${id_panier}`,
      { "id_article": id_article }
    )

    console.log('Mise en fil d\'attente de l\'article dans le panier de ' + pseudo)
    console.log(requestStandby)
  }

  useEffect(() => {
    console.log(pseudo)
    pseudo === pseudo_param
      ? console.log('Pseudo OK')
      : navigate(`/panier/${pseudo}`)

    const fetchData = async () => {
      const fetch_panier = await axios.get(`${baseUrl}/m2l/panier/${pseudo}`)
      console.log(fetch_panier)
      setPanier(await fetch_panier.data.infos.panier)
      setPrixTotal(await fetch_panier.data.infos.panier.prix_total)
      setArticles(await fetch_panier.data.infos.panier.articles)
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender])

  return (
    <>
      <div id="page-panier">
        {prixTotal == 0 ?
          <h1 className="page-title text-3xl font-bold">Page Panier</h1>
          : <h1 className="page-title text-3xl font-bold">Page Panier - {panier.prix_total} €</h1>}
        <div className="panier-container">
          {articles?.length > 0 ? (
            <>
              <table>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.article.id}>
                      <td>
                        <img
                          src={
                            `${baseUrl}/` +
                            article.article.image.replace(/\\/g, '/')
                          }
                          width="100"
                          height="100"
                          className="cart-item"
                        />
                      </td>
                      <td>{article.article.nom}</td>
                      <td>
                        {(
                          article.sous_total
                        )}
                        €
                      </td>
                      <td>
                        <Button
                          // color="failure"
                          onClick={() =>
                            deleteToCart(
                              article.article.id,
                            )
                          }
                        >
                          <p className='font-bold text-white'>-</p>
                        </Button>
                      </td>
                      <td><p>{article.quantite}</p></td>
                      <td>
                        <Button
                          onClick={() =>
                            addToCart(
                              article.article.id,
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
              <Button type="submit" onClick={() => validerPanier(panier.id)}>
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
