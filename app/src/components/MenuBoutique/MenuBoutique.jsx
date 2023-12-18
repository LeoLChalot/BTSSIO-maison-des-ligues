import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 } from 'uuid'
import Categorie from '../../models/Categorie'
import './MenuBoutique.css'

const MenuBoutique = ({ setCategorie }) => {
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    await Categorie.getAllCategories().then((listCategories) => {
      setCategories(listCategories)
    })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <>
      <aside>
        <ul>
          <li onClick={() => setCategorie(null)}>Tous les articles</li>
        </ul>
        <h3>Par catégories</h3>
        <ul>
          {categories?.length > 0 &&
            categories.map((category) => (
              <li
                key={v4()}
                onClick={() => setCategorie(category.id_categorie)}
              >
                {category.nom}
              </li>
            ))}
        </ul>
      </aside>
    </>
  )
}

export default MenuBoutique
