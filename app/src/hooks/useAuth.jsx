import { createContext, useContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import PropTypes from 'prop-types';
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pseudo, setPseudo] = useState('')
  const [mail, setMail] = useState('')
  const [panier_id, setPanier] = useState(null)
  const [token, setToken] = useState('')


  const updateState = (token) => {
    if (token) {
      // Decode le token pour obtenir les informations nécessaires
      const decodedToken = jwtDecode(token)

      // Verifie si le token est encore valide
      const currentDateTime = new Date().getTime() / 1000
      const isValidToken = decodedToken.exp > currentDateTime ? true : false

      setIsLoggedIn(isValidToken)

      setMail(decodedToken.email)
      setPseudo(decodedToken.pseudo)
      setPanier(decodedToken.panier)
      setToken(token)
	setIsAdmin(decodedToken.role)
	
	console.log(mail, panier_id, pseudo, token, isAdmin)
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
      setPseudo('')
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, pseudo, mail, panier_id, token, updateState }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}


AuthProvider.propTypes = {
  children: PropTypes.node
};
