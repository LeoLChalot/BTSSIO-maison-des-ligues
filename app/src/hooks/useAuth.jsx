import { createContext, useContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import PropTypes from 'prop-types';
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pseudo, setPseudo] = useState('')
  const [mail, setMail] = useState('')
  const [panier, setPanier] = useState(null)
<<<<<<< HEAD
  const [jwtToken, setJwtToken] = useState('')
=======
  const [, setJwtToken] = useState('')
  
>>>>>>> 8f573bb579302368335c11c564b5d4d0918638c5


  const updateState = (jwtToken) => {
    if (jwtToken) {
      // Decode le token pour obtenir les informations nécessaires
      const decodedToken = jwtDecode(jwtToken)

      // Verifie si le token est encore valide
      const currentDateTime = new Date().getTime() / 1000
      const isValidToken = decodedToken.exp > currentDateTime ? 1 : 0

      setIsLoggedIn(isValidToken)
      setMail(decodedToken.email)
      setPseudo(decodedToken.pseudo)
      setPanier(decodedToken.panier)
      setJwtToken(jwtToken)
	
	
      // Vérifie le rôle de l'utilisateur
      if (decodedToken.role) {
        setIsAdmin(true)
	console.log({"UseAuth Var" : isLoggedIn, isAdmin, pseudo, mail, panier, jwtToken})
      }
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
      setPseudo('')
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, pseudo, mail, panier, updateState }}>
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
