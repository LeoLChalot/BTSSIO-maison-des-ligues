import React from 'react'
import './Article.css'

const Produit = ({ nom, photo, description, prix, quantite }) => {
  return (
    <div className="produit">
      <p>Nom : {nom}</p>
      <p>Path poto : {photo}</p>
      <p>Description : {description}</p>
      <p>Prix : {prix}</p>
      <p>Quantité : {quantite}</p>
    </div>
  )
}

export default Produit
