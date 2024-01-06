const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/is-auth');

const ConnexionDAO = require('../models/ConnexionDAO');
const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');
const OauthDAO = require('../models/OauthDAO');
const PanierDAO = require('../models/PanierDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');

router.get('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const categorie = req.query.nom;
      const categorieDAO = new CategorieDAO();
      let result = categorie
         ? await categorieDAO.find(connexion, 'nom', categorie)
         : await categorieDAO.find_all(connexion);
      if (result[0].length === 0) {
         res.status(404).json({
            success: false,
            message: 'Categorie non trouvé',
         });
      }
      res.status(200).json({
         success: true,
         message: 'Catégorie trouvée',
         infos: result,
      });
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.get('/articles', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const articleDAO = new ArticleDAO();
      const result = await articleDAO.find_all(connexion);
      res.status(200).json(result[0]);
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});



module.exports = router;
