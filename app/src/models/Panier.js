import axios from 'axios'
import Article from './Article'
class Panier {
  constructor(id_panier, pseudo) {
    this.id_panier = id_panier
    this.pseudo = pseudo
    this.articles = [] // Tableau pour stocker les articles du panier
  }

  static async getPanier(pseudo) {
    try {
      const url = `http://localhost:3000/m2l/panier/${pseudo}`
      const headers = {
        'Content-Type': 'application/json',
      }
      const config = {
        headers,
        withCredentials: true,
      }

      const response = await axios.get(url, config)
      // console.log({ response: response })
      const panier = new Panier(response.data.id_panier, pseudo)
      // console.log({ panier: panier })
      for (let i = 0; i < response.data.articles.length; i++) {
        // console.log(response.data.articles[i].id_article)
        const { data } = await Article.getArticleById(
          response.data.articles[i].id_article
        )
        // console.log({ data: data })
        if (data) {
          const item = new Article(
            response.data.articles[i].id,
            data.infos[0].id_article,
            data.infos[0].nom,
            data.infos[0].description,
            data.infos[0].photo,
            data.infos[0].prix,
            data.infos[0].quantite,
            data.infos[0].id_category
          )
          // console.log(item)
          panier.addArticleToPanier(item)
        }
      }

      return panier
    } catch (error) {
      console.error(error)
    }
  }

  // Méthode pour ajouter un article au panier
  addArticleToPanier(article) {
    this.articles.push(article)
  }

  confirmPanier(id_panier) {
    // Implement the logic to confirm the cart
  }

  async deleteArticleFromPanier(id) {
    // Implement the logic to delete an article from the cart
    console.log('Backend', { pseudo: this.pseudo, id: id })
    const url = `http://localhost:3000/m2l/panier/` + this.pseudo
    console.log(url)
    const request = await axios.delete(url, {
      id: id,
    })
  }

  viderPanier() {
    // Implement the logic to empty the cart
  }

  getNombreArticles() {
    return this.articles.length
  }

  getPrixTotal() {
    return (
      Math.round(
        this.articles.reduce((total, article) => total + article.prix, 0) * 100
      ) / 100
    )
  }

  /**
   * Retourne l'id du panier
   *
   * @return {uuid} L'id du panier
   */
  getId() {
    return this.id_panier
  }
  /**
   * Met à jour la valeur de l'id du panier
   *
   * @param {uuid} id - Le nouvel ID du panier
   * @return {void}
   */
  setId(id) {
    this.id_panier = id
  }

  /**
   * Mets à jour la valeur du pseudo
   *
   * @param {string} pseudo - La nouvelle valeur pour le pseudo
   * @return {void}
   */
  setPseudo(pseudo) {
    this.pseudo = pseudo
  }

  /**
   * Retourne le pseudo du propriétaire du panier
   *
   * @return {string} Le pseudo du propriétaire du panier
   */
  getPseudo() {
    return this.pseudo
  }

  /**
   * Retourne les articles du panier
   *
   * @return {Array} Le tableau d'articles
   */
  getArticles() {
    return this.articles
  }

  /**
   * Met à jour la valeur de la propriété prix
   *
   * @param {float} prix - Le nouveau valeur pour la propriété prix.
   * @return {void}
   */
  setPrix(prix) {
    this.prix = prix
  }
}

export default Panier
