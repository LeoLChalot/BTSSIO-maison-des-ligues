const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('./ConnexionDAO');

class CategorieDAO {
   constructor(nom) {
      this.id_category = uuidv4();
      this.nom = nom;
   }

   static async getAllCategories() {
      try {
         const connexion = ConnexionDAO.connect();
         const sql = 'SELECT * FROM categories ORDER BY nom';
         const data = await connexion.promise().query(sql);
         const categories = data[0];
         ConnexionDAO.disconnect();
         return categories;
      } catch (error) {
         console.error('Error retrieving categories:', error);
         throw error;
      }
   }

   static async getCategoryById(id_categorie) {
      try {
         const connexion = ConnexionDAO.connect();
         const sql = 'SELECT * FROM categories WHERE id_categorie = ?';
         const data = await connexion.promise().query(sql, [id_categorie]);
         const category = data[0][0];
         ConnexionDAO.disconnect();
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   static async getCategoryByName(nom) {
      try {
         const connexion = ConnexionDAO.connect();
         const sql = 'SELECT * FROM categories WHERE nom = ?';
         const data = await connexion.promise().query(sql, [nom]);
         const category = data[0][0];
         ConnexionDAO.disconnect();
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   static async addCategory(nom) {
      const id_categorie = uuidv4();
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'INSERT INTO categories (id_categorie, nom) VALUES (?, ?)';
         const result = await connexion
            .promise()
            .query(query, [id_categorie, nom]);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding category:', error);
         throw error;
      }
   }
   static async deleteCategory(id_category) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'DELETE FROM categories WHERE id_categorie = ?';
         const result = await connexion.promise().query(query, [id_category]);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting category:', error);
         throw error;
      }
   }
}

module.exports = CategorieDAO;
