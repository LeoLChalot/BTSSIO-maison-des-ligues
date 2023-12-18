const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const UserDAO = require('./../models/UserDAO');

// router.use((req, res, next) => {
//    console.log('Time: ', Date.now());
//    console.log({req})
//    const authorizationHeader = req.headers.authorization;
//    // const contentType = req.header('Content-Type');
//    // console.log({contentType});
//    console.log({authorizationHeader});
//    const errorMessage = (message) =>
//       res.status(401).json({ success: false, message });

//    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
//       return errorMessage('Invalid authorization header');
//    }

//    const token = authorizationHeader.replace('Bearer ', '');
//    if (!token) {
//       return errorMessage('Authorization token not found');
//    }

//    console.log({token: token});

//    try {
//       const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//       req.user = decoded;
//       console.log(req.user);
//       next();
//    } catch (err) {
//       console.error(err);
//       return errorMessage('Oops ! Invalid token');
//    }
// });

router.get('/', async (req, res) => {
   console.log('Time: ', Date.now());
   // console.log({req})
   const authorizationHeader = req.headers.authorization;
   // const contentType = req.header('Content-Type');
   // console.log({contentType});
   console.log({authorizationHeader});
   const errorMessage = (message) =>
      res.status(401).json({ success: false, message });

   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return errorMessage('Invalid authorization header');
   }

   const token = authorizationHeader.replace('Bearer ', '');
   if (!token) {
      return errorMessage('Authorization token not found');
   }

   console.log({token: token});

   try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      console.log(req.user);
      // next();
   } catch (err) {
      console.error(err);
      return errorMessage('Oops ! Invalid token');
   }
   try {
      console.log(req.user);
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
