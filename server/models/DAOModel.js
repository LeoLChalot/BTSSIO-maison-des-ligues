class DAOModel {
   constructor() {}

   /**
    * ## Retrouver tous les articles de la base de données.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @return {Array} Un tableau d'objets.
    * 
    * ---
    * *Exemples :*
    * ```js
    * const model = new DAOModel();
    * model.find_all(connexion);
    * ```
    */
   async find_all(connexion) {
      try {
         const query = `
        SELECT * 
        FROM ${this.table} 
        ORDER BY nom
        `;
         const rows = await connexion.query(query);
         // console.log(rows);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   /**
    * ## Retourner tous les items correspondant à la recherche.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @param {Object} object - L'objet contenant les colonnes et les valeurs de recherche.
    * @return {Promise} Une promesse qui contient le résultat de la requête.
    * ---
    * *Exemples :*
    * ```js
    * const object = {id: 1}
    * const model = new DAOModel();
    * model.find(connexion, object);
    * ```
    */
   async find(connexion, object) {
      const columns = Object.keys(object);
      const values = Object.values(object);
      let query = '';
      if (columns.length > 1 && values.length > 1) {
         query = `SELECT * FROM ${this.table} WHERE `;
         for (let i = 0; i < columns.length - 1; i++) {
            if (i < columns.length - 2) {
               query += `${columns[i]} = ? AND `;
            } else {
               query += `${columns[i]} = ? `;
            }
         }
         console.log(query, values);
      } else {
         query = `SELECT * FROM ${this.table} WHERE ${columns} = ?`;
      }

      const result = await connexion.query(query, values);
      console.log(result);
      return result;
   }
   catch(error) {
      console.error('Error deleting article:', error);
      throw error;
   }

   /**
    * ## Ajouter un nouvel item dans la base de données.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @param {Array} values - Un tableau de valeurs pour le nouvel item.
    * @return {Promise} Une promesse qui contient le résultat de la requête.
    * ---
    * *Exemples :*
    * ```js
    * const object = { id: 1, column_1: value_1, column_2: value_2 }
    * const model = new DAOModel();
    * model.create(connexion, object);
    * ```
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
         console.error('Error adding article:', error);
         throw error;
      }
   }

   /**
    * ## Mise à jour d'une ligne dans la base de données.
    * ---
    * @param {Object} connexion - L'objet de connexion.
    * @param {Array} columns - Un tableau de colonnes à mettre à jour.
    * @param {Array} values - Un tableau des valeurs à mettre à jour.
    * @return {Promise} Une promesse qui contient le résultat de la requête.
    * ---
    * *Exemples :*
    * ```js
    * const object = { id: 1, column_3: new_value_3, column_8: new_value_8 }
    * const model = new DAOModel();
    * model.update(connexion, object);
    * ```
    * 
    */
   async update(connexion, object) {
      try {
         const columns = Object.keys(object);
         const values = Object.values(object);

         let query = `UPDATE ${this.table} SET `;
         for (let i = 0; i < columns.length - 1; i++) {
            if (i < columns.length - 2) {
               query += `${columns[i]} = ?, `;
            } else {
               query += `${columns[i]} = ? `;
            }
         }
         query += `WHERE id_article = ?`;

         console.log(query, values);
         const result = await connexion.query(query, values);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error updating article:', error);
         throw error;
      }
   }

   /**
    * ## Supprimer un item dans la base de données.
    *
    * @param {Object} connexion - L'objet de connexion.
    * @param {Object} object - L'objet contenant les colonnes et valeurs à supprimer.
    * @return {Promise} - Une promesse qui contient le résultat de la requête.
    * ---
    * ### *Exemples : Avec une seule colonne*
    * ```js
    * const object = { id: 1 } 
    * // Delete From 'table' 
    * // Where 'id' = 1
    * const model = new DAOModel();
    * model.delete(connexion, object); 
    * ```
    * ---
    * ### *Exemples : Avec plusieurs colonne*
    * ```js
    * const object = { id: 1, col_1: val_1, col_2: val_2 } 
    * // Delete From 'table' 
    * // Where 'id' = 1
    * // AND 'col_1' = val_1
    * const model = new DAOModel();
    * model.delete(connexion, object); 
    * ```
    */
   async delete(connexion, object) {
      try {
         const columns = Object.keys(object);
         const values = Object.values(object);
         let query = '';
         if (columns.length > 1 && values.length > 1) {
            query = `DELETE FROM ${this.table} WHERE `;
            for (let i = 0; i < columns.length - 1; i++) {
               if (i < columns.length - 2) {
                  query += `${columns[i]} = ?, `;
               } else {
                  query += `AND ${columns[i]} = ? `;
               }
            }
            console.log(query, values);
         } else {
            query = `DELETE FROM ${this.table} WHERE ${columns} = ?`;
         }

         const result = await connexion.query(query, values);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error deleting article:', error);
         throw error;
      }
   }

   async deleteAll(connexion) {
      try {
         const query = `
        DELETE FROM ${this.table}
        `;
         const result = await connexion.query(query);
         console.log(result);
         return result;
      } catch (error) {
         console.error('Error deleting article:', error);
         throw error;
      }
   }
}

module.exports = DAOModel;
