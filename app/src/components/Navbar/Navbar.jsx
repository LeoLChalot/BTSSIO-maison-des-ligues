import React, { useState } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import ButtonBurger from '../ButtonBurger/ButtonBurger'

const Navbar = () => {
  const [isActive, setIsActive] = useState('hide')
  const ls = localStorage
  const navigate = useNavigate()

  const deconnexion = () => {
    localStorage.clear()
    navigate('/')
  }

  window.onunload = function () {
    deconnexion()
  }

  return (
    <>
      <ButtonBurger isActive={isActive} setIsActive={setIsActive} />
      <div
        id="navbar"
        className={isActive}
        onClick={(e) => setIsActive('hide')}
      >
        <Link to="/" className="link ">
          Accueil
        </Link>
        <Link to="/boutique" className="link">
          Boutique
        </Link>
        {ls.getItem('isAuth') != '1' ? (
          <>
            <Link to="/connexion" className="link">
              Connexion
            </Link>
            <Link to="/inscription" className="link">
              Inscription
            </Link>
          </>
        ) : (
          <>
            <Link to={'/profil/' + ls.getItem('pseudo')} className="link">
              Profil
            </Link>
            <Link to={'/panier'} className="link">
              Panier
            </Link>
            <Link to="#" onClick={deconnexion} className="link">
              Déconnexion
            </Link>
          </>
        )}

        {ls.getItem('isAdmin') == 'admin' && (
          <Link to="/dashboard" className="link">
            Dashboard
          </Link>
        )}
      </div>
    </>
  )
}

export default Navbar
