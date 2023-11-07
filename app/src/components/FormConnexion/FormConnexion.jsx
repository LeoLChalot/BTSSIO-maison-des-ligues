import React, { useState } from 'react'
import Oeil from '/oeil.svg'
import OeilFerme from '/oeil_ferme.svg'
import './FormConnexion.css'

const FormConnexion = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const [submitButton, setSubmitButton] = useState(false)

  const [showPassord, setShowPassword] = useState(false)

  const showPassordToggle = () => {
    showPassord == false ? setShowPassword(true) : setShowPassword(false)
  }

  return (
    <div className="form">
      <form id="formulaire-inscription">
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
            name="password"
            value={password}
            placeholder="Mot de passe"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          {
            showPassord == false ? <img
            src={OeilFerme}
            className="show-password"
            alt="Voir le mot de passe"
            onClick={showPassordToggle}
          /> : <img
          src={Oeil}
          className="show-password"
          alt="Cacher le mot de passe"
          onClick={showPassordToggle}
        />
          }
        </div>
        {(login != '' && password != '') ? <input type="submit" value="connexion" /> : null}
      </form>
    </div>
  )
}

export default FormConnexion
