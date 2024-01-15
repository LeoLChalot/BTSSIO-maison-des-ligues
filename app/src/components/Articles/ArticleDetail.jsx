// Importez useState et useEffect
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Categorie from '../../models/Categorie'
import { isValidToken } from '../../utils/isValidToken'
import { decodeToken } from '../../utils/decodeToken'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

import './ArticleDetail.css'

const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState({})
  const [quantite, setQuantite] = useState(1)
  const [photo, setPhoto] = useState(null)
  const [categorie, setCategorie] = useState('')
  const serverBaseUrl = 'http://localhost:3000'
  const [jwtToken, setJwtToken] = useState('')
  const [addedArticle, setAddedArticle] = useState(false)
  const navigate = useNavigate()

  const fetchArticle = async (id) => {
    try {
      const { data } = await axios.get(
        `${serverBaseUrl}/m2l/boutique/articles?id_article=${id}`
      )
      const photoPath = data.infos[0].photo
      const photoUrl = `${serverBaseUrl}/${photoPath.replace(/\\/g, '/')}`
      setPhoto(photoUrl)
      const selectedCategorie = await Categorie.getCategoryById(
        data.infos[0].categorie_id
      )
      setCategorie(selectedCategorie)
      setArticle(data.infos[0])
    } catch (error) {
      console.error('Error fetching article:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Check if the user is logged in
    if (Cookies.get('jwt_token') === undefined) {
      alert('Veuillez vous connecter pour ajouter un article au panier')
      navigate('/connexion')
      return
    }

    if (quantite > article.quantite || quantite < 1 || quantite === null) {
      alert('Quantité invalide')
      setQuantite(1)
      return
    }

    try {
      setJwtToken(Cookies.get('jwt_token'))
      const decoded_token = decodeToken(jwtToken)
      console.log(decoded_token)
      const pseudo = decoded_token.pseudo
      const panier = decoded_token.panier
      console.log({panier: decoded_token.panier})
      console.log({
        panier: panier,
        article: article.id_article,
        quantite: quantite,
      })
      // Make an API call to add the article to the cart

      const headers = {
        'Content-Type': 'application/json',
      }
      const body = {
        id_panier: panier,
        id_article: article.id_article,
        quantite: quantite,
      }

      const config =  {
        headers,
        withCredentials: true,
      }

      const res = await axios.post(
        `http://localhost:3000/m2l/panier/${pseudo}`, body, config )
        
      console.log(res)
      if (res.status === 200) {
        quantite === 1
          ? alert('Article ajouté au panier')
          : alert('Articles ajoutés au panier')
        setAddedArticle(true)
        return
      } else if (res.status === 400) {
        alert('Article en rupture !')
      }

      navigate('/boutique')
    } catch (error) {
      console.error('Error adding article to cart:', error)
    }
  }

  useEffect(() => {
    setAddedArticle(false)
    fetchArticle(id)
    setJwtToken(Cookies.get('jwt_token'))
    
  }, [addedArticle])

  return (
    <div className="article-detail">
      <div className="article-image">
        <img src={photo} alt={article.nom} />
        <div className="article-price">
          <span>{article.prix} €</span>
        </div>
      </div>
      <div className="article-info">
        <p>{categorie}</p>
        <h2 style={{ textAlign: 'left' }}>{article.nom}</h2>
        <p>{article.description}</p>

        <p style={{ fontWeight: 'bold' }}>
          <>
            {article.quantite === 0 ? (
              <span style={{ color: 'red' }}>En rupture</span>
            ) : article.quantite === 1 ? (
              <span style={{ color: 'maroon' }}>
                Plus qu'un exemplaire en stock !
              </span>
            ) : (
              <span style={{ color: 'green' }}>
                {article.quantite} en stock
              </span>
            )}
          </>
        </p>

        {article.quantite > 0 ? (
          <form id="formulaire-ajout-panier" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="number"
              name="quantite"
              id="quantite"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              min="1"
              step="1"
            />
            <button type="submit">Ajouter au panier</button>
          </form>
        ) : null}
      </div>
    </div>
  )
}

export default ArticleDetail
