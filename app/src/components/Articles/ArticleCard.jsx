

import './ArticleCard.css'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const ArticleCard = ({ article }) => {
  const serverBaseUrl = `http://${JSON.stringify(import.meta.env.VITE_API_URL)}`

  const description = article.description
  const photoPath = article.photo
  const photoUrl = `${serverBaseUrl}/${photoPath.replace(/\\/g, '/')}`

  return (
    <div className="card">
      <div className="card-image">
        <img src={photoUrl} alt={article.nom} className="card-img-top" />
      </div>
      <div className="card-body">
        <h5 className="card-title">{article.nom}</h5>
        <p className="card-text">{description.slice(0, 100)}...</p>
        <div className="card-info">
          <p className="price">{article.prix} €</p>
          <Link className="link-button" to={`/article/${article.id_article}`}>
            Détail
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard

ArticleCard.propTypes = {
  article: PropTypes.shape({
    description: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    prix: PropTypes.number.isRequired,
    id_article: PropTypes.number.isRequired
  }).isRequired,
};