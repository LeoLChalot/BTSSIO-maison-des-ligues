import { useState, useEffect } from 'react'
import { v4 } from 'uuid'
import PropTypes from 'prop-types'
import './MenuBoutique.css'
import axios from 'axios'

const MenuBoutique = ({ setCategorie }) => {
  const [categories, setCategories] = useState([])

  const baseUrl = `${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}`


  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(`${baseUrl}/boutique/categories/all`)
      const listCategories = response.data.infos.categories
      setCategories(listCategories)
    }
    fetchCategories()
  }, [])

  return (
    <>
      <aside>
        <ul>
          <li onClick={() => setCategorie('')}>Tous les articles</li>
        </ul>
        <h3>Par catégories</h3>
        <ul>
          {categories?.length > 0 &&
            categories.map((category) => (
              <li
                key={v4()}
                onClick={() => setCategorie(category.id)}
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


MenuBoutique.propTypes = {
  setCategorie: PropTypes.func.isRequired
}
