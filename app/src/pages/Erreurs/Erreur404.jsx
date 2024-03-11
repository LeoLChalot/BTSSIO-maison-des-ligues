import React from 'react'
import { Link } from 'react-router-dom'

const Erreur404 = () => {
  return (
    <div id="error">
      <div className="message">
        <h1>Oops ! Il semblerait que la page soit introuvable !! </h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </div>
  )
}

export default Erreur404
