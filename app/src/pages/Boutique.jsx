import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './page.css'
import ArticleCard from '../components/Articles/ArticleCard'
import { useParams } from 'react-router-dom'
import AsideMenu from '../components/MenuBoutique/Menu'

const Boutique = () => {
  const [articles, setArticles] = useState([])

  /**
   * Retrieves articles from the server and sets them in the component state.
   *
   * @return {Promise<void>} - A promise that resolves when the articles are retrieved and set in the state.
   */
  const getArticles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/m2l/articles')
      setArticles(response.data)
    } catch (error) {
      console.error('Error retrieving articles:', error)
      throw error
    }
  }

  /**
   * Retrieves articles based on a given category.
   *
   * @param {string} category - The category of articles to retrieve.
   * @return {Promise<void>} - A promise that resolves when the articles are retrieved successfully.
   */
  const getArticlesByCategory = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/m2l/articles?id=${category}`
      )
      setArticles(response.data)
    } catch (error) {
      console.error('Error retrieving articles:', error)
      throw error
    }
  }

  useEffect(() => {
    /**
     * Fetches data by calling the getArticles function and logs the articles to the console.
     * If an error occurs, it logs the error message to the console.
     */
    const fetchData = async () => {
      try {
        await getArticles()
        console.log(articles)
      } catch (error) {
        console.error('Error fetching articles:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <AsideMenu />
      <main id="page-boutique">
        {articles.map((article) => (
          <ArticleCard article={article} />
        ))}
      </main>
    </>
  )
}

export default Boutique
