const { v4: uuidv4 } = require('uuid');
const ConnexionDAO = require('./ConnexionDAO');
const ArticleDAO = require('./ArticleDAO');

class PanierDAO {
   constructor(id_panier = uuidv4(), id_utilisateur) {
      this.id_panier = id_panier;
      this.id_utilisateur = id_utilisateur;
      this.articles = []; // tableau pour stocker les articles du panier
      this.prix = 0;
      this.nombreArticles = 0;
   }

   static async getPanierByUser(connexion, id_utilisateur) {
      const getPanier = `
      SELECT * 
      FROM panier 
      WHERE id_utilisateur = ?
      `;
      const createPanier = `
      INSERT INTO panier (id_panier, id_utilisateur) 
      VALUES (?, ?)
      `;
      try {
         const [rows] = await connexion.query(getPanier, [id_utilisateur]);
         if (rows.length > 0) {
            const panier = new PanierDAO(
               rows[0].id_panier,
               rows[0].id_utilisateur
            );
            await panier._addArticlesFromPanierProduits(connexion);
            return panier;
         } else {
            const [rows] = await connexion.query(createPanier, [
               uuidv4(),
               id_utilisateur,
            ]);
            console.log({ 'Panier Créé': true });
            const panier = new PanierDAO(this.id_panier, id_utilisateur);
            await panier._addArticlesFromPanierProduits(connexion);
            return panier;
         }
      } catch (error) {
         console.error('Error creating panier:', error);
         throw error;
      }
   }

   static async getPanierById(connexion, id_panier) {
      const getPanier = `
      SELECT * 
      FROM panier 
      WHERE id_panier = ?
      `;
      try {
         const [rows] = await connexion.query(getPanier, [id_panier]);
         if (rows.length > 0) {
            const panier = new PanierDAO(
               rows[0].id_panier,
               rows[0].id_utilisateur
            );
            await panier._addArticlesFromPanierProduits(connexion);
            console.log(panier)
            return panier;
         }
      } catch (error) {
         console.error('Error creating panier:', error);
         throw error;
      }
   }

   async getArticles(connexion) {
      const fetchArticles = `
      SELECT *
      FROM panier_produits
      WHERE id_panier = ?
      `;
      try {
         const [rows] = await connexion.query(fetchArticles, [
            this.id_panier,
         ]);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   async ajouterArticle(connexion, article) {
      const query = `
      INSERT INTO panier_produits (id, id_panier, id_article)
      VALUES (?, ?, ?)
   `;
      try {
         const id = uuidv4();
         this.articles.push(article);
         const result = await connexion.query(query, [
            id,
            this.id_panier,
            article.id_article,
         ]);
         console.log({ 'Article added to panier': article });
         return true;
      } catch (error) {
         console.error('Error creating panier:', error);
         throw error;
      }
   }

   async confirmPanier(connexion) {
      const queryOrder = `
      INSERT INTO commandes (id_commande, id_utilisateur, total) 
      VALUES (?, ?, ?)
      `;
      const queryDeletePanier = `
      DELETE FROM panier 
      WHERE id_panier = ?
      `;
      try {
         const orderResult = await connexion.query(queryOrder, [
            this.id_panier,
            this.id_utilisateur,
            this.getTotalPrix(),
         ]);
         if (orderResult) {
            const deleteResult = await connexion.query(queryDeletePanier, [
               this.id_panier,
            ]);
            if (deleteResult) {
               console.log('Panier entry deleted successfully');
            } else {
               console.error('Error deleting panier entry');
               throw new Error('Error deleting panier entry');
            }
         } else {
            console.error('Error creating order entry');
            throw new Error('Error creating order entry');
         }
      } catch (error) {
         console.error('Error fetching panier:', error);
         throw error;
      }
   }

   static async deleteArticleFromPanier(connexion, id_panier, id_article) {
      const query = `
      DELETE FROM panier_produits 
      WHERE id_panier = ? 
      AND id_article = ?
      `;
      try {
         const result = await connexion.query(query, [id_panier, id_article]);
         return result;
      } catch (error) {
         console.error('Error deleting article from panier:', error);
         throw error;
      }
   }

   async _addArticlesFromPanierProduits(connexion) {
      const getArticles = `
      SELECT * 
      FROM panier_produits 
      WHERE id_panier = ?
      `;
      try {
         const [rows] = await connexion.query(getArticles, [this.id_panier]);
         if (rows.length > 0) {
            for (let row of rows) {
               const articleId = row.id_article;
               const article = await ArticleDAO.getArticleById(
                  connexion,
                  articleId
               );
               if (article) {
                  this.articles.push(article);
               }
            }
         }
         this.nombreArticles = this.articles.length;
         this.prix = this.getTotalPrix();
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
      total = Math.round(total * 100) / 100; // Arrondi le résultat à deux décimales
      return total;
   }
}

module.exports = PanierDAO;
