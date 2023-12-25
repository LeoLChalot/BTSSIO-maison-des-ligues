const { v4: uuidv4 } = require('uuid');
const ConnexionDAO = require('./ConnexionDAO');
const { json } = require('express');

class ArticleDAO {
   constructor(id, nom, photo, description, prix, quantite, categorie_id) {
      this.id_article = id ? id : uuidv4();
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
         const data = await connexion.promise().query(query, [id_article]);
         const article = new ArticleDAO(
            id_article,
            data[0][0].nom,
            data[0][0].photo,
            data[0][0].description,
            data[0][0].prix,
            data[0][0].quantite,
            data[0][0].categorie_id
         );
         return article;
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
         const article = new ArticleDAO(
            data[0][0].id_article,
            data[0][0].nom,
            data[0][0].photo,
            data[0][0].description,
            data[0][0].prix,
            data[0][0].quantite,
            categoryId
         );
         return article;
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
            this.id_article,
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

   async updateArticle() {
      const connexion = ConnexionDAO.connect();
      try {
         const values = [
            this.nom,
            this.photo,
            this.description,
            this.prix,
            this.quantite,
            this.categorie_id,
            this.id_article,
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

   async delete(option) {
      const connexion = ConnexionDAO.connect();
      try {
         if (option === 'all') {
            const query = 'DELETE FROM articles WHERE id_article = ?';
            const values = [this.id_article];
            await connexion.promise().query(query, values);
            return { success: true, message: 'Tous les articles suprimés.' };
         }

         const selectQuery =
            'SELECT quantite FROM articles WHERE id_article = ?';
         const selectValues = [this.id_article];
         const [rows] = await connexion
            .promise()
            .query(selectQuery, selectValues);
         const quantity = rows[0]?.quantite;

         if (quantity > 0) {
            const updateQuery =
               'UPDATE articles SET quantite = quantite - 1 WHERE id_article = ?';
            const updateValues = [this.id_article];
            await connexion.promise().query(updateQuery, updateValues);
            return { success: true, message: 'Un article suprimé.' };
         } else {
            return { success: false, message: 'Article en rupture.' };
         }
      } catch (error) {
         console.error('Error deleting or decrementing article:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   // Getter methods
   getId() {
      return this.id;
   }

   getNom() {
      return this.nom;
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

   setNom(nom) {
      this.nom = nom;
   }

   setPhoto(photo) {
      this.photo = photo;
   }

   setDescription(description) {
      this.description = description;
   }

   setPrix(prix) {
      this.prix = prix;
   }

   setQuantite(quantite) {
      this.quantite = quantite;
   }

   setCategorie(categorie_id) {
      this.categorie_id = categorie_id;
   }
}

module.exports = ArticleDAO;
