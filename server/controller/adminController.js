const ConnexionDAO = require('../models/ConnexionDAO');
const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');


exports.getAllUsers = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};


exports.getUserByPseudo = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};


exports.getUserById = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

/**
 * ## Retourne la liste des articles
 *
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de résponse.
 * @return {Promise<void>} - Une promesse qui contient le résultat.
 */
exports.getAllArticles = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const articleDAO = new ArticleDAO();
      const result = await articleDAO.find_all(connexion);
      res.status(200).json({
         success: true,
         message: result[0].length > 1 ? 'Liste des articles' : 'Infos article',
         infos: result[0],
      });
      return;
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

/**
 * Retourne l'article en fonction de son identifiant
 *
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @return {Promise<void>} - Une promesse qui contient le résultat.
 */
exports.getArticleById = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

/**
 * Retourne l'article en fonction de son nom
 *
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @return {Promise<void>} - Une promesse qui contient le résultat.
 */
exports.getArticleByName = async (req, res) => {
  let connexion
   try {
      connexion = await ConnexionDAO.connect();

   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

/**
 * Retourne la liste des articles en fonction de la catégorie.
 *
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @returns {Promise<void>} Une promesse qui contient la liste des articles.
 */
exports.getArticlesByIdCategory = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};
