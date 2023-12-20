class Panier {
  constructor() {
    this.id_panier = null
    this.articles = [] // Array to store the items in the cart
    this.totalPrix = 0
    this.nombreArticles = this.articles.length
  }

  static getPanier(id_utilisateur) {
    // Implement the logic to create a new cart
    fetch(`http://localhost:3000/panier/${id_utilisateur}`)
      .then((response) => response.json())
      .then((data) => {
        // now you have access to the panier data
        this.id_panier = data.id_panier
        this.articles = data.articles
        this.totalPrix = data.totalPrix
        this.nombreArticles = this.articles.length
      })
      .catch((error) => console.error('Error:', error))
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
}

export default Panier