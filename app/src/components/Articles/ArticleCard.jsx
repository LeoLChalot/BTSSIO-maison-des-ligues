import React, { useState } from 'react'
import axios from 'axios'
import { Signal, effect, computed } from '@preact/signals-react'

import './ArticleCard.css'
import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {

  const description = article.description.slice(0, 20)

  const url = `/boutique/${article.id_article}`
  return (
    <div className="card">
      {/* <img
        src={article.photo}
        alt={article.nom}
        className="card-img-top"
      /> */}
      <div className="card-body">
        <h5 className="card-title">{article.nom}</h5>
        <p className="card-text">{
          description
        }...</p>
        <Link className='link-button' to={url} >Voir plus</Link>
      </div>
    </div>
    
  )
}

export default ArticleCard
