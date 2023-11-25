import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './page.css'
import ArticleCard from '../components/Articles/ArticleCard'
import { useParams } from 'react-router-dom'
import AsideMenu from '../components/MenuBoutique/Menu'

const Boutique = () => {
  const [articles, setArticles] = useState([])
  const [categorie, setCategorie] = useState('')
  console.log(categorie)

  const getArticles = async (categorie) => {
    const url = `http://localhost:3000/m2l/articles${categorie ? `?filtre=${categorie}` : ''}`
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.error('Error retrieving articles:', error)
      throw error
    }
  }

  const fetchData = async () => {
    try {
      const articles = await getArticles(categorie)
      setArticles(articles)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [categorie])

  return (
    <>
      <AsideMenu setCategorie={setCategorie} />
      <main id="page-boutique">
        {articles.map((article) => (
          <ArticleCard article={article} />
        ))}
      </main>
    </>
  )
}

export default Boutique
