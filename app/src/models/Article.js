import axios from 'axios'
class Article {
  constructor(id = uuidv4(), nom, description, photo, prix, quantite, id_category) {
    this.id = id
    this.nom = nom
    this.description = description
    this.photo = photo
    this.prix = prix
    this.quantite = quantite
    this.id_category = id_category
  }

  static async getAllArticles() {
    try {
      const res = await axios.get(
        'http://localhost:3000/m2l/boutique/articles'
      )
      // console.log(res)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  static async getArticleById(id_article) {
    try {
      const res = await axios.get(
        `http://localhost:3000/m2l/boutique/article?idart=${id_article}`
      )
      
      // return res
    } catch (error) {
      console.error(error)
    }
  }

  static async getArticlesByCategoryId(categoryId) {
    try {
      const res = await axios.get(
        `http://localhost:3000/m2l/boutique/articles?id_categorie=${categoryId}`
      )
      // console.log(res)
        return res
    } catch (error) {
      console.error(error)
    }
  }

  static async addArticle(article) {}

  static async updateArticle(updatedArticle) {}

  static async deleteArticleById(articleId) {
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
