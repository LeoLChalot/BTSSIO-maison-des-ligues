import axios from 'axios'
import Article from './Article'
class Panier {
  constructor(pseudo) {
    this.id_panier
    this.pseudo = pseudo
    this.articles = [] // Tableau pour stocker les articles du panier
  }


  async initCart(){
    try {
      const url = `http://localhost:3000/m2l/panier/${this.pseudo}`
      const headers = {
        'Content-Type': 'application/json',
      }
      const config = {
        headers,
        withCredentials: true,
      }

      console.log(`1) On récupère le pseudo "${this.pseudo}" correctement`)

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
      console.log({data: data})
      const panierData = data.infos.panier
      const articlesData = data.infos.panier.articles
      const id_panier = data.infos.panier.id_panier

      this.setId(id_panier)

      // console.log(
      //   `4) On instancie les articles du panier "${pseudo}" (début de la boucle)`,
      //   { articlesData: articlesData }
      // )
      // ? On instancie les articles
      for (let i = 0; i < articlesData.length; i++) {
        const request = await Article.getArticleById(articlesData[i].id_article)
        // console.log(data)
        const article = {
          id: articlesData[i].id,
          id_panier: id_panier,
          id_article: articlesData[i].id_article,
          nom: request.data.infos[0].nom,
          description: request.data.infos[0].description,
          photo: request.data.infos[0].photo,
          prix_unite: articlesData[i].prix_unite,
          prix_total: articlesData[i].prix_unite * articlesData[i].quantite_articles,
          quantite_articles: articlesData[i].quantite_articles,
        }

        console.log({article: article})

        this.addArticleToPanier(article)
        // console.log(
        //   `${i + 5}) On ajoute l'item "${item.nom}" au panier "${pseudo}"`
        // )
      }
      // console.log(
      //   `${articlesData.length + 5}) On retourne le panier "${pseudo}"`,
      //   { panier: panier }
      // )
      console.log({ panier: this })
      return this
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

  async deleteArticleFromPanier(id_article, id_panier) {
    try {
      // Implement the logic to delete an article from the cart
      console.log('Backend', { pseudo: this.pseudo })
      const url = `http://localhost:3000/m2l/panier/${this.pseudo}?id_panier=${id_panier}&id_article=${id_article}`
      console.log(url)
      const headers = {
        'Content-Type': 'application/json',
      }
      const config = {
        headers,
        withCredentials: true,
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

  async getPrixTotal() {
    return (
      Math.round(
        this.articles.reduce((total, article) => total + article.prix_total, 0) * 100
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
    console.log(this.articles)
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
