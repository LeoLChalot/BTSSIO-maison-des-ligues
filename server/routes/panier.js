const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('../models/ConnexionDAO');
const ArticleDAO = require('../models/ArticleDAO');
const PanierDAO = require('../models/PanierDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');
const CommandeDAO = require('../models/CommandeDAO');
const Panier_ProduitsDAO = require('../models/Panier_ProduitsDAO');

router.get('/:pseudo', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const pseudo = req.params.pseudo;
      if (!pseudo) {
         return res.status(400).json({
            success: false,
            message: "Identifiant de l'utilisateur requis",
         });
      }
      const utilisateur = new UtilisateurDAO();
      const user = await utilisateur.find(connexion, 'pseudo', pseudo);
      if (user[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé',
         });
      }
      const panierDAO = new PanierDAO();
      const result = await panierDAO.find(
         connexion,
         'id_utilisateur',
         user[0][0].id_utilisateur
      );
      if (result[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Panier non trouvé',
         });
      }
      const panier = result[0][0];
      res.status(200).json(panier);
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.get('/detail', async (req, res) => {
   res.send('Détail du panier');
});

router.post('/:pseudo', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { id_panier, id_article, quantity } = req.body;
      if (!id_panier) {
         return res
            .status(400)
            .json({ success: false, message: 'Identifiant du panier requis' });
      }
      if (!id_article) {
         return res.status(400).json({
            success: false,
            message: "Identifiant de l'article requis",
         });
      }
      if (!quantity) {
         return res
            .status(400)
            .json({ success: false, message: "Quantité de l'article requise" });
      }

      const articleDAO = new ArticleDAO();
      const article = await articleDAO.find(
         connexion,
         'id_article',
         id_article
      );
      if (article[0].length === 0) {
         return res
            .status(404)
            .json({ success: false, message: 'Article non trouvée' });
      }

      if (article[0][0].quantite >= quantity) {
         for (let i = 0; i < quantity; i++) {
            const entree_panier = {
               id: uuidv4(),
               id_panier: id_panier,
               id_article: id_article,
            };
            const panier_ProduitsDAO = new Panier_ProduitsDAO();
            const result = await panier_ProduitsDAO.create(
               connexion,
               entree_panier
            );
         }

         const articleDAO = new ArticleDAO();
         const article = await articleDAO.find(
            connexion,
            'id_article',
            id_article
         );
         const updateArticle = {
            quantite: article[0][0].quantite - quantity,
            id_article: article[0][0].id_article,
         };

         const result = await articleDAO.update(connexion, updateArticle);

         res.status(200).json({
            success: true,
            message: 'Articles ajoutés au panier avec succès',
         });
      } else {
         res
            .status(400)
            .json({ success: false, message: 'Quantité insuffisante' });
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

router.delete('/:pseudo', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const {id, id_panier} = req.body
      if(id_panier){

         const panier_ProduitsDAO = new Panier_ProduitsDAO();
         const articleDAO = new ArticleDAO();
         const articles = await panier_ProduitsDAO.find(connexion, 'id_panier', id_panier);
         console.log({articles : articles})

         for (let article of articles[0]) {
            console.log({article : article})
             const original_article = await articleDAO.find(connexion, 'id_article', article.id_article);
             const suppression = await panier_ProduitsDAO.delete(connexion, 'id_article', article.id_article);
             console.log({original_article : original_article[0][0].quantite})
             if (original_article[0].length > 0) {
                 const updateArticle = {
                     quantite: original_article[0][0].quantite + 1,
                     id_article: original_article[0][0].id_article
                 };
                 await articleDAO.update(connexion, updateArticle);
             }
         }
         return res.status(200).json({
            success: true,
            message: 'Tous les articles du panier sont supprimés',
         });
      }

      if (!id) {
         return res.status(400).json({
            success: false,
            message: "Identifiant de l'article requis",
         });
      }

      const panier_ProduitsDAO = new Panier_ProduitsDAO();
      const result = await panier_ProduitsDAO.find(connexion, 'id', id);

      if (result[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: "L'article n'est pas présent dans le panier",
         });
      }

      const articleDAO = new ArticleDAO();
      const article = await articleDAO.find(
         connexion,
         'id_article',
         result[0][0].id_article
      );

      const updateArticle = {
         quantite: article[0][0].quantite + 1,
         id_article: article[0][0].id_article,
      };
      console.log(updateArticle);

      const result1 = await articleDAO.update(connexion, updateArticle);

      const result2 = await panier_ProduitsDAO.delete(connexion, 'id', id);

      res.status(200).json({
         success: true,
         message: 'Produit supprimé du panier avec succès',
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
