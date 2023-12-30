import React, { useState } from 'react'
import axios from 'axios'
import { Signal, effect, computed } from '@preact/signals-react'

import './ArticleCard.css'
import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {
  const serverBaseUrl = 'http://localhost:3000'

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
        <p className="card-text">{description}...</p>
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
