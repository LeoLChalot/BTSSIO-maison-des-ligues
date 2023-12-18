const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const UserDAO = require('./../models/UserDAO');

router.use(auth);

router.get('/', async (req, res) => {
   try {
      res.status(200).json(req.user);
   } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).send('Internal Server Error');
   }
});

router.get('/user', async (req, res) => {
   const { pseudo, email } = req.query;
   if (!pseudo && !email) {
      const users = await UserDAO.getAllUsers();
      res.status(200).json(users);
   } else if (pseudo) {
      const user = await UserDAO.getUserByPseudo(pseudo);
      res.status(200).json(user);
   } else if (email) {
      const user = await UserDAO.getUserByEmail(email);
      res.status(200).json(user);
   } else {
      res.status(401).send('Demande non autorisée');
   }
});

router.delete('/user', async (req, res) => {
   const { id_utilisateur } = req.body;
   await UserDAO.deleteUserById(id_utilisateur);
   res.status(201).json('Utilisateur supprimé !');
});

module.exports = router;
