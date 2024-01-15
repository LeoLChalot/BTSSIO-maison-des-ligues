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

      // ? On récupère les informations du panier de l'utilisateur
      const { data } = await axios.get(url, config)

      const panierData = data.panierData
      const articlesData = data.articlesData
      const utilisateurData = data.utilisateurData

      console.log({
        data: data
      })

      // ? On instancie le panier
      const panier = new Panier(panierData.id_panier, pseudo)

      // ? On instancie les articles
      for (let i = 0; i < articlesData.length; i++) {

        const {data} = await Article.getArticleById(
          articlesData[i].id_article
        )
        if (data) {
          const item = new Article(
            articlesData[i].id,
            articlesData[i].id_article,
            data.infos[0].nom,
            data.infos[0].description,
            data.infos[0].photo,
            data.infos[0].prix,
            data.infos[0].quantite,
            data.infos[0].id_category
          )
          panier.addArticleToPanier(item)
        }
      }

      // ? On retourne le panier
      console.log(panier)
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
