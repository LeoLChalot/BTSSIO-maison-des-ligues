const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');
const OauthDAO = require('../models/OauthDAO');
const PanierDAO = require('../models/PanierDAO');
const CommandeDAO = require('../models/CommandeDAO');

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
   const id_utilisateur = req.query.id;

   if (id_utilisateur) {
      const panier = await PanierDAO.getPanier(id_utilisateur);
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
});

router.post('/add', async (req, res) => {
   const { articleId, userId } = req.body;

   console.log({ 'article ID': articleId, 'user ID': userId });

   if (!articleId || !userId) {
      return res
         .status(400)
         .json({ msg: "Identifiant de l'article et de l'utilisateur requis" });
   }

   try {
      const panier = await PanierDAO.getPanier(userId);
      console.log({ panier: panier });
      const article = await ArticleDAO.getArticleById(articleId);
      console.log({ article: article });

      const result = await panier.ajouterArticle(article);
      console.log({ "resultat de l'ajout": result });
      res.status(201).json({
         success: true,
         message: 'Article ajouté au panier',
      });
   } catch (error) {
      res.status(500).json({
         message:
            "Une erreur est survenue lors de l'ajout de l'article au panier",
      });
   }
});

router.post('/valider', async (req, res) => {
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
});

module.exports = router;
