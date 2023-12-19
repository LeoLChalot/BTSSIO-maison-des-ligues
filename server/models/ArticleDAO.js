const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('./ConnexionDAO');

class ArticleDAO {
   constructor(
      id_article,
      nom,
      photo,
      description,
      prix,
      quantite,
      categorie_id
   ) {
      this.id = id_article;
      this.nom = nom;
      this.photo = photo;
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
         const values = [
            this.id,
            this.nom,
            this.photo,
            this.description,
            this.prix,
            this.quantite,
            this.categorie_id,
         ];
         const connexion = ConnexionDAO.connect();
         const query =
            'INSERT INTO articles (id_article, nom, photo, description, prix, quantite, categorie_id) VALUES(?, ?, ?, ?, ?, ?, ?)';
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

   static async deleteArticle(id_article) {
       try {
           const connexion = ConnexionDAO.connect();
           const query = 'DELETE FROM articles WHERE id_article = ?';
           const result = await connexion.promise().query(query, [id_article]);
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
