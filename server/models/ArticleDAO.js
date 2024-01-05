const ConnexionDAO = require('./ConnexionDAO');

class ArticleDAO {
   /**
    * Constructor pour creer une instance de la classe.
    *
    * @param {uuid} id - Id de l'article (uuid)
    * @param {string} nom - Nom de l'article
    * @param {string} photo - Chemin d'accès à l'image (images/no-image sinon)
    * @param {string} description - Description de l'article
    * @param {float} prix - Prix de l'article
    * @param {int} quantite - Quantite de l'article
    * @param {uuid} categorie_id - Id de la catégorie (uuid)
    */
   constructor(id, nom, photo, description, prix, quantite, categorie_id) {
      this.id_article = id;
      this.nom = nom;
      this.photo = photo ? photo : 'images\\no-image.png';
      this.description = description;
      this.prix = prix;
      this.quantite = quantite;
      this.categorie_id = categorie_id;
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
    * @return {Promise<Array>} - Une promesse sensée retourner un tableau
    *                            d'objets.
    * @throws {Error} - A retourner en cas de problème lors de la requête
    */
   static async get(db_column, value) {
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

   /**
    * Ajouter un article dans la base de données.
    * ---
    * @param {Array} values - Tableau de valeurs à insérer dans la table.
    * @return {type} Résultat de la requête.
    */
   static async add([values]) {
      try {
         const query = `
         INSERT INTO articles (
            id_article, 
            nom, 
            photo, 
            description, 
            prix, 
            quantite, 
            categorie_id
            ) 
         VALUES(?, ?, ?, ?, ?, ?, ?)
         `;
         const result = await ConnexionDAO.query(query, values);
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
    *                         Les valeurs doivent être dans l'ordre suivant:
    *                         [nom, photo, description, prix,
    *                         quantite, categorie_id, id_article]
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
   static async update([values]) {
      try {
         const query = `
         UPDATE articles 
         SET nom = ?, 
         photo = ?, 
         description = ?, 
         prix = ?, 
         quantite = ?, 
         categorie_id = ? 
         WHERE id_article = ?
         `;
         const result = await ConnexionDAO.query(query, values);
         return result;
      } catch (error) {
         console.error('Error updating article:', error);
         throw error;
      }
   }

   /**
    * Supprimer un article de la base de données.
    *
    * @param {type} uuid - La valeur de l'identifiant unique à supprimer.
    * @return {type} result - Le résultat de la requête.
    */
   static async delete(uuid) {
      {
         try {
            const query = `
         DELETE FROM articles 
         WHERE id_article = ?
         `;
            const result = await ConnexionDAO.query(query, [uuid]);
            return result;
         } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
         }
      }
   }
}

module.exports = ArticleDAO;
