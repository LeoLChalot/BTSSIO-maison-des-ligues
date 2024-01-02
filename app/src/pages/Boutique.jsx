import React, { lazy, useEffect, useState, Suspense } from 'react'
import { v4 } from 'uuid'

const ArticleCard = lazy(() => import('../components/Articles/ArticleCard'))
import MenuBoutique from '../components/MenuBoutique/MenuBoutique'
import LoaderArticle from '../components/Loader/LoaderArticle'
import Article from '../models/Article'

import './page.css'
import { useParams } from 'react-router-dom'

const Boutique = () => {
  const [articles, setArticles] = useState([])
  const [categorie, setCategorie] = useState(null)

  const validateUUIDv4 = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return regex.test(uuid)
  }

  const fetchArticles = async (id_categorie) => {
    if (id_categorie === null) {
      const result = await Article.getAllArticles()
      setArticles(result)
    } else if (validateUUIDv4(id_categorie)) {
      const result = await Article.getArticlesByCategoryId(id_categorie)
      setArticles(result)
    }
  }

  useEffect(() => {
    fetchArticles(categorie)
    console.log(categorie)
  }, [categorie])

  return (
    <>
      <MenuBoutique setCategorie={setCategorie} />
      <main id="page-boutique">
        {articles?.length ? (
          articles.map((article) => (
            <ArticleCard key={v4()} article={article} />
          ))
        ) : (
          <p>Aucun article</p>
        )}
      </main>
    </>
  )
}

export default Boutique
