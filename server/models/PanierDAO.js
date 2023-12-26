const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('./ConnexionDAO');
const ArticleDAO = require('./ArticleDAO');

class PanierDAO {
   constructor() {
      this.id_panier = uuidv4();
      this.id_utilisateur = null;
      this.articles = []; // tableau pour stocker les articles du panier
      this.totalPrix = 0;
      this.nombreArticles = this.articles.length;
   }

   static async getPanier(id_utilisateur) {
      try {
         const connexion = ConnexionDAO.connect();
         const checkQuery = 'SELECT * FROM panier WHERE id_utilisateur = ?';
         const [rows] = await connexion
            .promise()
            .query(checkQuery, [id_utilisateur]);

         if (rows.length > 0) {
            console.log({ 'Panier already exists': rows });
            const panier = new PanierDAO(rows[0].id_panier, rows[0].id_utilisateur);
            return panier;
         } else {
            const query =
               'INSERT INTO panier (id_panier, id_utilisateur) VALUES (?, ?)';
            const [rows] = await connexion
               .promise()
               .query(query, [uuidv4(), id_utilisateur]);
               console.log({ 'Panier created' : "OK"});
            const panier = new PanierDAO(this.id_panier, id_utilisateur);
            await panier._addArticlesFromPanierProduits();
            return panier;
         }
      } catch (error) {
         console.error('Error creating panier:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
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
         const queryOrder = 'INSERT INTO commandes (id_commande, id_utilisateur, total) VALUES (?, ?, ?)';
         const orderResult = await connexion.promise().query(queryOrder, [id_panier, this.id_utilisateur, this.getTotalPrix()]);

         if (orderResult) {
             const queryDeletePanier = 'DELETE FROM panier WHERE id_panier = ?';
             const deleteResult = await connexion.promise().query(queryDeletePanier, [id_panier]);

             if (deleteResult) {
                 console.log("Panier entry deleted successfully");
             } else {
                 console.error("Error deleting panier entry");
                 throw new Error("Error deleting panier entry");
             }
         } else {
             console.error("Error creating order entry");
             throw new Error("Error creating order entry");
         }
      } catch (error) {
         console.error('Error fetching panier:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
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

   async _addArticlesFromPanierProduits() {
       try {
           const connexion = ConnexionDAO.connect();
           const query = 'SELECT * FROM panier_produits WHERE id_panier = ?';
           const [rows] = await connexion.promise().query(query, [this.id_panier]);
           ConnexionDAO.disconnect();

           for (let row of rows) {
               const articleId = row.id_article;
               const article = await ArticleDAO.getArticleById(articleId);
               if (article) {
                   this.articles.push(article);
               }
           }
       } catch (error) {
           console.error('Error adding articles from panier_produits:', error);
           throw error;
       }
   }

   getId() {
      return this.id_panier;
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
