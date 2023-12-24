const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');


const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');
const OauthDAO = require('../models/OauthDAO');
const PanierDAO = require('../models/PanierDAO');
const CommandeDAO = require('../models/CommandeDAO');


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
      res.status(400).json({ msg: 'Aucun panier trouvé pour cet utilisateur' });
    }
  } else {
    res.status(400).json({ msg: 'Identifiant utilisateur requis' });
  }
});

router.post('/validate', async (req, res) => {
  const id_panier = req.body.id_panier;
  const id_utilisateur = req.body.id_utilisateur;

  if (id_panier) {
    // Update the "waiting" value to "ordered" in the basket
    const panier = await PanierDAO.confirmPanier(id_panier);

    // Create a new entry in the orders table
    const date = new Date();
    const newCommande = new CommandeDAO(id_panier,  id_utilisateur, panier.getTotalPrix(), date);
    newCommande.addCommande();

    if (panier && newCommande) {
      res.status(200).json({
        msg: 'Panier validé et commande créée',
        panier: panier,
        commande: newCommande,
      });
    } else {
      res.status(400).json({ msg: 'Erreur lors de la validation du panier ou de la création de la commande' });
    }
  } else {
    res.status(400).json({ msg: 'Identifiant du panier requis' });
  }
});




module.exports = router;
