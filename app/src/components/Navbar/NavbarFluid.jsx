// import Link from 'react/link'
import { Navbar } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios';
import './Navbar.css'

function Nav() {
  const { isLoggedIn, isAdmin, pseudo, updateState, panier } = useAuth()
  const navigate = useNavigate()
  const baseUrl = `${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}`

  useEffect(() => {
    const jwtToken = Cookies.get('token')
    updateState(jwtToken)
    console.log('Context updated:', { isLoggedIn, isAdmin, pseudo })
  }, [pseudo])

  const handleLogout = async () => {
    // Supprime le cookie et déconnecte l'utilisateur
    await axios.delete(`${baseUrl}/panier/delete_all/${panier}`)
    await axios.delete(`${baseUrl}/panier/delete/${panier}`)
    Cookies.remove('jwt_token')
    updateState(null)
    // Redirige vers la page de connexion par exemple
    navigate('/connexion')
  }
  return (
    <Navbar fluid rounded id="nav-fluid container ">
      <Navbar.Brand as={Link} to="/">
        <img src={window.location.origin + '/Logo_M2L.png'} width={100} />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Maison des Ligues
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className=' flex align-center justify-center'>
        <>

          {(!isLoggedIn) && (
            <>
              <Navbar.Link as={Link} to="/boutique" className="link">
                Boutique
              </Navbar.Link>
              <Navbar.Link as={Link} to="/connexion" className="link">
                Connexion
              </Navbar.Link>
              <Navbar.Link as={Link} to="/inscription" className="link">
                Inscription
              </Navbar.Link>
            </>
          )}

          {(isLoggedIn && !isAdmin) && (
            <>
              <Navbar.Link as={Link} to="/boutique" className="link">
                Boutique
              </Navbar.Link>
              <Navbar.Link as={Link} to={`/profil/${pseudo}`} className="link">
                Profil
              </Navbar.Link>
              <Navbar.Link as={Link} to={`/panier/${pseudo}`} className="link">
                Panier
              </Navbar.Link>
              <Navbar.Link as={Link} to="/" className="link" onClick={handleLogout}>Déconnexion</Navbar.Link>
            </>
          )}

          {(isLoggedIn && isAdmin) && (
            <>
              <Navbar.Link as={Link} to="/" className="link" onClick={handleLogout}>Déconnexion</Navbar.Link>
            </>
          )}
        </>
      </Navbar.Collapse>
    </Navbar >
  )
}

export default Nav
