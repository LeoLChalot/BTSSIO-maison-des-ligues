import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import axios from 'axios';

import MenuBoutique from '../components/MenuBoutique/MenuBoutique'

import './page.css'
import ArticleCardFlowbite from '../components/Articles/ArticleCardFlowbite'

const Boutique = () => {
  const [articles, setArticles] = useState([])
  const [categorie, setCategorie] = useState(null)

  const validateUUIDv4 = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return regex.test(uuid)
  }

  useEffect(() => {
    const fetchArticles = async (id_categorie) => {
      if (id_categorie == null) {
        const result = await axios.get(`http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/boutique/articles/all`);
        setArticles(result.data.infos)
      } else if (validateUUIDv4(id_categorie)) {
        const result = await axios.get(
          `http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/boutique/articles/categorie/id/${id_categorie}`
        )
        setArticles(result.data.infos)
      }
    }
    fetchArticles(categorie)
  }, [categorie])

  return (
    <>
      <MenuBoutique setCategorie={setCategorie} />
      <main>
      {articles?.length ? (
          articles.map((article) => (
            <ArticleCardFlowbite key={v4()} article={article} />
            // <ArticleCard key={v4()} article={article} />
          ))
        ) : (
          <p>Le magasin est vide !</p>
        )}
      </main>
    </>
  )
}

export default Boutique
