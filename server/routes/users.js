const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserDAO = require('./../models/UserDAO');
const OauthDAO = require('./../models/OauthDAO');
const PanierDAO = require('./../models/PanierDAO');

router.post('/inscription', async (req, res) => {
   const { prenom, nom, pseudo, email, mot_de_passe } = req.body;

   const randomSalt = await bcrypt.genSalt(15);
   const cryptedPassword = await bcrypt.hash(mot_de_passe, randomSalt);

   if (prenom && nom && pseudo && email && mot_de_passe) {
      const user = await UserDAO.createUser(
         prenom,
         nom,
         pseudo,
         email,
         cryptedPassword
      );
      res.status(200).json(user);
   } else {
      res.status(400).end('Informations erronées');
   }
});

router.post('/connexion', async (req, res) => {
   const { login, mot_de_passe } = req.body;

   if (login && mot_de_passe) {
      const user = await UserDAO.login(login, mot_de_passe);
      if (user) {

         // Générer le token d'accès
         const token = OauthDAO.generateAccessToken(user);
         const refreshToken = await OauthDAO.generateRefreshToken(user);

         // Récupérer le panier
         const panier = await PanierDAO.getPanier(user.id_utilisateur);

         console.log({
            msg: 'Connexion OK',
            id_utilisateur: user.id_utilisateur,
            token: token.slice(0, 15) + "...",
            refreshToken: refreshToken.slice(0, 15) + "...",
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
});

router.post('/articlePanier', async (req, res) => {
   const { id_panier, id_article } = req.body;
   console.log(id_panier, id_article);
   if (id_panier && id_article) {
      const panier = await PanierDAO.addArticleToPanier(id_panier, id_article);
      res.status(200).json(panier);
   }
});
router.delete('/articlePanier', async (req, res) => {
   const { id_panier, id_article } = req.body;
   console.log(id_panier, id_article);
   if (id_panier && id_article) {
      const panier = await PanierDAO.deleteArticleFromPanier(
         id_panier,
         id_article
      );
      res.status(200).json(panier);
   }
});

router.post('/confirmPanier', async (req, res) => {
   const { id_panier } = req.body;
   console.log(id_panier);
   if (id_panier) {
      const panier = await PanierDAO.confirmPanier(id_panier);
      res.status(200).json(panier);
   }
});

module.exports = router;
