import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './FormArticle.css'
const FormArticle = () => {
  const [nom, setNom] = useState('')
  const [photo, setPhoto] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState(0)
  const [quantite, setQuantite] = useState(0)
  const [categorie, setCategorie] = useState('')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nom || !description || !prix || !quantite || !categorie) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    console.log(nom)
    const formData = new FormData()
    formData.append('nom', nom)
    formData.append('photo', photo)
    formData.append('description', description)
    formData.append('prix', prix)
    formData.append('quantite', quantite)
    formData.append('categorie', categorie)

    console.log(formData.get('nom'))

    

    try {
      const config = {
        headers: { 'content-type': 'multipart/form-data' },
      }
      const response = await axios.post(
        'http://localhost:3000/m2l/article',
        formData,
        config
      )
      console.log(response.data)
      // Handle response here
    } catch (error) {
      console.error('Error sending article data:', error)
      // Handle error here
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/m2l/categories')
        setCategories(data)
      } catch (error) {
        console.error('Error retrieving categories:', error)
        throw error
      }
    }
    fetchCategories()
  }, [])

  return (
    <form
      className="form"
      onSubmit={(e) => handleSubmit(e)}
      encType="multipart/form-data"
    >
      <div className="input-group">
        <label htmlFor="nom">Nom:</label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
      </div>
      <hr />
      <div className="input-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <hr />
      <div className="input-group">
        <label htmlFor="prix">Prix:</label>
        <input
          type="number"
          id="prix"
          value={prix}
          onChange={(e) => setPrix(parseFloat(e.target.value))}
        />
      </div>
      <hr />
      <div className="input-group">
        <label htmlFor="quantite">Quantité:</label>
        <input
          type="number"
          id="quantite"
          value={quantite}
          onChange={(e) => setQuantite(parseInt(e.target.value))}
        />
      </div>
      <hr />
      <div className="input-group">
        <label htmlFor="photo">Photo:</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>
      <hr />
      <div className="input-group">
        <label htmlFor="categories">Categorie:</label>
        <select
          id="categories"
          value={categorie}
          onChange={(e) => {
            setCategorie(e.target.value)
            console.log(categorie)
          }}
        >
          <option value="">-- Choisir --</option>
          {/* Render categories from the database */}
          {categories.map((category) => (
            <option key={category.id_categorie} value={category.id_categorie}>
              {category.nom}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="input-group">
        <input type="submit" />
      </div>
    </form>
  )
}

export default FormArticle
