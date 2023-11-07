import React from 'react'
import Article from './Article'

const ListeArticles = ({ articles }) => {
  return (
    <div className="container">
      {articles.map((article) => (
        <Article
          nom={article.nom}
          photo={article.photo}
          description={article.description}
          prix={article.prix}
          quantite={article.quantite}
        />
      ))}
    </div>
  )
}

export default ListeArticles
