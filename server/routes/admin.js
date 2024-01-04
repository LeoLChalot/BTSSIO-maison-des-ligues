const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const auth = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('../models/ConnexionDAO');
const UserDAO = require('./../models/UserDAO');

// router.use(auth);

router.get('/', async (req, res) => {
   try {
      res.status(200).json(req.user);
   } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).send('Internal Server Error');
   }
});

router.get('/user', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { pseudo, email } = req.query;
      if (!pseudo && !email) {
         const users = await UserDAO.getAllUsers(connexion);
         res.status(200).json(users);
      } else if (pseudo) {
         const user = await UserDAO.getUserByPseudo(connexion, pseudo);
         res.status(200).json(user);
      } else if (email) {
         const user = await UserDAO.getUserByEmail(connexion, email);
         res.status(200).json(user);
      } else {
         res.status(401).send('Demande non autorisée');
      }
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
      const { id_utilisateur } = req.body;
      await UserDAO.deleteUserById(connexion, id_utilisateur);
      res.status(201).json('Utilisateur supprimé !');
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

module.exports = router;
