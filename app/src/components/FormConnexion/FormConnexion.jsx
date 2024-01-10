import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { isValidToken } from '../../utils/isValidToken'
import Oeil from '/oeil.svg'
import OeilFerme from '/oeil_ferme.svg'
import './FormConnexion.css'
import { useNavigate } from 'react-router-dom'

const FormConnexion = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassord, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const showPassordToggle = () => {
    showPassord == false ? setShowPassword(true) : setShowPassword(false)
  }

  const handleFormData = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`http://localhost:3000/m2l/user/connexion`, {
        login: login,
        mot_de_passe: password,
      })
      if (res.status == 200) {
        localStorage.clear()
        console.log(res.data.infos)

        // Initialize a cookie with the retrieved token
        Cookies.set('jwt_token', res.data.infos.jwt_token)
        let token = Cookies.get('jwt_token')
        console.log(isValidToken(token))
      }

      navigate(`/profil/${res.data.infos.utilisateur.pseudo}`)
    } catch (err) {
      throw err
    }
  }

  return (
    <>
      <h1>Connexion</h1>
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
    </>
  )
}

export default FormConnexion
