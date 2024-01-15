const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

const cookieJwtAuth = require('../middleware/auth-jwt');

const ConnexionDAO = require('../models/ConnexionDAO');
const ArticleDAO = require('../models/ArticleDAO');
const PanierDAO = require('../models/PanierDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');
const CommandeDAO = require('../models/CommandeDAO');
const Panier_ProduitsDAO = require('../models/Panier_ProduitsDAO');

const authenticator = require('../middleware/jwt-authentication');
const panierController = require('../controller/panierController');

// router.use(authenticator.auth);

router.get('/:pseudo', panierController.getCartContent, async (req, res) => {
   console.log(req.cookies);
   res.send('ok');
});

router.post('/:pseudo', panierController.addToCart, async (req, res) => {
   console.log(req.cookies);
   res.send('ok');
});

router.delete('/:pseudo', async (req, res) => {
   const { id, id_panier } = req.body;
   if (id) {
      panierController.deleteToCart(req, res);
   } else if (id_panier) {
      panierController.clearCart(req, res);
   } else {
      return res
         .status(400)
         .json({ msg: "Identifiant du panier ou de l'article requis" });
   }
});

router.post('/', async (req, res) => {
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
