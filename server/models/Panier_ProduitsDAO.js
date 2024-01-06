const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('./ConnexionDAO');

class Panier_ProduitsDAO {
   constructor() {
      this.table = 'panier_produits';
   }


   /**
    * Retrouver tous les articles de la base de données.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @return {Array} Un tableau d'objets
    */
   async find_all(connexion) {
      try {
         const query = `
         SELECT * 
         FROM ${this.table} 
         ORDER BY nom
         `;
         const rows = await connexion.query(query);
         console.log(rows);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   
   /**
    * Retrouver un item dans la base de données.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @param {string} db_column - Le nom de la colonne de la table
    * @param {any} value - La valeur à cibler dans la colonne
    * @return {Promise<Array>} Un tableau d'objets
    */
   async find(connexion, db_column, value) {
      try {
         const query = `
         SELECT * 
         FROM ${this.table} 
         WHERE ${db_column} = ?
         `;
         const rows = await connexion.query(query, [value]);
         console.log(rows);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }


   /**
    * Ajouter un nouvel item dans la base de données.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @param {Array} values - Un tableau de valeurs pour le nouvel item.
    * @return {Promise} Une promesse qui contient le résultat de la requête.
    */

   async create(connexion, object) {
      try {
         const columns = Object.keys(object);
         const values = Object.values(object);

         let query = `INSERT INTO ${this.table} (`;
         for (let i = 0; i < columns.length; i++) {
            if (i < columns.length - 1) {
               query += `${columns[i]}, `;
            } else {
               query += `${columns[i]}) VALUES(`;
            }
         }
         for (let i = 0; i < values.length; i++) {
            if (i < values.length - 1) {
               query += `?, `;
            } else {
               query += `?)`;
            }
         }
         console.log(query, values);

         const result = await connexion.query(query, values);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error adding panier_produits:', error);
         throw error;
      }
   }



   /**
    * Mise à jour d'une ligne dans la base de données.
    *
    * @param {Object} connexion - L'objet de connexion.
    * @param {Object} object - L'objet contenant les colonnes à mettre à jour.
    * @return {Promise} Une promesse qui contient le résultat de la requête.
    */
   async update(connexion, object) {
      try {
         const columns = Object.keys(object);
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
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @param {string} db_column - Une colonne de la table
    * @param {any} value - Une valeur de colonne
    * @return {Promise<Object>} - Une promesse qui contient le résultat
    */
   async delete(connexion, db_column, value) {
      {
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
}

module.exports = Panier_ProduitsDAO;
