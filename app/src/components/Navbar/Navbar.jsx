import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import ButtonBurger from '../ButtonBurger/ButtonBurger'

const Navbar = () => {
  const [isActive, setIsActive] = useState('hide')

  console.log(isActive)

  return (
    <>
      <ButtonBurger isActive={isActive} setIsActive={setIsActive} />
      <div id="navbar" className={isActive} onClick={(e) => setIsActive('hide')}>
        <Link to="/" className="link ">
          Accueil
        </Link>
        <Link to="/boutique" className="link">
          Boutique
        </Link>
        <Link to="/connexion" className="link">
          Connexion
        </Link>
        <Link to="/inscription" className="link">
          Inscription
        </Link>
        <Link to="/profil" className="link">
          Profil
        </Link>
      </div>
    </>
  )
}

export default Navbar
