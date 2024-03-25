import { useState, useEffect } from 'react'
import axios from 'axios'
import Article from '../../models/Article'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

function ArticlesListFlowbite() {
  const [modif, setModif] = useState(false)
  const [articles, setArticles] = useState([])
  const serverBaseUrl = 'http://localhost:3000/'
  const [rerender, setRerender] = useState(false)


  const fetchArticles = async () => {
    const { data } = await Article.getAllArticles()
    console.log({ result: data })
    setArticles(data.infos)
    console.table(data.infos)
    setRerender((rerender) => !rerender)
  }
  const handleDeleteArticle = async (id_article) => {
    try {
      // Appeler une fonction pour supprimer l'article
      const { data } = await axios.delete(
        `http://localhost:3000/m2l/admin/articles/${id_article}`
      )
      setModif(true)
      alert(data.message)
      // Mettre à jour la liste des articles après suppression
      fetchArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }


  useEffect(() => {
    // Appeler une fonction pour récupérer la liste des articles
    fetchArticles()
  }, [])
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

            <Table.Row key={article.id_article} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell><img src={serverBaseUrl + (article.photo).replace(/\\/g, '/')} alt={article.nom} width={80} /></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {article.nom}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{article.prix} €</Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{article.quantite}</Table.Cell>
              {/* <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{article.categorie_id}</Table.Cell> */}
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Link
                  to={"/edit/" + article.id_article}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
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