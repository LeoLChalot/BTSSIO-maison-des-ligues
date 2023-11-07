import React from 'react'
import FormInscription from '../components/FormInscription/FormInscription'
import Surf from '/surf.jpg'
import { Link } from 'react-router-dom'

const Inscription = () => {
  return (
    <section id="page-inscription">
      <div className="content">
        <div className="image-container image-connexion sm-none">
          <img src={Surf} alt="Photo d'un grimpeur sur un pan de falaise" />
        </div>
        <div className="form-container">
          <h1>Inscription</h1>
          <FormInscription />
          <p>
            <small>
              Déjà inscrit ?{' '}
              <Link to="/connexion" className="link">
                Connectez-vous
              </Link>
            </small>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Inscription
