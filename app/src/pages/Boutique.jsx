import React, { useEffect, useState } from 'react'

import './page.css'
import ArticleCard from '../components/Articles/ArticleCard'

import AsideMenu from '../components/MenuBoutique/Menu'
import { v4 } from 'uuid'

import Article from '../models/Article'

const Boutique = () => {
  const [articles, setArticles] = useState([])
  const [categorie, setCategorie] = useState(null)

  console.log(categorie)

  const validateUUIDv4 = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return regex.test(uuid)
  }
  const fetchArticles = async (id_categorie) => {
    if (id_categorie === null) {
      await Article.getAllArticles().then((listArticles) => {
        setArticles(listArticles)
      })
    } else if (validateUUIDv4(id_categorie)) {
      await Article.getArticlesByCategoryId(id_categorie).then(
        (listArticles) => {
          setArticles(listArticles)
        }
      )
    }
  }
  useEffect(() => {
    fetchArticles(categorie)
  }, [categorie])

  return (
    <>
      <AsideMenu setCategorie={setCategorie} />
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
