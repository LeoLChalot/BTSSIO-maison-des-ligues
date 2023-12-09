import React from 'react'
import FormConnexion from '../components/FormConnexion/FormConnexion'
import Escalade from '/escalade.jpg'
import { Link } from 'react-router-dom'
import './page.css'

const Connexion = () => {  
  return (
    <section id="page-connexion" className="page">
      <div className="content">
        <div className="image-container image-connexion sm-none">
          <img src={Escalade} alt="Photo d'un grimpeur sur un pan de falaise" />
        </div>
        <div className="form-container">
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
