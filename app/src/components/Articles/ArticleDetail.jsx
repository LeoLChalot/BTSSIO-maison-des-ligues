import { useEffect, useState } from 'react'
import { Button, TextInput } from 'flowbite-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RatingDetail from '../Rating/RatingDetail';
import axios from 'axios'
import { decodeToken } from '../../utils/decodeToken'
import Cookies from 'js-cookie'
import './ArticleDetail.css'
import { useAuth } from '../../hooks/useAuth';

const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState({})
  const [quantite, setQuantite] = useState(1)
  const [photo, setPhoto] = useState(null)
  const [categorie, setCategorie] = useState('')
  const baseUrl = `${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}`
  const [jwtToken, setJwtToken] = useState('')
  const [addedArticle, setAddedArticle] = useState(false)
  const navigate = useNavigate()
	const { token } = useAuth();

  

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (jwtToken  === undefined) {
      alert('Veuillez vous connecter pour ajouter un article au panier')
      navigate('/connexion')
      return
    }

    if (quantite > article.quantite || quantite < 1 || quantite === null) {
      toast.error('Quantité invalide')
      setQuantite(1)
      return
    }

    try {
      const decoded_token = decodeToken(jwtToken)
      const panier_id = decoded_token.panier
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      }
      const body = {
        id_article: article.id,
        quantite: quantite,
      }
      const config = {
        headers,
        withCredentials: true,
      }
      const res = await axios.post(
        `${baseUrl}/panier/add/${panier_id}`,
        body,
        config
      )
      if (res.status === 200) {
        quantite === 1
          ? toast.info('Article ajouté au panier')
          : toast.info('Articles ajoutés au panier')
        setAddedArticle(!addedArticle)
      } else if (res.status === 400) {
        toast.warning('Article en rupture !')
      }
    } catch (error) {
      console.error('Error adding article to cart:', error)
    }
  }

  useEffect(() => {
    const fetchArticle = async (id) => {
      try {
        const response = await axios.get(
          `${baseUrl}/boutique/article/id/${id}`
        )

        const article = response.data.infos.article

        console.log(article)

        const photoUrl = `${baseUrl.replace("/m2l", "")}/${article.image.replace(/\\/g, '/')}`
        setPhoto(photoUrl)
        setCategorie(article.categorie.nom)
        setArticle(article)
      } catch (error) {
        console.error('Error fetching article:', error)
        navigate('/404')
      }
    }
    setAddedArticle(false)
    fetchArticle(id)
    setJwtToken(Cookies.get('token'))
  }, [baseUrl, id, navigate])

  return (
    <>
      <div className="flex justify-center gap-10">
        <div className="basis-1/3 shadow-md">
          <img className="rounded-lg" src={photo} alt={article.nom} />
          <div className="article-price">
            <span>{article.prix} €</span>
          </div>
        </div>
        <div className="basis-1/3 flex flex-col">
          <p>{categorie}</p>
          <h2 className='text-5xl text-left'>{article.nom}</h2>
          <p>{article.description}</p>

          <p style={{ fontWeight: 'bold' }}>
            <>
              {article.quantite === 0 ? (
                <span style={{ color: 'red' }}>En rupture</span>
              ) : article.quantite === 1 ? (
                <span style={{ color: 'maroon' }}>
                  Plus qu&apos;un exemplaire en stock !
                </span>
              ) : (
                <span style={{ color: 'green' }}>
                  En stock {article.quantite}
                </span>
              )}
            </>
          </p>

          {article.quantite > 0 ? (
            <>
              <form
                id="formulaire-ajout-panier"
                onSubmit={(e) => handleSubmit(e)}
                className='my-6 form inline-flex flex-row'
              >
                <TextInput
                  type="number"
                  name="quantite"
                  id="quantite"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  min="1"
                  step="1"
                />
                <Button type="submit">Ajouter au panier</Button>
              </form>
              <RatingDetail />
            </>
          ) : null}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default ArticleDetail
