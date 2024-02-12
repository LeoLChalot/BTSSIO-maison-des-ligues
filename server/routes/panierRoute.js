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

router.get('/:pseudo',panierController.getCartContent);

router.post('/:pseudo', panierController.addToCart);

router.delete('/:pseudo', async (req, res) => {
   const { pseudo } = req.params;
   if (!pseudo) {
      return res.status(400).json({
         msg: 'Pseudo requis',
      });
   }
   const { id_panier, id_article} = req.query;
   if (id_panier && id_article) {
      panierController.deleteToCart(req, res);
   } else if (id_panier && !id_article) {
      panierController.clearCart(req, res);
   } else {
      return res.status(400).json({
         msg: "Identifiant du panier ou de l'article requis",
      });
   }
});

router.post('/validate/:pseudo', async (req, res) => {
   const { pseudo } = req.params;
   if (!pseudo) {
      return res.status(400).json({
         msg: 'Pseudo requis',
      });
   }
   panierController.validateCart(req, res);
});

module.exports = router;
