import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panier from '../models/Panier'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'
import {v4 as uuidv4} from 'uuid'

const PagePanier = () => {
  const pseudo_param = useParams().pseudo
  const { isLoggedIn, isAdmin, pseudo, jwtToken, updateState } = useAuth()
  const [prix, setPrix] = useState(0)
  const [panier, setPanier] = useState({})
  const [articles, setArticles] = useState([])
  const [rerender, setRerender] = useState(false)
  const navigate = useNavigate()

  const getPanier = async (pseudo) => {
    try {
      const panier = await Panier.getPanier(pseudo)
      setPanier(panier)
      const articles_panier = panier.getArticles()
      setArticles(articles_panier)
      setPrix(panier.getPrixTotal())
    } catch (error) {
      console.error('Erreur lors de la récupération du panier :', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await panier.deleteArticleFromPanier(pseudo, id)
      setRerender(true)
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article du panier :', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn || pseudo_param !== pseudo) navigate('/notyou')
      await getPanier(pseudo)
    }
    fetchData()
    setRerender(false)
  }, [rerender])

  return (
    <>
      <div id="page-panier">
        <h1>Page Panier | {prix}€</h1>
        <div className="content">
          {articles?.length > 0 ? (
            <ul className='list-panier'>
              {articles.map((article) => (
                <li className="item-panier" key={article.id}>{article.nom} <button onClick={() => handleDelete(article.id)}>supprimer</button></li>
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
