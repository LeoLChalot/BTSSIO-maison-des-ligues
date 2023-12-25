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
      this.id = uuidv4();
      this.nom = nom;
      this.photo = photo ? photo : 'images\\no-image.png';
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
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async getArticleById(id_article) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM articles WHERE id_article = ?';
         const result = await connexion.promise().query(query, [id_article]);
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async getArticlesByCategoryId(categoryId) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM articles WHERE categorie_id = ?';
         const data = await connexion.promise().query(query, [categoryId]);
         console.log(data);
         return data[0];
      } catch (error) {
         console.error('Error fetching articles by category id:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   async addArticle() {
      const connexion = ConnexionDAO.connect();
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

         const query =
            'INSERT INTO articles (id_article, nom, photo, description, prix, quantite, categorie_id) VALUES(?, ?, ?, ?, ?, ?, ?)';
         const result = await connexion.promise().query(query, values);
         return result;
      } catch (error) {
         console.error('Error adding article:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   async updateArticle(article) {
      const connexion = ConnexionDAO.connect();
      try {
         const values = [
            article.nom,
            article.photo,
            article.description,
            article.prix,
            article.quantite,
            article.categorie_id,
            article.id,
         ];
         const query =
            'UPDATE articles SET nom = ?, photo = ?, description = ?, prix = ?, quantite = ?, categorie_id = ? WHERE id_article = ?';
         const result = await connexion.promise().query(query, values);
         return result;
      } catch (error) {
         console.error('Error updating article:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async deleteArticle(id_article) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'DELETE FROM articles WHERE id_article = ?';
         const result = await connexion.promise().query(query, [id_article]);
         return result;
      } catch (error) {
         console.error('Error deleting article:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
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
