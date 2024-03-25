import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Oeil from '/oeil.svg'
import OeilFerme from '/oeil_ferme.svg'
import './FormConnexion.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { jwtDecode } from 'jwt-decode'

const FormConnexion = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassord, setShowPassword] = useState(false)
  const { updateState } = useAuth()
  const navigate = useNavigate()

  const showPassordToggle = () => {
    showPassord == false ? setShowPassword(true) : setShowPassword(false)
  }

  const handleFormData = async (e) => {
    e.preventDefault()


    const res = await axios.post(`http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/user/connexion`, {
      login: login,
      mot_de_passe: password,
    })

    if (res.data.success === true) {
      console.log(res.data.infos)
      Cookies.set('jwt_token', res.data.infos.utilisateur.jwt_token, {
        expires: 1,
        secure: true,
      })
      let token = Cookies.get('jwt_token')
      updateState(token)
      token = jwtDecode(token)
      console.log(token)


      navigate(`${token.role ? '/dashboard' : ('/profil' + `/${res.data.infos.utilisateur.pseudo}`)}`)
    }

    toast.error('Login ou mot de passe invalide')

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
