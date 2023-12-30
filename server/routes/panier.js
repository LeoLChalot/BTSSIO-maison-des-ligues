const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('../models/ConnexionDAO');
const ArticleDAO = require('../models/ArticleDAO');
const PanierDAO = require('../models/PanierDAO');
const CommandeDAO = require('../models/CommandeDAO');

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const id_utilisateur = req.query.id;
      if (id_utilisateur) {
         const panier = await PanierDAO.getPanier(connexion, id_utilisateur);
         if (panier) {
            res.status(200).json({
               msg: 'Récupération réussie du panier',
               panier,
            });
         } else {
            res.status(400).json({
               msg: 'Aucun panier trouvé pour cet utilisateur',
            });
         }
      } else {
         res.status(400).json({ msg: 'Identifiant utilisateur requis' });
      }
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         connexion.disconnect(connexion);
      }
   }
});

router.post('/add', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { articleId, userId } = req.body;
      if (!articleId || !userId) {
         return res.status(400).json({
            msg: "Identifiant de l'article et de l'utilisateur requis",
         });
      }
      const panier = await PanierDAO.getPanier(connexion, userId);
      const article = await ArticleDAO.getArticleById(connexion, articleId);
      const result = await panier.ajouterArticle(connexion, article);
      console.log({ "resultat de l'ajout": result });
      res.status(201).json({
         success: true,
         message: 'Article ajouté au panier',
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
