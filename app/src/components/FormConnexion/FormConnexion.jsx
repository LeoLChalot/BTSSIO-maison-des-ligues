import React, { useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
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

    console.log(login, password)

    try {
      const userData = await axios.post(
        `http://localhost:3000/m2l/user/connexion`,
        {
          login: login,
          mot_de_passe: password,
        }
      )
      console.log(userData.data)

      if (userData.status == 200) {
        const userInfos = userData.data
        console.log(userInfos)

        localStorage.clear()
        const ls = localStorage
        ls.setItem('oauth_token', userInfos.token)
        ls.setItem('id_utilisateur', userInfos.id_utilisateur)
        ls.setItem('pseudo', userInfos.pseudo)
        ls.setItem('email', userInfos.email)
        ls.setItem('isAdmin', userInfos.status)
        ls.setItem('isAuth', '1')

        const user = {
          id_utilisateur: ls.getItem('id_utilisateur'),
          pseudo: ls.getItem('pseudo'),
          email: ls.getItem('email'),
          token: ls.getItem('oauth_token'),
          role: ls.getItem('isAdmin'),
        }

        console.table(user)
        navigate(`/profil/${ls.getItem('pseudo')}`)
      }
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
