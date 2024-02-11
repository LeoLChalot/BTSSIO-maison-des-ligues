import React, { useState } from 'react'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Oeil from '/oeil.svg'
import OeilFerme from '/oeil_ferme.svg'
import './FormInscription.css'

const FormInscription = () => {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [passwordHash, setPasswordHash] = useState('')
  const [showPassord, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const checkPassword = (password, passwordCheck) => {
    if (password != '' && passwordCheck != '') {
      return password == passwordCheck ? (
        <span className="progress-bar good">
          <small>Les mots de passe sont identiques</small>
        </span>
      ) : (
        <span className="progress-bar bad">
          <small>Les mots de passe ne sont pas identiques</small>
        </span>
      )
    }
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/
  const lenghtRegex = /^.{12,}$/
  const specialCharRegex = /.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\|\/§].*/
  const lowerCaseRegex = /(.*[a-z]).*/
  const upperCaseRegex = /^(.*[A-Z].*)/
  const numberRegex = /^(.*[0-9].*)/

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,3}$/
  const loginRegex = /^[a-zA-Z.-]{3,15}$/
  const pseudoRegex = /^[a-zA-Z0-9]{3,15}$/

  const showPassordToggle = () => {
    showPassord == false ? setShowPassword(true) : setShowPassword(false)
  }

  async function handleFormData(e) {
    e.preventDefault()
    // prenom = FormData.get('prenom')
    setPrenom(e.target['prenom'].value)
    setNom(e.target['nom'].value)
    setPseudo(e.target['pseudo'].value)
    setEmail(e.target['email'].value)
    setPasswordCheck(e.target['password-check'].value)
    let passwordHash = await bcrypt.hash(passwordCheck, 10)

    const user = {
      prenom: prenom,
      nom: nom,
      pseudo: pseudo,
      email: email,
      passwordHash: passwordHash,
    }
    console.table(user)

    try {
      const inscription = await axios.post(
        `http://localhost:3000/m2l/user/inscription`,
        {
          prenom: user.prenom,
          nom: user.nom,
          pseudo: user.pseudo,
          email: user.email,
          mot_de_passe: user.passwordHash,
        }
      )

      console.log(inscription)

      if (inscription.status === 200) {
        navigate('/connexion')
      }
    } catch (err) {
      throw err
    }
  }

  return (
    <>
    <h1>Inscription</h1>
    <div className="form">
      <form id="formulaire-inscription" onSubmit={(e) => handleFormData(e)}>
        <div className="input-group">
          <input
            type="text"
            name="nom"
            value={nom}
            placeholder="Nom"
            className={nom.match(loginRegex) ? 'check' : null}
            onChange={(e) => setNom(e.target.value)}
          />
          <input
            type="text"
            name="prenom"
            value={prenom}
            placeholder="Prénom"
            className={prenom.match(loginRegex) ? 'check' : null}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>
        <p className="rule">
          <small>
            Les noms et prénoms ne peuvents pas dépasser 15 caractères et ne
            doivent pas comporter de chiffre d'accent, ou de caractères spéciaux
            excepté "-"
          </small>
        </p>
        <div className="input-group">
          <input
            type="text"
            name="pseudo"
            value={pseudo}
            placeholder="Pseudo"
            className={pseudo.match(pseudoRegex) ? 'check' : null}
            onChange={(e) => setPseudo(e.target.value)}
          />
        </div>
        <p className="rule">
          <small>
            Le pseudo doit contenir au maximum 15 caractères et peut contenir
            des chiffres et les symboles "_" ou "-"
          </small>
        </p>
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="@mail"
            className={email.match(emailRegex) ? 'check' : null}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type={showPassord == false ? 'password' : 'text'}
            name="password"
            value={password}
            placeholder="Mot de passe"
            className={password.match(passwordRegex) ? 'check' : null}
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
        <div className="input-group">
          <input
            type="password"
            name="password-check"
            value={passwordCheck}
            placeholder="Resaisir le mot de passe"
            className={passwordCheck.match(passwordRegex) ? 'check' : null}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </div>
        <div className="liste">
          {checkPassword(password, passwordCheck)}

          <ul>
            <li>
              <p>
                <small>Le mot de passe doit contenir au moins</small>
              </p>
            </li>
            <li>
              <p>
                <small className={password.match(lenghtRegex) ? 'good' : 'bad'}>
                  12 caracères
                </small>
              </p>
            </li>
            <li>
              <p>
                <small
                  className={password.match(upperCaseRegex) ? 'good' : 'bad'}
                >
                  1 majuscule
                </small>
              </p>
            </li>
            <li>
              <p>
                <small
                  className={password.match(lowerCaseRegex) ? 'good' : 'bad'}
                >
                  1 minuscule
                </small>
              </p>
            </li>
            <li>
              <p>
                <small
                  className={password.match(specialCharRegex) ? 'good' : 'bad'}
                >
                  1 caractère spécial
                </small>
              </p>
            </li>

            <li>
              <p>
                <small className={password.match(numberRegex) ? 'good' : 'bad'}>
                  1 chiffre
                </small>
              </p>
            </li>
          </ul>
        </div>
        
        {nom.match(loginRegex) &&
        prenom.match(loginRegex) &&
        pseudo.match(pseudoRegex) &&
        email.match(emailRegex) &&
        password.match(passwordRegex) &&
        passwordCheck.match(passwordRegex) ? (
          <input type="submit" value="Inscription" />
        ) : (
          <input type="submit" value="Inscription" disabled />
        )}
      </form>
    </div>
    </>
  )
}

export default FormInscription
