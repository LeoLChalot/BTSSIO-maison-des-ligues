import React from 'react'
import FormConnexion from '../components/FormConnexion/FormConnexion'
import Escalade from '/escalade.jpg'
import { Link } from 'react-router-dom'

const Connexion = () => {
  return (
    <section id="page-connexion">
      <div className="content">
        <div className="image-container image-connexion sm-none">
          <img src={Escalade} alt="Photo d'un grimpeur sur un pan de falaise" />
        </div>
        <div className="form-container">
          <h1>Connexion</h1>
          <FormConnexion />
          <p>
            <small>
              Pas encore inscrit ?{' '}
              <Link to="/inscription" className="link">
                Inscrivez-vous
              </Link>
            </small>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Connexion
