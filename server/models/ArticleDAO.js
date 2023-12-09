const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('./ConnexionDAO');

class ArticleDAO {
   constructor(id, nom, description, prix, quantite, categorie_id) {
      this.id = id;
      this.nom = nom;
      this.description = description;
      this.prix = prix;
      this.quantite = quantite;
      this.categorie_id = categorie_id;
   }

   static async getAllArticles() {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM articles ORDER BY nom';
         const result = await connexion.promise().query(query);
         connexion.end();
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   static async getArticleById(id_article) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM articles WHERE id_article = ?';
         const result = await connexion.promise().query(query, [id_article]);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   static async getArticlesByCategoryId(categoryId) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM articles WHERE categorie_id = ?';
         const data = await connexion.promise().query(query, [categoryId]);
         ConnexionDAO.disconnect();
         console.log(data);
         return data[0];
      } catch (error) {
         console.error('Error fetching articles by category id:', error);
         throw error;
      }
   }

   async addArticle() {
      try {
         const values = [this.id, this.nom, this.description, this.prix, this.quantite, this.categorie_id];
         const connexion = ConnexionDAO.connect();
         const query = 'INSERT INTO articles (id_article, nom, description, prix, quantite, categorie_id) VALUES(?, ?, ?, ?, ?, ?)';
         const result = await connexion.promise().query(query, values);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding article:', error);
         throw error;
      }
   }

   static async updateArticle(updatedArticle) {
      const {
         id_article,
         nom,
         photo,
         description,
         prix,
         quantite,
         categorie_id,
      } = updatedArticle;
      const query = `UPDATE articles SET id_article = ?, nom = ?, photo = ?, description = ?, prix = ?, quantite = ?, categorie_id = ? WHERE id_article = ?`;
      const result = await ConnexionDAO.connect()
         .promise()
         .query(query, [
            id_article,
            nom,
            photo,
            description,
            prix,
            quantite,
            categorie_id,
            id_article,
         ]);
      return result;
   }

   static async deleteArticleById(articleId) {
      try {
         const connexion = ConnexionDAO.connect();
         let query = `SELECT quantite FROM articles WHERE id_article = ?`;
         let result = await connexion.promise().query(getNumber, [articleId]);
         let quantite = result[0][0].quantite;
         if (quantite === 0) {
            return;
         } else {
            quantite = quantite - 1;
            query = 'UPDATE articles SET quantite = ? WHERE id_article = ?';
            result = await connexion
               .promise()
               .query(query, [quantite, articleId]);
         }
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting article:', error);
         throw error;
      }
   }

   // Getter methods
   getId() {
      return this.id;
   }

   getTitle() {
      return this.title;
   }

   getDescription() {
      return this.description;
   }

   getPrice() {
      return this.price;
   }

   // Setter methods
   setId(id) {
      this.id = id;
   }

   setTitle(title) {
      this.title = title;
   }

   setDescription(description) {
      this.description = description;
   }

   setPrice(price) {
      this.price = price;
   }
}

module.exports = ArticleDAO;
