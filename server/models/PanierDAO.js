const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('./ConnexionDAO')

class PanierDAO {
  constructor() {
     this.id_panier = null;
     this.articles = []; // tableau pour stocker les articles du panier
     this.totalPrix = 0;
     this.nombreArticles = this.articles.length;
  }

  static async createPanier(id_utilisateur) {
     const id_panier = uuidv4();
     try {
        const connexion = ConnexionDAO.connect();
        const query =
           'INSERT INTO panier (id_panier, id_utilisateur) VALUES (?, ?)';
        const result = await connexion
           .promise()
           .query(query, [id_panier, id_utilisateur]);

        ConnexionDAO.disconnect();
        return result;
     } catch (error) {
        console.error('Error creating panier:', error);
        throw error;
     }
  }

  static async getPanier(id_utilisateur) {
     try {
        const connexion = ConnexionDAO.connect();
        const query = 'SELECT * FROM panier WHERE id_utilisateur = ?';
        const result = await connexion
           .promise()
           .query(query, [id_utilisateur]);
        ConnexionDAO.disconnect();
        return result[0];
     } catch (error) {
        console.error('Error fetching panier:', error);
        throw error;
     }
  }

  static async addArticleToPanier(id_panier, id_article) {
     const article = await ArticleDAO.getArticleById(id_article);
     if (article) {
        this.articles.push(id_article);

        const id = uuidv4();
        try {
           const connexion = ConnexionDAO.connect();
           const query =
              'INSERT INTO panier_produits (id, id_panier, id_article) VALUES (?, ?, ?)';
           const result = await connexion
              .promise()
              .query(query, [id, id_panier, id_article]);
           ConnexionDAO.disconnect();
           return result;
        } catch (error) {
           console.error('Error creating panier:', error);
           throw error;
        }
     }
  }

  static async confirmPanier(id_panier) {
     try {
        const connexion = ConnexionDAO.connect();
        const query = 'UPDATE panier SET ordered = ? WHERE id_panier = ?';

        const result = await connexion
           .promise()
           .query(query, ['ordered', id_panier]);
        ConnexionDAO.disconnect();
        return result;
     } catch (error) {
        console.error('Error fetching panier:', error);
        throw error;
     }
  }

  static async deleteArticleFromPanier(id_panier, id_article) {
     try {
        const connexion = ConnexionDAO.connect();
        const query =
           'DELETE FROM panier_produits WHERE id_panier = ? AND id_article = ?';
        const result = await connexion
           .promise()
           .query(query, [id_panier, id_article]);
        ConnexionDAO.disconnect();
        return result;
     } catch (error) {
        console.error('Error deleting article from panier:', error);
        throw error;
     }
  }

  viderPanier() {
     this.articles = []; // vider le panier
  }

  getNombreArticles() {
     return this.items.length; // obtenir le nombre d'articles dans le panier
  }

  getTotalPrix() {
     let total = 0;
     for (let i = 0; i < this.articles.length; i++) {
        total += this.articles[i].prix; // calculer le prix total du panier
     }
     return total;
  }
}

module.exports = PanierDAO;