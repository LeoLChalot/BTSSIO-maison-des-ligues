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


   /**
    * Retourner tous les articles de la base de données.
    *
    * @return {Array} Un tableau d'objets Article.
    */
   static async getAllItems() {
      try {
         const query = `
         SELECT * 
         FROM articles 
         ORDER BY nom
      `;
         const { rows } = await ConnexionDAO.query(query);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   /**
    * Rechercher un article dans la base de données.
    * ---
    * @param {string} db_column - Le nom de la colonne de la table Articles.
    * @param {any} value - La valeur à cibler dans la colonne.
    * @return {Promise<Array>} - Une promesse sensée retourner un tableau d'objets Article.
    * @throws {Error} - Erreur à retourner en cas de problème lors de la requête
    */
   static async getItem(table, db_column, value) {
      try {
         const query = `
         SELECT * 
         FROM articles 
         WHERE ${db_column} = ?
         `;
         const { rows } = await ConnexionDAO.query(query, [value]);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   async addArticle(connexion) {
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

         console.log(values);

         const query = `
         INSERT INTO articles (id_article, nom, photo, description, prix, quantite, categorie_id) 
         VALUES(?, ?, ?, ?, ?, ?, ?)
         `;
         const result = await connexion.query(query, values);
         return result;
      } catch (error) {
         console.error('Error adding article:', error);
         throw error;
      }
   }

   async updateArticle(connexion) {
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
         const result = await connexion.query(query, values);
         return result;
      } catch (error) {
         console.error('Error updating article:', error);
         throw error;
      }
   }

   async delete(connexion, option) {
      try {
         if (option === 'all') {
            const query = 'DELETE FROM articles WHERE id_article = ?';
            const values = [this.id_article];
            await connexion.query(query, values);
            return { success: true, message: 'Tous les articles suprimés.' };
         }
         const selectQuery =
            'SELECT quantite FROM articles WHERE id_article = ?';
         const selectValues = [this.id_article];
         const [rows] = await connexion.query(selectQuery, selectValues);
         const quantity = rows[0]?.quantite;

         if (quantity < 0) {
            const updateQuery =
               'UPDATE articles SET quantite = 0 WHERE id_article = ?';
            const updateValues = [this.id_article];
            await connexion.query(updateQuery, updateValues);
         }

         if (quantity > 0) {
            const updateQuery =
               'UPDATE articles SET quantite = quantite - 1 WHERE id_article = ?';
            const updateValues = [this.id_article];
            await connexion.query(updateQuery, updateValues);
            return { success: true, message: 'Un article suprimé.' };
         } else {
            return { success: false, message: 'Article en rupture.' };
         }
      } catch (error) {
         console.error('Error deleting or decrementing article:', error);
         throw error;
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
