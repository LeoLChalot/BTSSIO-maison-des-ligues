import axios from 'axios'
class Article {
  constructor(id, title, description, photo, price, quantite, id_category) {
    this.id = id
    this.title = title
    this.description = description
    this.photo = photo
    this.price = price
    this.quantite = quantite
    this.id_category = id_category
  }

  static async getAllArticles() {
    console.log('serveur : getAllArticles')
    try {
      const { data } = await axios.get(
        'http://localhost:3000/m2l/boutique/article'
      )
      return data
    } catch (error) {
      console.error(error)
    }
  }

  static async getArticleById(id_article) {}

  static async getArticlesByCategoryId(categoryId) {
    const category = String(categoryId)
    console.log('serveur : getArticlesByCategoryId')
    try {
      console.log("request")
      const {data}  = await axios.get(
        `http://localhost:3000/m2l/boutique/article`,
        {
          id_categorie: categoryId,
        }
      )
      console.log(data)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  static async addArticle(article) {}

  static async updateArticle(updatedArticle) {}

  static async deleteArticleById(articleId) {}

  // Getter methods
  getId() {
    return this.id
  }

  getTitle() {
    return this.title
  }

  getDescription() {
    return this.description
  }

  getPrice() {
    return this.price
  }

  // Setter methods
  setId(id) {
    this.id = id
  }

  setTitle(title) {
    this.title = title
  }

  setDescription(description) {
    this.description = description
  }

  setPrice(price) {
    this.price = price
  }
}

export default Article
