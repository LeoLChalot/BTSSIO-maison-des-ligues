import React, { useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import Oeil from '/oeil.svg'
import OeilFerme from '/oeil_ferme.svg'
import './FormConnexion.css'

const FormConnexion = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassord, setShowPassword] = useState(false)

  const showPassordToggle = () => {
    showPassord == false ? setShowPassword(true) : setShowPassword(false)
  }

  async function handleFormData(e) {
    e.preventDefault()

    let login = e.target['login'].value
    let mot_de_passe = e.target['mot_de_passe'].value

    try {
      axios
        .get(`http://localhost:3000/connexion/${login}`)
        .then(async (res) => {
          let userData = await res.data
          console.log(userData)

          let hash = userData.mot_de_passe
          if (bcrypt.compare(mot_de_passe, hash)) {
            const ls = localStorage
            ls.setItem('pseudo', userData.pseudo)
            ls.setItem('email', userData.email)

            let user = {
              pseudo: ls.getItem('pseudo'),
              email: ls.getItem('email'),
            }

            console.table(user)
          }
        })
    } catch (err) {
      throw err
    }
  }

  return (
    <div className="form">
      <form id="formulaire-inscription" onSubmit={(e) => handleFormData(e)}>
        <div className="input-group">
          <input
            type="text"
            name="login"
            value={login}
            placeholder="Pseudo ou mail"
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type={showPassord == false ? 'password' : 'text'}
            name="mot_de_passe"
            value={password}
            placeholder="Mot de passe"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          {showPassord == false ? (
            <img
              src={OeilFerme}
              className="show-password"
              alt="Voir le mot de passe"
              onClick={showPassordToggle}
            />
          ) : (
            <img
              src={Oeil}
              className="show-password"
              alt="Cacher le mot de passe"
              onClick={showPassordToggle}
            />
          )}
        </div>
        {login != '' && password != '' ? (
          <input type="submit" value="connexion" />
        ) : null}
      </form>
    </div>
  )
}

export default FormConnexion
