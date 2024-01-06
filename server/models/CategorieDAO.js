const ConnexionDAO = require('./ConnexionDAO');

class CategorieDAO {
   constructor() {
      this.table = 'categories';
   }

   /**
    * Retourner tous les articles de la base de données.
    * ---
    * @return {Array} Un tableau d'objets.
    */
   async find_all(connexion) {
      try {
         const query = `
         SELECT * 
         FROM ${this.table} 
         ORDER BY nom
         `;
         const rows = await connexion.query(query);
         console.log({ rows: rows });
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
    * @return {Promise<Array>} - Une promesse sensée retourner un tableau
    *                            d'objets.
    * @throws {Error} - A retourner en cas de problème lors de la requête
    */
   async find(connexion, db_column, value) {
      try {
         let query = `
         SELECT * 
         FROM ${this.table} 
         WHERE ${db_column} = ?
         `;
         const rows = await connexion.query(query, [value]);
         console.log({ rows: rows });
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   /**
    * Ajouter un article dans la base de données.
    * ---
    * @param {Array} values - Tableau de valeurs à insérer dans la table.
    * @return {type} Résultat de la requête.
    */
   async create(connexion, values) {
      try {
         let query = `INSERT INTO ${this.table} VALUES(`;
         for (let i = 0; i < values.length; i++) {
            if (i < values.length - 1) {
               query += `?, `;
            } else {
               query += `?)`;
            }
         }
         console.log(query);
         const result = await connexion.query(query, values);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error adding article:', error);
         throw error;
      }
   }

   /**
    * Mettre à jour un article dans la base de données.
    * ---
    * @param {Array} values - Un tableau de valeurs à mettre à jour.
    *                         Les valeurs doivent être un ensemble de paires clé valeurs
    * @return {Promise} Une promesse qui représente la mise à jour de
    *                   l'article.
    *                   Le résultat est un objet qui contient des
    *                   informations sur la mise à jour.
    *                   Si la mise à jour est à jour avec succès,
    *                   'affectedRows' sera le nombre de lignes affectées
    *                   par la mise à jour.
    *                   Si la mise à jour n'aboutit pas, une erreur sera levée.
    *                   Un objet contenant le message d'erreur sera retourné.
    */
   async update(connexion, [columns], [values]) {
      try {
         let query = `UPDATE ${this.table} SET `;
         for (let i = 0; i < columns.length; i++) {
            if (i < columns.length - 1) {
               query += `${columns[i]} = ?, `;
            } else {
               query += `${columns[i]} = ?`;
            }
         }
         const result = await connexion.query(query, values);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error updating article:', error);
         throw error;
      }
   }

   /**
    * Supprime une ligne dans la base de données.
    *
    * @param {string} db_column - Le nom de la colonne de la table.
    * @param {any} value - La valeur à cibler dans la colonne.
    * @return {Promise<any>} Une promesse qui contient le résultat de la requête.
    */
   async delete(connexion, db_column, value) {
      try {
         const query = `
         DELETE FROM ${this.table} 
         WHERE ${db_column} = ?
         `;
         const result = await connexion.query(query, [value]);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error deleting article:', error);
         throw error;
      }
   }
}

module.exports = CategorieDAO;
