import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './page.css'
import { isValidToken } from '../utils/isValidToken'
import Cookies from 'js-cookie';
import { useAuth } from '../hooks/useAuth';

const Profil = () => {
  const {isLoggedIn, isAdmin, pseudo, updateState} = useAuth()
  const navigate = useNavigate()
  const [jwtToken, setJwtToken] = useState(Cookies.get('jwt_token'))
  const ls = localStorage


    

  useEffect(() => {
    if(!isValidToken(jwtToken)) {
      navigate('/connexion')
    }
  }, [jwtToken])

  return (
    <section id="page-profil" className="page">
      <div id="profil-header">
        <h1>Salut {pseudo} !</h1>
        <h3>Content de vous voir !</h3>
      </div>
    </section>
  )
}

export default Profil
