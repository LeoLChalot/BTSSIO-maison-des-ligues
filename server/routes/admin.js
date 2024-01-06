const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('../models/ConnexionDAO');
const UtilisateurDAO = require('./../models/UtilisateurDAO');
const CategorieDAO = require('./../models/CategorieDAO');

// router.use(auth);

router.get('/', async (req, res) => {
   try {
      res.status(200).json(req.user);
   } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).send('Internal Server Error');
   }
});

router.post('/user', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const login = req.body.login
      let result
      const utilisateurDAO = new UtilisateurDAO();

      if (!login) {
         result = await utilisateurDAO.find_all(connexion);
         res.status(200).json(result[0]);
         return
      }
      result = await utilisateurDAO.find(connexion, 'pseudo', login);
      if (result[0].length === 0) {
         result = await utilisateurDAO.find(connexion, 'email', login);
      }
      if (result[0].length === 0) {
         res.status(404).json({
            message: 'Utilisateur non trouvé',
         });
         return
      }
      res.status(200).json(result[0][0]);
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.delete('/user', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { pseudo } = req.body;
      const utilisateurDAO = new UtilisateurDAO();
      const user = await utilisateurDAO.find(connexion, 'pseudo', pseudo);
      if(user[0].length === 0) {
         res.status(404).json({
            message: 'Utilisateur non trouvé',
         });
         return
      }
      const result = await utilisateurDAO.delete(connexion, 'pseudo', pseudo);
      res.status(200).json(result);      
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const authorizationHeader = req.header('Authorization');
      console.log(authorizationHeader);

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
         return res
            .status(401)
            .json({ success: false, message: 'Invalid authorization header' });
      }
      const token = authorizationHeader.replace('Bearer ', '');
      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: 'Authorization token not found' });
      }
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      if (req.user.status !== 'admin') {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
      try {
         const { nom } = req.body;
         const categorie = new CategorieDAO(nom);
         await categorie.addCategory(connexion);
         res.status(201).json('Categorie ajoutée !');
      } catch (error) {
         console.error('Error adding category:', error);
         res.status(500).send('Internal Server Error');
      }
   } catch (err) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.delete('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      if (OauthDAO.verifyToken(req, res)) {
         const { id_categorie } = req.body;
         const categorie = await CategorieDAO.getCategoryById(
            connexion,
            id_categorie
         );
         if (!categorie) {
            return res
               .status(404)
               .json({ success: false, message: 'Categorie non trouvée' });
         }
         await CategorieDAO.deleteCategory(connexion, id_categorie);
         res.status(201).json({
            success: true,
            message: 'Categorie supprimée !',
         });
      } else {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
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
