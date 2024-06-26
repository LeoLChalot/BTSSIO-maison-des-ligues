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
  const baseUrl = `${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}`
  const navigate = useNavigate()

  const showPassordToggle = () => {
    showPassord == false ? setShowPassword(true) : setShowPassword(false)
  }

  const handleFormData = async (e) => {
    e.preventDefault()

    const headers = {
      'Content-Type': 'application/json',
    }
    const body = {
      login: login,
      mot_de_passe: password,
    }
    const config = {
      headers,
      withCredentials: true,
    }
    const res = await axios.post(`${baseUrl}/user/connexion`, body, config)


    if (res.status == 200) {
      console.log(res.data.infos)
	const pseudo = res.data.infos.utilisateur.pseudo

      Cookies.set('token', res.data.infos.utilisateur.token, {
        expires: 1,
        secure: false,
      })

	let token = res.data.infos.utilisateur.token
	updateState(token)
	const decodedToken = jwtDecode(token)
	console.log(`TOKEN DECODE ROLE => ${decodedToken.role}`);
	const navigatePath = decodedToken.role == true ? `/dashboard` : `/profil/${pseudo}`;
      navigate(navigatePath);
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
