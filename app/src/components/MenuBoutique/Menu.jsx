import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './Menu.css'

const AsideMenu = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/m2l/categories')
        setCategories(response.data)
        console.log(categories)
      } catch (error) {
        console.error('Error retrieving categories:', error)
        throw error
      }
    }

    fetchCategories()
  }, [])
  return (
    <aside>
      <ul>
        <li>
          <Link to="/boutique">Afficher tous les articles</Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/boutique/${category.id}`}>
              Afficher les articles de la catégorie {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default AsideMenu
