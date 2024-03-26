// Importez useState et useEffect
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Categorie from '../../models/Categorie'
import { decodeToken } from '../../utils/decodeToken'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './ArticleDetail.css'
import RatingDetail from '../Rating/RatingDetail'
import { Button, TextInput } from 'flowbite-react'

const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState({})
  const [quantite, setQuantite] = useState(1)
  const [photo, setPhoto] = useState(null)
  const [categorie, setCategorie] = useState('')
  const serverBaseUrl = `http://` + JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')
  const [jwtToken, setJwtToken] = useState('')
  const [addedArticle, setAddedArticle] = useState(false)
  const navigate = useNavigate()

  

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (Cookies.get('jwt_token') === undefined) {
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
      setJwtToken(Cookies.get('jwt_token'))
      const decoded_token = decodeToken(jwtToken)
      const pseudo = decoded_token.pseudo
      const panier = decoded_token.panier
      console.log({ panier: decoded_token.panier })
      console.log({
        panier: panier,
        article: article.id_article,
        quantite: quantite,
      })
      const headers = {
        'Content-Type': 'application/json',
      }
      const body = {
        id_panier: panier,
        id_article: article.id_article,
        quantite: quantite,
      }
      const config = {
        headers,
        withCredentials: true,
      }
      const res = await axios.post(
        `${serverBaseUrl}/m2l/panier/${pseudo}`,
        body,
        config
      )

      console.log(res)
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
        const { data } = await axios.get(
          `${serverBaseUrl}/m2l/boutique/articles?id_article=${id}`
        )
        const photoPath = data.infos[0].photo
        const photoUrl = `${serverBaseUrl}/${photoPath.replace(/\\/g, '/')}`
        setPhoto(photoUrl)
        const selectedCategorie = await Categorie.getCategoryById(
          data.infos[0].categorie_id
        )
        setCategorie(selectedCategorie)
        setArticle(data.infos[0])
      } catch (error) {
        console.error('Error fetching article:', error)
      }
    }
    setAddedArticle(false)
    fetchArticle(id)
    setJwtToken(Cookies.get('jwt_token'))
  }, [addedArticle, id, serverBaseUrl])

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
