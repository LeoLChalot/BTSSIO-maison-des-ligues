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

  async function handleFormData(e) {
    e.preventDefault()

    const login = e.target['login'].value
    const mot_de_passe = e.target['mot_de_passe'].value

    try {
      const userData = await axios.get(
        `http://localhost:3000/connexion/${login}`
      )
      console.log(userData)
      const userInfos = userData.data

      const hash = userInfos.mot_de_passe
      if (bcrypt.compare(mot_de_passe, hash)) {
        localStorage.clear()
        const ls = localStorage
        ls.setItem('prenom', userInfos.prenom)
        ls.setItem('nom', userInfos.nom)
        ls.setItem('pseudo', userInfos.pseudo)
        ls.setItem('email', userInfos.email)
        ls.setItem('isAdmin', userInfos.is_admin)
        ls.setItem('isAuth', '1')

        const user = {
          prenom: ls.getItem('prenom'),
          nom: ls.getItem('nom'),
          pseudo: ls.getItem('pseudo'),
          email: ls.getItem('email'),
          isAdmin: ls.getItem('isAdmin'),
          isAuth: ls.getItem('isAuth'),
        }

        console.table(user)
        navigate('/profil')
      }
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
