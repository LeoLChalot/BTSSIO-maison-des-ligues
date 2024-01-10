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

router.get('/categories', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      let result;
      const { nom, id } = req.query;
      const categorieDAO = new CategorieDAO();
      console.log(nom);
      if (nom) {
         result = await categorieDAO.find(connexion, 'nom', nom);
         console.log(result);
         if (result[0].length === 0) {
            res.status(404).json({
               success: false,
               message: 'Categorie non trouvé',
            });
            return;
         }
      } else if (id) {
         result = await categorieDAO.find(connexion, 'id_categorie', id);
         if (result[0].length === 0) {
            res.status(404).json({
               success: false,
               message: 'Categorie non trouvé',
            });
            return;
         }
      } else {
         result = await categorieDAO.find_all(connexion);
      }
      res.status(200).json({
         success: true,
         message:
            result[0].length > 1 ? 'Liste des categories' : 'Infos catégorie',
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
      let result;
      const { nom, id_categorie, id_article } = req.query;
      const articleDAO = new ArticleDAO();
      console.log(nom);
      if (nom) {
         result = await articleDAO.find(connexion, 'nom', nom);
         if (result[0].length === 0) {
            res.status(404).json({
               success: false,
               message: 'Article non trouvé',
            });
            return;
         }
      } else if (id_categorie) {
         console.log(id_categorie);
         result = await articleDAO.find(
            connexion,
            'categorie_id',
            id_categorie
         );
         if (result[0].length === 0) {
            console.log({ res: result[0].length });
            res.status(400).json({
               success: false,
               message: 'Article non trouvé',
            });
            return;
         }
      } else if (id_article) {
         result = await articleDAO.find(connexion, 'id_article', id_article);
         if (result[0].length === 0) {
            res.status(404).json({
               success: false,
               message: 'Article non trouvé',
            });
            return;
         }
      } else {
         result = await articleDAO.find_all(connexion);
      }
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
});

module.exports = router;
