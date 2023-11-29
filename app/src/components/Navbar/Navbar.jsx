import React, { useState } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import ButtonBurger from '../ButtonBurger/ButtonBurger'

const Navbar = () => {
  const [isActive, setIsActive] = useState('hide')
  const ls = localStorage
  const navigate = useNavigate()

  const deconnexion = () => {
    ls.setItem('isAuth', '0')
    localStorage.clear()
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
        {ls.getItem('isAuth') != '1' && (
          <>
            <Link to="/connexion" className="link">
              Connexion
            </Link>
            <Link to="/inscription" className="link">
              Inscription
            </Link>
          </>
        )}

        {ls.getItem('isAdmin') == '1' && (
          <Link to="/dashboard" className="link">
            Dashboard
          </Link>
        )}
        {ls.getItem('isAuth') == '1' && (

          <>
            <Link to={'/profil/' + ls.getItem('pseudo')} className="link">
              Profil
            </Link>
            <Link to="#" onClick={deconnexion} className="link">
              Déconnexion
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default Navbar
