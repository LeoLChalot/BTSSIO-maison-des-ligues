const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('../models/ConnexionDAO');
const ArticleDAO = require('../models/ArticleDAO');
const PanierDAO = require('../models/PanierDAO');
const UserDAO = require('../models/UserDAO');
const CommandeDAO = require('../models/CommandeDAO');

router.get('/:pseudo', async (req, res) => {
   let connexion;
   // res.send('Ceci est le panier');
   try {
      connexion = await ConnexionDAO.connect();
      const pseudo = req.params.pseudo;
      // res.send('Ceci est le pseudo : ' + pseudo);
      if (pseudo) {
         const user = await UserDAO.getUserByPseudo(connexion, pseudo);
         // res.send('user : ' + user.getPseudo());
         if (user) {
            const id_utilisateur = user.getId();
            // res.send('User Id : ' + id_utilisateur);
            const panier = await PanierDAO.getPanierByUser(
               connexion,
               id_utilisateur
            );
            // res.send('Panier : ' + panier);
            if (panier) {
               res.status(200).json({
                  msg: 'Récupération du panier',
                  panier,
               });
            } else {
               res.status(400).json({
                  msg: 'Aucun panier sélectionné pour cet utilisateur',
               });
            }
         }
      } else {
         res.status(400).json({ msg: 'Identifiant utilisateur requis' });
      }
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.get('/detail', async (req, res) => {
   res.send('Détail du panier');
});

router.post('/add', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { articleId, userId } = req.body;
      if (!articleId || !userId) {
         return res.status(400).json({
            msg: "Identifiant de l'article ou de l'utilisateur requis",
         });
      }
      const panier = await PanierDAO.getPanierByUser(connexion, userId);
      const article = await ArticleDAO.getArticleById(connexion, articleId);
      const ajout = await panier.ajouterArticle(connexion, article);

      console.log({ "resultat de l'ajout": ajout });
      res.status(201).json({
         success: true,
         message: 'Article ajouté au panier',
         article: article,
      });
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/valider', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { id_panier, id_utilisateur } = req.body;
      if (!id_panier) {
         return res.status(400).json({ msg: 'Identifiant du panier requis' });
      }
      const panier = new PanierDAO(id_panier, id_utilisateur);
      panier.confirmPanier();
      if (!panier) {
         return res
            .status(400)
            .json({ msg: 'Erreur lors de la validation du panier' });
      }
      const date = new Date();
      const newCommande = new CommandeDAO(
         id_panier,
         id_utilisateur,
         panier.getTotalPrix(),
         date
      );
      await newCommande.addCommande();
      return res.status(200).json({
         msg: 'Panier validé et commande créée',
         panier: panier,
         commande: newCommande,
      });
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
