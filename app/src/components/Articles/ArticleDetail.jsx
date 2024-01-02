// Importez useState et useEffect
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Categorie from '../../models/Categorie'
import Article from '../../models/Article'
import Panier from '../../models/Panier'
import './ArticleDetail.css'

const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState({})
  const navigate = useNavigate()
  const serverBaseUrl = 'http://localhost:3000'

  const fetchArticle = async (id) => {
    console.log({'fetchArticle': id})
    try {
      const { data } = await axios.get(
        `${serverBaseUrl}/m2l/boutique/article?idart=${id}`
      )
      console.log({"data" : data})
      const photoPath = data.photo
      const photoUrl = `${serverBaseUrl}/${photoPath.replace(/\\/g, '/')}`
      const categorie = await Categorie.getCategoryById(data.categorie_id)
      setArticle({
        id: data.id_article,
        nom: data.nom,
        description: data.description,
        prix: data.prix,
        quantite: data.quantite,
        photo: photoUrl,
        categorie: categorie.nom,
        categorie_id: data.categorie_id,
      })
    } catch (error) {
      console.error('Error fetching article:', error)
    }
  }

  const ajouterAuPanier = async (id_article) => {
    // Vérifiez si l'utilisateur est connecté
    if (localStorage.getItem('oauth_token')) {
      try {
        // make an API call to add the article to the cart
        await axios.post(`http://localhost:3000/m2l/panier/add`, {
          articleId: id_article,
          userId: localStorage.getItem('id_utilisateur'),
        })
        alert('Article ajouté au panier')
        navigate('/boutique')
      } catch (error) {
        console.error('Error adding article to cart:', error)
      }
    }else {
      alert('Veuillez vous connecter pour ajouter un article au panier')
      navigate('/connexion')
    }
  }

  useEffect(() => {
    // Utilisez la catégorie directement de l'objet article ici
    fetchArticle(id)
    console.log(article)
    console.log(id)
  }, [])

  return (
    <div className="article-detail">
      <div className="article-image">
        <img src={article.photo} alt={article.nom} />
      </div>
      <div className="article-info">
        <h2 style={{ textAlign: 'left' }}>{article.nom}</h2>
        <p>{article.description}</p>
        <p>Prix: {article.prix} €</p>
        <p>
          Quantité disponible:{' '}
          {article.quantite === 0 ? 'Indisponible' : article.quantite}
        </p>
        <p>Catégorie: {article.categorie}</p>
        <button onClick={() => ajouterAuPanier(article.id)}>Ajouter au panier</button>
      </div>
    </div>
  )
}

export default ArticleDetail
