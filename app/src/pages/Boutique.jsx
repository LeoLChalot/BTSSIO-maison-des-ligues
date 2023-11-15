import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ListeArticles from '../components/Article/ListeArticles'
import './page.css'

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
  const getArticlesByCategory = async (catetogy) => {
    let headersList = {
      Accept: '*/*',
    }
    let reqOptions = {
      url: `http://localhost:3000/boutique?filtre=${catetogy}`,
      method: 'GET',
      headers: headersList,
    }
    let response = await axios.request(reqOptions)
    console.table(response.data)
    setArticles(response.data)
  }

  useEffect(() => {
    getArticles()
    console.log(articles)
  }, [])

  return (
    <div class="page">
      <aside>
        <p>Ajouter un article</p>
        <p>Modifier un article</p>
        <p>Liste des utilisateurs</p>
      </aside>
      <main id="page-boutique">
        <header>
          <h1>Boutique de la maison des ligues</h1>
        </header>
        <section>
          <ListeArticles articles={articles}/>
        </section>
      </main>
    </div>
  )
}

export default Boutique
