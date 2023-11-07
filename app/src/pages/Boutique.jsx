import React, { useEffect, useState } from 'react'
import axios from 'axios'


import ListeArticles from '../components/Article/ListeArticles'

const Boutique = () => {
  const [articles, setArticles] = useState([])

  const getArticles = async () => {
    let headersList = {
      Accept: '*/*',
    }

    let reqOptions = {
      url: 'http://localhost:3000/boutique',
      method: 'GET',
      headers: headersList,
    }

    let response = await axios.request(reqOptions)
    console.log(response.data)
    setArticles(response.data)
  }
  const getArticlesByCategory = async () => {
    let headersList = {
      Accept: '*/*',
    }
    let reqOptions = {
      url: 'http://localhost:3000/boutique?filtre=pantalons',
      method: 'GET',
      headers: headersList,
    }
    let response = await axios.request(reqOptions)
    console.table(response.data)
    setArticles(response.data)
  }

  useEffect(() => {
    getArticles()
  }, [])

  return (
    <section id="page-boutique" className="page">
      <ListeArticles articles={articles}/>
    </section>
  )
}

export default Boutique
