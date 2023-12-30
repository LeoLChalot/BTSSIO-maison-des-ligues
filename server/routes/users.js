const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ConnexionDAO = require('../models/ConnexionDAO');
const UserDAO = require('./../models/UserDAO');
const OauthDAO = require('./../models/OauthDAO');
const PanierDAO = require('./../models/PanierDAO');

router.post('/inscription', async (req, res) => {
   const { prenom, nom, pseudo, email, mot_de_passe } = req.body;

   const randomSalt = await bcrypt.genSalt(15);
   const cryptedPassword = await bcrypt.hash(mot_de_passe, randomSalt);
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      if (prenom && nom && pseudo && email && mot_de_passe) {
         const user = new UserDAO(prenom, nom, pseudo, email, cryptedPassword);
         user.addUser(connexion);
         res.status(200).json(user);
      } else {
         res.status(400).end('Informations erronées');
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

router.post('/connexion', async (req, res) => {
   const { login, mot_de_passe } = req.body;
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      if (login && mot_de_passe) {
         const user = await UserDAO.login(connexion, login, mot_de_passe);
         if (user) {
            // Générer le token d'accès
            const token = OauthDAO.generateAccessToken(user);
            const refreshToken = await OauthDAO.generateRefreshToken(connexion, user);
            const panier = await PanierDAO.getPanier(connexion, user.id_utilisateur);

            console.log({
               msg: 'Connexion OK',
               id_utilisateur: user.id_utilisateur,
               token: token.slice(0, 15) + '...',
               refreshToken: refreshToken.slice(0, 15) + '...',
               panier: panier,
            });

            res.status(200).json({
               msg: 'Connexion réussie - Création / Récupération du panier',
               token,
               status: user.is_admin ? 'admin' : 'user',
               id_utilisateur: user.id_utilisateur,
               email: user.email,
               pseudo: user.pseudo,
               id_panier: panier.getId(),
            });
         } else {
            res.status(400).json({ msg: 'Email et mot de passe requis' });
         }
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

module.exports = router;
