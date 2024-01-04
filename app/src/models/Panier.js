import axios from 'axios'

class Panier {
  constructor(id_panier = null, pseudo) {
    this.id_panier = id_panier
    this.pseudo = pseudo
    this.articles = [] // Array to store the items in the cart
    this.prix = 0
    this.nombreArticles = this.articles.length
  }

  static async getPanier(pseudo) {
    // Implement the logic to create a new cart
    const { data } = await axios.get(
      `http://localhost:3000/m2l/panier/${pseudo}`
    )
    // console.log(data)
    return data
  }

  addArticleToPanier(id_panier, id_article) {
    // Implement the logic to add an article to the cart
  }

  confirmPanier(id_panier) {
    // Implement the logic to confirm the cart
  }

  deleteArticleFromPanier(id_panier, id_article) {
    // Implement the logic to delete an article from the cart
  }

  viderPanier() {
    // Implement the logic to empty the cart
  }

  getNombreArticles() {
    return this.articles.length // Get the number of articles in the cart
  }

  getTotalPrix() {
    // Implement the logic to get the total price of the cart
  }

  getId() {
    return this.id_panier
  }
  setId(id) {
    this.id_panier = id
  }
  setPseudo(pseudo) {
    this.pseudo = pseudo
  }

  getPseudo() {
    return this.pseudo
  }
  setArticles(articles) {
    this.articles = articles
  }
  getArticles() {
    return this.articles
  }
  setPrix(prix) {
    this.prix = prix
  }
}

export default Panier
