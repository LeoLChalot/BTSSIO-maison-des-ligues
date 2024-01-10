import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import ButtonBurger from '../ButtonBurger/ButtonBurger'
import { isValidToken } from '../../utils/isValidToken'
import { isAdmin } from '../../utils/isAdmin'
import { decodeToken } from '../../utils/decodeToken'
import Cookies from 'js-cookie'

const Navbar = () => {
  const [isActive, setIsActive] = useState('hide')
  const [jwtToken, setJwtToken] = useState(Cookies.get('jwt_token'))
  const [isConnected, setIsConnected] = useState(false)
  const [role, setRole] = useState(isAdmin(jwtToken))
  const ls = localStorage
  const navigate = useNavigate()

  const deconnexion = () => {
    Cookies.remove('jwt_token')
    setJwtToken('')
    navigate('/')
  }

  useEffect(() => {
    if (!isValidToken(jwtToken)) {
      navigate('/connexion')
    }
    setIsConnected(true)
  }, [jwtToken])

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
        {!isConnected ? (
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
            <Link to={'/panier/' + ls.getItem('pseudo')} className="link">
              Panier
            </Link>
            <Link to="#" onClick={deconnexion} className="link">
              Déconnexion
            </Link>
          </>
        )}

        {role === true && (
          <Link to="/dashboard" className="link">
            Dashboard
          </Link>
        )}
      </div>
    </>
  )
}

export default Navbar
