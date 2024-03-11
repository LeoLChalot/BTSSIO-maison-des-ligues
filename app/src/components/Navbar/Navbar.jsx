import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useAuth } from '../../hooks/useAuth'



const Navbar = () => {
  const { isLoggedIn, isAdmin, pseudo, updateState } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token');
    updateState(jwtToken);
    console.log('Context updated:', { isLoggedIn, isAdmin, pseudo });
  }, [pseudo]);

  const handleLogout = () => {
    // Supprime le cookie et déconnecte l'utilisateur
    Cookies.remove('jwt_token');
    updateState(null);
    // Redirige vers la page de connexion par exemple
    navigate('/connexion');
  };

  return (
    <nav id="navbar">
      <Link to="/" className="link">
        Accueil
      </Link>
      <Link to="/boutique" className="link">Boutique</Link>

      {isLoggedIn === true ? (
        <>
          <Link to={`/profil/${pseudo}`} className="link">
            Profil
          </Link>
          <Link to={`/panier/${pseudo}`} className="link">
            Panier
          </Link>

          {isAdmin && (
            <Link to="/dashboard" className="link">
              Admin
            </Link>
          )}

          <button onClick={handleLogout}>Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/connexion" className="link">
            Connexion
          </Link>

          <Link to="/inscription" className="link">
            Inscription
          </Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
