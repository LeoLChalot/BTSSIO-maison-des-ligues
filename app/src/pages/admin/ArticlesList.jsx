import { useState, useEffect } from 'react'
import axios from 'axios'
import Article from '../../models/Article'
import './ArticlesList.css'

const ArticlesList = () => {
  const [modif, setModif] = useState(false)
  const [articles, setArticles] = useState([])

  const fetchArticles = async () => {
    const {data} = await Article.getAllArticles()
    console.log({ result: data })
    setArticles(data.infos)
  }
  const handleDeleteArticle = async (id_article) => {
    try {
      // Appeler une fonction pour supprimer l'article
      const { data } = await axios.delete(
        `http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/admin/articles/${id_article}`
      )
      setModif(true)
      alert(data.message)
      // Mettre à jour la liste des articles après suppression
      fetchArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }
  useEffect(() => {
    // Appeler une fonction pour récupérer la liste des articles
    fetchArticles()
    setModif(false)
  }, [modif])

  return (
    <div>
      <h2>Liste des articles</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Catégorie ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id_article}>
              <td>{article.id_article.slice(0, 15) + '...'}</td>
              <td>{article.nom}</td>
              <td>{article.description.slice(0, 30) + '...'}</td>
              <td>{article.prix} €</td>
              <td>{article.quantite}</td>
              <td>{article.categorie_id.slice(0, 15) + '...'}</td>
              <td>
                <button
                  onClick={() =>
                    handleDeleteArticle(`all-${article.id_article}`)
                  }
                >
                  Sup
                </button>
                <button onClick={() => handleDeleteArticle(article.id_article)}>
                  Editer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ArticlesList
