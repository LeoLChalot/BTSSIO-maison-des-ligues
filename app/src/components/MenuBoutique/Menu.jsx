import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './Menu.css'

const AsideMenu = ({setCategorie }) => {
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/m2l/boutique/categories')
      setCategories(response.data)
      console.log(categories)
    } catch (error) {
      console.error('Error retrieving categories:', error)
      throw error
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <aside>
      <ul>
        <li onClick={() => setCategorie('')}>Tous les articles</li>
      </ul>
      <h3>Par disciplines</h3>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => setCategorie(category.id_categorie)}
          >
            {category.nom}
          </li>
        ))}
      </ul>
      <h3>Par catégories</h3>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => setCategorie(category.id_categorie)}
          >
            {category.nom}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default AsideMenu
