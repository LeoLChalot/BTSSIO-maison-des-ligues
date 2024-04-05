import { useState, useEffect } from 'react'
import axios from 'axios'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

function ArticlesListFlowbite() {
  const [articles, setArticles] = useState([])
  const serverBaseUrl = 'http://' + JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '') + '/'

  const handleDeleteArticle = async (id) => {
    try {
      // Appeler une fonction pour supprimer l'article
      const response = await axios.delete(
        `http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/admin/article/${id}`
      )
      alert("Référence supprimée !")
      setArticles((articles) => articles.filter((article) => article.id !== id))
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }


  useEffect(() => {
    const fetchArticles = async () => {
      const result = await axios.get(`http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/boutique/articles/all`);
      setArticles(result.data.infos)
    }
    // Appeler une fonction pour récupérer la liste des articles
    fetchArticles()
  }, [articles.length])

  return (
    <div className="fluid">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Img</Table.HeadCell>
          <Table.HeadCell>Label</Table.HeadCell>
          <Table.HeadCell>Prix</Table.HeadCell>
          <Table.HeadCell>Quantité</Table.HeadCell>
          {/* <Table.HeadCell>Catégorie ID</Table.HeadCell> */}
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          
          {articles.map((article) => (
            <Table.Row key={article.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">

              {console.log((serverBaseUrl + article.image).replace(/\\/g, '/'))}
              <Table.Cell><img src={(serverBaseUrl + article.image).replace(/\\/g, '/')} alt={article.nom} width={80} /></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {article.nom}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{article.prix} €</Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{article.quantite}</Table.Cell>
              {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{article.categorie_id}</Table.Cell> */}
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Link
                  to={"/edit/" + article.id}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </Link>
                <Link
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 p-4"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  Delete
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ArticlesListFlowbite
