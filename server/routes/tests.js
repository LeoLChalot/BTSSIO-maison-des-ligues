const express = require('express');
const router = express.Router();

const ConnexionDAO = require('../models/ConnexionDAO');
const UtilisateurDAO = require('./../models/UtilisateurDAO');
const OauthDAO = require('./../models/OauthDAO');
const PanierDAO = require('./../models/PanierDAO');

router.get('/', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const users = await UtilisateurDAO.getAllUsers(connexion);
      res.status(200).json(users);
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const pseudo = req.body.pseudo;
      const users = await UtilisateurDAO.getUserByPseudo(connexion, pseudo);
      res.status(200).json(users);
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

module.exports = router;
