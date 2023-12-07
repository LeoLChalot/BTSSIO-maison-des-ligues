const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserDAO, PanierDAO } = require('../models/models');

connection.connect((err) => {
   if (err) {
      console.log('Erreur de connexion : ' + err.stack);
      return;
   } else {
      console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
   }
});

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
      const user = await UserDAO.connectUser(login, mot_de_passe);
      if (user) {
         const isAdmin = user.is_admin == true;
         console.log(isAdmin);
         const payload = {
            id: user.id_utilisateur,
            status: isAdmin ? 'admin' : 'user',
         };
         const token = jwt.sign(payload, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '100y', // Set expiration to 100 years
         });

         const panier = await PanierDAO.getPanier(user.id_utilisateur);
         if (panier.length == 0) {
            const panier = await PanierDAO.createPanier(user.id_utilisateur);
         }

         console.log(panier);

         res.status(200).json({
            msg: 'Connexion réussie - Création / Récupération du panier',
            token,
            status: isAdmin ? 'admin' : 'user',
            id_user: user.id_utilisateur,
            id_panier: panier[0].id_panier,
         });
      } else {
         res.status(400).json({ msg: 'Email et mot de passe requis' });
      }
   }
});

router.post('/ajoutPanier', async (req, res) => {
   const { id_panier, id_article } = req.body;
  console.log( id_panier, id_article)
   if (id_panier && id_article) {
      const panier = await PanierDAO.addArticleToPanier(id_panier, id_article);
      res.status(200).json(panier);
   }
})
router.delete('/ajoutPanier', async (req, res) => {
  const { id_panier, id_article } = req.body;
 console.log( id_panier, id_article)
  if (id_panier && id_article) {
     const panier = await PanierDAO.deleteArticleFromPanier(id_panier, id_article);
     res.status(200).json(panier);
  }
})

router.post('/confirmPanier', async (req, res) => {
  const { id_panier } = req.body;
 console.log( id_panier )
  if (id_panier) {
     const panier = await PanierDAO.confirmPanier(id_panier);
     res.status(200).json(panier);
  }
})

module.exports = router;
