import axios from 'axios'





class User {
  constructor(firstName, lastName, pseudo, email, password) {
    this.prenom = firstName
    this.nom = lastName
    this.pseudo = pseudo
    this.email = email
    this.mot_de_passe = password
  }

  static async createUser(firstName, lastName, pseudo, email, password) {}

  static async connectUser(login, password) {}

  static async getAllUsers() {}

  static async getUserByEmail(email) {}

  static async getUserByPseudo(pseudo) {}

  static async getUserById(id) {}

  static async deleteUserById(id) {}

  getFirstName() {
    return this.firstName
  }

  getLastName() {
    return this.lastName
  }

  getPseudo() {
    return this.pseudo
  }

  getEmail() {
    return this.email
  }

  getPassword() {
    return this.password
  }

  // Setter methods
  setFirstName(firstName) {
    this.firstName = firstName
  }

  setLastName(lastName) {
    this.lastName = lastName
  }

  setPseudo(pseudo) {
    this.pseudo = pseudo
  }

  setEmail(email) {
    this.email = email
  }

  setPassword(password) {
    this.password = bcrypt.hashSync(password, 10)
  }
}

class Panier {
  constructor() {
    this.id_panier = null
    this.articles = [] // tableau pour stocker les articles du panier
    this.totalPrix = 0
    this.nombreArticles = this.articles.length
  }

  static async createPanier(id_utilisateur) {}

  static async getPanier(id_utilisateur) {}

  static async addArticleToPanier(id_panier, id_article) {}

  static async confirmPanier(id_panier) {}

  static async deleteArticleFromPanier(id_panier, id_article) {}

  viderPanier() {
    this.articles = [] // vider le panier
  }

  getNombreArticles() {
    return this.items.length // obtenir le nombre d'articles dans le panier
  }

  getTotalPrix() {
    let total = 0
    for (let i = 0; i < this.articles.length; i++) {
      total += this.articles[i].prix // calculer le prix total du panier
    }
    return total
  }
}

module.exports = {
  Article,
  User,
  Panier,
}
