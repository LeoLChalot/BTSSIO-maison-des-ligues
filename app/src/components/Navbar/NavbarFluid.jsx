// import Link from 'react/link'
import { Button, Navbar } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import './Navbar.css'

import { Dropdown } from 'flowbite-react'
function Nav() {
  const { isLoggedIn, isAdmin, pseudo, updateState } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token')
    updateState(jwtToken)
    console.log('Context updated:', { isLoggedIn, isAdmin, pseudo })
  }, [pseudo])

  const handleLogout = () => {
    // Supprime le cookie et déconnecte l'utilisateur
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
      <Navbar.Collapse className='link-container'>
        <Navbar.Link as={Link} to="/" className="link" active>
          Accueil
        </Navbar.Link>
        <Navbar.Link as={Link} to="/boutique" className="link">
          Boutique
        </Navbar.Link>
        {isLoggedIn === true ? (
          <>
            <Navbar.Link as={Link} to={`/profil/${pseudo}`} className="link">
              Profil
            </Navbar.Link>

            <Navbar.Link as={Link} to={`/panier/${pseudo}`} className="link">
              Panier
            </Navbar.Link>

            {isAdmin && (
              <>
                <Dropdown
                  label="Admin"
                  dismissOnClick={true}
                  className="dropdown"
                >
                  <Dropdown.Item>
                    <Navbar.Link as={Link} to="/dashboard" className="btn-link">
                      Admin
                    </Navbar.Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Navbar.Link as={Link} to="/stock" className="btn-link">
                      Stock
                    </Navbar.Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Navbar.Link as={Link} to="/utilisateurs" className="btn-link">
                      Utilisateurs
                    </Navbar.Link>
                  </Dropdown.Item>
                </Dropdown>
              </>
            )}

            <Button onClick={handleLogout}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Navbar.Link as={Link} to="/connexion" className="link">
              Connexion
            </Navbar.Link>

            <Navbar.Link as={Link} to="/inscription" className="link">
              Inscription
            </Navbar.Link>

          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Nav
