'use client'
import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useAuth } from '../../hooks/useAuth'
import { Dropdown } from 'flowbite-react'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import { Navbar } from 'flowbite-react'

const Navbar = () => {
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
    // <nav id="navbar">
    //   <Link to="/" className="link">
    //     Accueil
    //   </Link>
    //   <Link to="/boutique" className="link">
    //     Boutique
    //   </Link>
    //   {isLoggedIn === true ? (
    //     <>
    //       <Link to={`/profil/${pseudo}`} className="link">
    //         Profil
    //       </Link>
    //       <Link to={`/panier/${pseudo}`} className="link">
    //         Panier
    //       </Link>

    //       {isAdmin && (
    //         <Dropdown label="Admin" dismissOnClick={true}>
    //           <Dropdown.Item as={Link} to='/dashboard/ajout'>Ajout Article</Dropdown.Item>
    //           <Dropdown.Item as={Link} to='/dashboard/stock'>Voir le stock</Dropdown.Item>
    //           <Dropdown.Item as={Link} to='/dashboard/edition'>Edition Article</Dropdown.Item>
    //           <Dropdown.Item as={Link} to='/dashboard/utilisateurs'>Pannel Utilisateurs</Dropdown.Item>
    //         </Dropdown>
    //       )}

    //       <Button onClick={handleLogout}>Déconnexion</Button>
    //     </>
    //   ) : (
    //     <>
    //       <Link to="/connexion" className="link">
    //         Connexion
    //       </Link>

    //       <Link to="/inscription" className="link">
    //         Inscription
    //       </Link>
    //     </>
    //   )}
    // </nav>
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          About
        </Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navbar
