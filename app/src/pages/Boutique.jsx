import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './page.css'
import ArticleCard from '../components/Articles/ArticleCard'
import { useParams } from 'react-router-dom'
import AsideMenu from '../components/MenuBoutique/Menu'
import { v4 } from 'uuid'
import { stringify } from 'uuid'

const Boutique = () => {
  const [articles, setArticles] = useState([])
  const [categorie, setCategorie] = useState('')

  // const getArticles = async (categorie) => {
  //   let url = `http://localhost:3000/m2l/boutique/articles`

  //   if (categorie) {
  //     const params = new URLSearchParams()
  //     params.append('categorie', categorie)
  //     url += '?' + params.toString()
  //     const { data } = await axios.get(url, params)
  //     return data
  //   } else {
  //     const { data } = await axios.get(url)
  //     return data
  //   }
  // }

  // const fetchData = async () => {
  //   try {
  //     const articles = await getArticles(categorie)
  //     setArticles(articles)
  //   } catch (error) {
  //     console.error('Error fetching articles:', error)
  //   }
  // }

  // useEffect(async () => {
  //   await fetchData()
  // }, [categorie])


  return (
    <>
      <AsideMenu setCategorie={setCategorie} />
      <main id="page-boutique">
        {articles.map((article) => (
          <ArticleCard key={v4()} article={article} />
        ))}
      </main>
    </>
  )
}

export default Boutique
