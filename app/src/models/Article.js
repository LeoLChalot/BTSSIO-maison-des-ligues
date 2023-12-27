import axios from 'axios'
class Article {
  constructor(id, nom, description, photo, prix, quantite, id_category) {
    this.id = id
    this.nom = nom
    this.description = description
    this.photo = photo
    this.prix = prix
    this.quantite = quantite
    this.id_category = id_category
  }

  static async getAllArticles() {
    console.log({ serveur: 'getAllArticles' })
    try {
      const { data } = await axios.get(
        'http://localhost:3000/m2l/boutique/article'
      )
      return data
    } catch (error) {
      console.error(error)
    }
  }

  static async getArticleById(id_article) {
    console.log({ serveur: 'getArticleById' })
    try {
      const { data } = await axios.get(
        `http://localhost:3000/m2l/boutique/article?idart=${id_article}`
      )
      return data
    } catch (error) {
      console.error(error)
    }
  }

  static async getArticlesByCategoryId(categoryId) {
    const category = String(categoryId)
    console.log({ serveur: 'getArticlesByCategoryId' })
    try {
      const { data } = await axios.get(
        `http://localhost:3000/m2l/boutique/article?idcat=${categoryId}`
      )
      console.log(data)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  static async addArticle(article) {}

  static async updateArticle(updatedArticle) {}

  static async deleteArticleById(articleId) {
    console.log({ serveur: 'deleteArticleById' })
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/m2l/boutique/article/${articleId}`
      )
      return data
    } catch (error) {
      console.error(error)
    }
  }

  // Getter methods
  getId() {
    return this.id
  }

  getnom() {
    return this.nom
  }

  getDescription() {
    return this.description
  }

  getprix() {
    return this.prix
  }

  // Setter methods
  setId(id) {
    this.id = id
  }

  setnom(nom) {
    this.nom = nom
  }

  setDescription(description) {
    this.description = description
  }

  setprix(prix) {
    this.prix = prix
  }
}

export default Article
