import React from 'react'

const ErreurNonAdmin = () => {
  return (
    <div id="error">
      <div className="message">
        <h1>Accès refusé</h1>
        <p>
          Vous n'avez pas les autorisations nécessaires pour accéder à cette
          page.
        </p>
      </div>
    </div>
  )
}

export default ErreurNonAdmin
