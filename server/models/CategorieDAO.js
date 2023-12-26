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
         return categories;
      } catch (error) {
         console.error('Error retrieving categories:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

static async getCategoryById(id_categorie) {
   try {
      const connexion =  ConnexionDAO.connect();
      const sql = 'SELECT * FROM categories WHERE id_categorie = ?';
      const [rows] = await connexion.promise().query(sql, [id_categorie]);
      return rows.length > 0 ? rows[0] : false;
   } catch (error) {
      console.error('Error retrieving category:', error);
      throw error;
   } finally {
      ConnexionDAO.disconnect();
   }
}

   static async getCategoryByName(nom) {
      try {
         const connexion = ConnexionDAO.connect();
         const sql = 'SELECT * FROM categories WHERE nom = ?';
         const data = await connexion.promise().query(sql, [nom]);
         const category = data[0][0];
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   async addCategory() {
      try {
         const connexion = ConnexionDAO.connect();
         const sql = 'INSERT INTO categories (id_categorie, nom) VALUES (?, ?)';
         const result = await connexion
            .promise()
            .query(sql, [this.id_category, this.nom]);
         return result;
      } catch (error) {
         console.error('Error adding category:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }
   static async deleteCategory(id_category) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'DELETE FROM categories WHERE id_categorie = ?';
         const result = await connexion.promise().query(query, [id_category]);
         return result;
      } catch (error) {
         console.error('Error deleting category:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }
}

module.exports = CategorieDAO;
