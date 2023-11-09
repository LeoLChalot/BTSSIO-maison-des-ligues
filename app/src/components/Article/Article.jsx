import React from 'react'
import './Article.css'

const Produit = ({ nom, photo, description, prix, quantite }) => {
  return (
    <>
      <div className="produit">
        <p>Nom : {nom}</p>
        <p>Path photo : {photo}</p>
        <p>Description : {description}</p>
        <p>Prix : {prix}</p>
        <p>Quantité : {quantite}</p>
      </div>

      <div class="card">
        <div class="card-image"></div>
        <div class="card-title">
          <h2>Headphone</h2>
        </div>
        <div class="card-detail">
          <h3>
            in | <span class="date">Eletronics</span>
          </h3>
        </div>
        <div class="card-text">
          <p>
            Lorem ipsum dolor sit amet consectetur, Ducimus, repudiandae
            temporibus omnis illum maxime quod deserunt eligendi dolor
          </p>
        </div>

        <div class="card-product-price">
          <p>
            $<span>3500</span>
          </p>
          <button type="button">Buy Now</button>
        </div>
      </div>
    </>
  )
}

export default Produit
