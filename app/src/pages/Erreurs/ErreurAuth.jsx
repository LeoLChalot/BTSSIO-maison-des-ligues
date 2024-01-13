import React from 'react'

const ErreurAuth = () => {
  return (
    <div id="error">
      <div className="message">
        <h1>Accès refusé</h1>
        <p style={{ textAlign: 'center' }}>
          Êtes vous vraiment celui que vous prétendez être... ?
        </p>
      </div>
    </div>
  )
}

export default ErreurAuth
