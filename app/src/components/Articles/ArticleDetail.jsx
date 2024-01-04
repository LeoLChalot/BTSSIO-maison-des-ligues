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
  const [categorie, setCategorie] = useState({})
  const navigate = useNavigate()
  const serverBaseUrl = 'http://localhost:3000'

const fetchArticle = async (id) => {
  try {
    const { data } = await axios.get(`${serverBaseUrl}/m2l/boutique/article?idart=${id}`);
    const photoPath = data.photo;
    const photoUrl = `${serverBaseUrl}/${photoPath.replace(/\\/g, '/')}`;
    const selectedCategorie = await Categorie.getCategoryById(data.categorie_id);
    setCategorie(selectedCategorie);
    const selectedArticle = new Article(data.id_article, data.nom, data.description, photoUrl, data.prix, data.quantite, data.categorie_id);
    setArticle(selectedArticle);
  } catch (error) {
    console.error('Error fetching article:', error);
  }
};

const ajouterAuPanier = async (id_article) => {
  // Check if the user is logged in
  if (!localStorage.getItem('oauth_token')) {
    alert('Veuillez vous connecter pour ajouter un article au panier');
    navigate('/connexion');
    return;
  }
  try {
    // Make an API call to add the article to the cart
    await axios.post('http://localhost:3000/m2l/panier/add', {
      articleId: id_article,
      userId: localStorage.getItem('id_utilisateur'),
    });

    alert('Article ajouté au panier');
    navigate('/boutique');
  } catch (error) {
    console.error('Error adding article to cart:', error);
  }
}

  useEffect(() => {
    fetchArticle(id)
  }, [id])

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
        <p>Catégorie: {categorie.nom}</p>
        <button onClick={() => ajouterAuPanier(article.id)}>Ajouter au panier</button>
      </div>
    </div>
  )
}

export default ArticleDetail
