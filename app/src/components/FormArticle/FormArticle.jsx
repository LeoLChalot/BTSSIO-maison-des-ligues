import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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

  const uploadPhoto = async (photo) => {
    try {
      const formData = new FormData()
      formData.append('photo', photo)

      const response = await axios
        .post('http://localhost:3000/m2l/uploadFile', formData, {
          headers: {
            'Content-Type': 'Multipart/form-data',
          },
        })
        .then((res) => console.log(res))
        .catch((err) => console.error(err))

      const fileName = await response.data.fileName
      return fileName
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fileName = await uploadPhoto(photo)
    console.log(fileName)
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
        <button>Envoyer</button>
      </div>
    </form>
  )
}

export default FormArticle
