import React from 'react'
import { Link } from 'react-router-dom'

const AsideMenu = () => {
  return (
    <aside>
      <Link to="/dashboard/general" className="link">
        Dashboard
      </Link>
      <Link to="/dashboard/articles" className="link">
        Magasin
      </Link>
      <Link to="/dashboard/users" className="link">
        Liste des utilisateurs
      </Link>
    </aside>
  )
}

export default AsideMenu
