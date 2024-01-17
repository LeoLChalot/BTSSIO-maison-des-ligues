import axios from 'axios'
import Article from './Article'
class Panier {
  constructor(id_panier, pseudo) {
    this.id_panier = id_panier
    this.pseudo = pseudo
    this.articles = [] // Tableau pour stocker les articles du panier
  }

  /**
   * Retrieves the panier information for a given pseudo.
   *
   * @param {string} pseudo - the pseudo of the user
   * @return {Promise<Panier>} - the panier object containing the user's cart information
   */
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

      console.log(`1) On récupère le pseudo "${pseudo}" correctement`)

      // ? On récupère les informations du panier de l'utilisateur
      const { data } = await axios.get(url, config)
      // console.log(`2) Informations récupérées du panier "${pseudo}"`, {
      //   data: data,
      // })

      // console.log(`3) On organise les informations du panier "${pseudo}"`, {
      //   panierData: data.infos.panier,
      //   articlesData: data.infos.panier.articles,
      //   utilisateurData: data.infos.panier.pseudo,
      //   id_panier: data.infos.panier.id_panier,
      // })

      const panierData = data.infos.panier
      const articlesData = data.infos.panier.articles
      const pseudoUtilisateur = data.infos.panier.pseudo
      const id_panier = data.infos.panier.id_panier

      // ? On instancie le panier
      const panier = new Panier(id_panier, pseudoUtilisateur)

      // console.log(
      //   `4) On instancie les articles du panier "${pseudo}" (début de la boucle)`,
      //   { articlesData: articlesData }
      // )
      // ? On instancie les articles
      for (let i = 0; i < articlesData.length; i++) {
        const request = await Article.getArticleById(articlesData[i].id_article)
        // console.log(data)
        const item = new Article(
          articlesData[i].id,
          articlesData[i].id_article,
          request.data.infos[0].nom,
          request.data.infos[0].description,
          request.data.infos[0].photo,
          request.data.infos[0].prix,
          request.data.infos[0].quantite,
          request.data.infos[0].id_category
        )
        panier.addArticleToPanier(item)
        // console.log(
        //   `${i + 5}) On ajoute l'item "${item.nom}" au panier "${pseudo}"`
        // )
      }
      // console.log(
      //   `${articlesData.length + 5}) On retourne le panier "${pseudo}"`,
      //   { panier: panier }
      // )
      console.log({ panier: panier })
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
    try {
      // Implement the logic to delete an article from the cart
      console.log('Backend', { pseudo: this.pseudo, id: id })
      const url = `http://localhost:3000/m2l/panier/${this.pseudo}?id_row=${id}`
      console.log(url)
      const headers = {
        'Content-Type': 'application/json',
      }
      const config = {
        headers,
        withCredentials: true,
      }
      const body = {
        id: id,
      }
      const request = await axios.delete(url, config)
      console.log({request : request})
      return request
    } catch (error) {
      console.error(error)
    }
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
