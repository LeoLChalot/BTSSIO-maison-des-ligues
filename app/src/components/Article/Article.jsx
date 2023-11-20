import React from 'react'
import './Article.css'

const Produit = ({ nom, photo, description, prix, quantite }) => {
  return (
    <>
      <div class="card">
        <div class="card-image"></div>
        <div class="card-title">
          <h2>{nom}</h2>
        </div>
        <div class="card-detail">
          <h3>
            in | <span class="date">Eletronics</span>
          </h3>
        </div>
        <div class="card-text">
          <p>
          {description}
          </p>
        </div>

        <div class="card-product-price">
          <p>
            €<span>{prix}</span>
          </p>
          <button type="button">Buy Now</button>
        </div>
      </div>
    </>
  )
}

export default Produit
