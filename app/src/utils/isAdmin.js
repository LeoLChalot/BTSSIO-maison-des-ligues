import { jwtDecode } from 'jwt-decode'

/**
 * Vérifie si un jeton est valide.
 *
 * @param {string} token - Le jeton à vérifier.
 * @return {boolean} Retourne true si le jeton est valide, false sinon.
 */
export const isAdmin = (token) => {
  // console.log(token)
  try {
    const decodedToken = jwtDecode(token)
    // console.log('Decoded Token:', decodedToken)
    const currentDateTime = new Date().getTime() / 1000
    // console.log('Current DateTime:', currentDateTime)
    decodedToken.exp > currentDateTime
      ? console.log('Token is valid')
      : console.log('Token is not valid')
    return decodedToken.role
  } catch (error) {
    return false
  }
}
