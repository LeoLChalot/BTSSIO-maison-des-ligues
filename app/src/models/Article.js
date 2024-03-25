import axios from 'axios'
import { env } from './conf'

class Article {
  constructor(id, id_article, nom, description, photo, prix, quantite, id_category) {
    this.id = id
    this.id_article = id_article
    this.nom = nom
    this.description = description
    this.photo = photo
    this.prix = prix
    this.quantite = quantite
    this.id_categorie = id_category
  }

/**
 * Retourne la liste des articles de la boutique
 *
 * @return {Promise} Une promesse qui contient la liste des articles
 */
static async getAllArticles() {
  try {
    const res = await axios.get(`http://${env.apiUrl}/m2l/boutique/articles`);
    return res;
  } catch (error) {
    console.error(error);
  }
}

static async getArticleById(id_article) {
  try {
    const res = await axios.get(`http://${env.apiUrl}/m2l/boutique/articles?id_article=${id_article}`);
    return res;
  } catch (error) {
    console.error(error);
  }
}

  static async getArticlesByCategoryId(categoryId) {
    try {
      const res = await axios.get(
        `http://${env.apiUrl}/m2l/boutique/articles?id_categorie=${categoryId}`
      )
      // console.log(res)
        return res
    } catch (error) {
      console.error(error)
    }
  }



  static async addArticle() {}

  static async updateArticle() {}

  static async deleteArticleById(articleId) {
    try {
      const { data } = await axios.delete(
        `http://${env.apiUrl}/m2l/boutique/article/${articleId}`
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
