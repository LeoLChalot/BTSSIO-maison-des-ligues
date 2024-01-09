const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');



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
      let result
      const categorie = req.query.nom;
      const categorieDAO = new CategorieDAO();
      console.log(categorie)
      if (!categorie) {
         result = await categorieDAO.find_all(connexion);
      } else {
         result = await categorieDAO.find(connexion, 'nom', categorie);
         console.log(result)
         if (result[0].length === 0) {
            res.status(404).json({
               success: false,
               message: 'Categorie non trouvé',
            });
            return
         }
      }
      res.status(200).json({
         success: true,
         message: result[0].length > 1 ? 'Liste des categories' : 'Infos catégorie',
         infos: result[0],
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
      let result
      const nom = req.query.nom;
      const articleDAO = new ArticleDAO();
      console.log(articleDAO)
      if (!articleDAO) {
         result = await articleDAO.find_all(connexion);
      } else {
         result = await articleDAO.find(connexion, 'nom', nom);
         if (result[0].length === 0) {
            res.status(404).json({
               success: false,
               message: 'Article non trouvé',
            });
            return
         }
      }
      console.log(result)
      res.status(200).json({
         success: true,
         message: result[0].length > 1 ? 'Liste des articles' : 'Infos article',
         infos: result[0],
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

module.exports = router;
