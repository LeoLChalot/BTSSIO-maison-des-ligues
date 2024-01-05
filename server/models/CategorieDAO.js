const ConnexionDAO = require('./ConnexionDAO');

class CategorieDAO {
   constructor(nom) {
      this.id_category = uuidv4();
      this.nom = nom;
   }

   /**
    * Retourner tous les articles de la base de données.
    * ---
    * @return {Array} Un tableau d'objets.
    */
   static async get_all() {
      try {
         const query = `
         SELECT * 
         FROM categories 
         ORDER BY nom
      `;
         const { rows } = await ConnexionDAO.query(query);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   static async getCategoryById(connexion, id_categorie) {
      const sql = 'SELECT * FROM categories WHERE id_categorie = ?';
      try {
         const [rows] = await connexion.query(sql, [id_categorie]);
         return rows.length > 0 ? rows[0] : false;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   static async getCategoryByName(connexion, nom) {
      const sql = 'SELECT * FROM categories WHERE nom = ?';
      try {
         const data = await connexion.query(sql, [nom]);
         const category = data[0][0];
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   async addCategory(connexion) {
      const sql = 'INSERT INTO categories (id_categorie, nom) VALUES (?, ?)';
      try {
         const result = await connexion.query(sql, [
            this.id_category,
            this.nom,
         ]);
         return result;
      } catch (error) {
         console.error('Error adding category:', error);
         throw error;
      }
   }
   static async deleteCategory(connexion, id_category) {
      const query = 'DELETE FROM categories WHERE id_categorie = ?';
      try {
         const result = await connexion.query(query, [id_category]);
         return result;
      } catch (error) {
         console.error('Error deleting category:', error);
         throw error;
      }
   }
}

module.exports = CategorieDAO;
