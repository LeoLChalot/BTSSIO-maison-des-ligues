require('dotenv').config();
const ConnexionDAO = require('./ConnexionDAO');

class CommandeDAO {
   constructor() {
      this.table = 'commandes';
   }

   /**
    * Compte le nombre de colonnes dans la table.
    *
    * @return {Array} Un tableau d'objets.
    */
   __count_columns() {
      try {
         const query = `
         SELECT COUNT(*)
         FROM information_schema.columns
         WHERE table_schema = ${process.env.DB_NAME}
         AND table_name = ${this.table}
         `;
         const { rows } = ConnexionDAO.query(query);
         console.log(rows);
         return rows;
      } catch (error) {
         console.error('Error counting columns:', error);
         throw error;
      }
   }

   /**
    * Retourner tous les articles de la base de données.
    * ---
    * @return {Array} Un tableau d'objets.
    */
   static async find_all() {
      try {
         const query = `
         SELECT * 
         FROM ${this.table} 
         ORDER BY nom
         `;
         const rows = await ConnexionDAO.query(query);
         console.log(rows);
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
   static async find(db_column, value) {
      try {
         const query = `
         SELECT * 
         FROM ${this.table} 
         WHERE ${db_column} = ?
         `;
         const rows = await ConnexionDAO.query(query, [value]);
         console.log(rows);
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
   static async add([values]) {
      try {
         const columns = this.__count_columns();
         let query = `INSERT INTO ${this.table} VALUES(`;
         for (let i = 0; i < columns.length; i++) {
            if (i < columns.length - 1) {
               query += `?, `;
            } else {
               query += `?)`;
            }
         }  
         const result = await ConnexionDAO.query(query, values);
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
   static async update([columns], [values]) {
      try {
         let query = `UPDATE ${this.table} SET `;
         for(let i = 0; i < columns.length; i++) {
            if(i < columns.length - 1) {
               query += `${columns[i]} = ?, `;
            } else {
               query += `${columns[i]} = ?`;
            }
         }
         const result = await ConnexionDAO.query(query, values);
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
   static async delete(db_column, value) {
      {
         try {
            const query = `
         DELETE FROM ${this.table} 
         WHERE ${db_column} = ?
         `;
            const result = await ConnexionDAO.query(query, [value]);
            console.log(result);
            return result;
         } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
         }
      }
   }
}

module.exports = CommandeDAO;
