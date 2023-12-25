// Importez useState et useEffect
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Categorie from '../../models/Categorie'
import Panier from '../../models/Panier'
import './ArticleDetail.css'

const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState({})
  const [categorie, setCategorie] = useState('')
  const serverBaseUrl = 'http://localhost:3000'

  const getCategory = async (categorie_id) => {
    try {
      const category = await Categorie.getCategoryById(categorie_id)
      setCategorie(category)
    } catch (error) {
      console.error('Error retrieving category:', error)
    }
  }
  const fetchArticle = async (id) => {
    try {
      const { data } = await axios.get(`${serverBaseUrl}/m2l/boutique/article?idart=${id}`)
      console.log(data)
      const photoPath = data.photo
      console.log(photoPath)
      const photoUrl = `${serverBaseUrl}/${photoPath.replace(/\\/g, '/')}`
      getCategory(data.categorie_id)
      setArticle({
        id: data.id_article,
        nom: data.nom,
        description: data.description,
        prix: data.prix,
        quantite: data.quantite,
        photo: photoUrl,
        categorie: categorie,
        categorie_id: data.categorie_id,
      })

    } catch (error) {
      console.error('Error fetching article:', error)
    }
  }

  const ajout_panier = async (article) => {
    console.log('article', article)
  } 
  

  useEffect(() => {
    // Utilisez la catégorie directement de l'objet article ici
    fetchArticle(id)
  }, [id])


  return (
    <div className="article-detail">
      <div className="article-image">
        <img src={article.photo} alt={article.nom} />
      </div>
      <div className="article-info">
        <h2 style={{textAlign: 'left'}}>{article.nom}</h2>
        <p>{article.description}</p>
        <p>Prix: {article.prix} €</p>
        <p>Quantité disponible: {article.quantite === 0 ? 'Indisponible' : article.quantite}</p>
        <p>Catégorie: {categorie.nom}</p>
        <button>Ajouter au panier</button>
      </div>
    </div>
  )
}

export default ArticleDetail
