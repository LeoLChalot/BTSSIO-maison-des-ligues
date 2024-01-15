const ConnexionDAO = require('../models/ConnexionDAO');
const ArticleDAO = require('../models/ArticleDAO');
const PanierDAO = require('../models/PanierDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');
const CommandeDAO = require('../models/CommandeDAO');
const Panier_ProduitsDAO = require('../models/Panier_ProduitsDAO');

const { v4: uuidv4 } = require('uuid');

exports.getCartContent = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      // ? On initialise les modèles DAO à utiliser
      const utilisateurDAO = new UtilisateurDAO();
      const panierDAO = new PanierDAO();
      const panier_produitDAO = new Panier_ProduitsDAO();

      const pseudo = req.params.pseudo;
      if (!pseudo) {
         return res.status(400).json({
            success: false,
            message: "Identifiant de l'utilisateur requis",
         });
      }

      const findWithPseudo = { pseudo: pseudo };

      // ? Trouver l'utilisateur
      const utilisateurData = await utilisateurDAO.find(
         connexion,
         findWithPseudo
      );
      if (utilisateurData[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé',
         });
      }
      const findWithIdUtilisateur = {
         id_utilisateur: utilisateurData[0][0].id_utilisateur,
      };

      // ? Trouver le panier
      const panierData = await panierDAO.find(connexion, findWithIdUtilisateur);
      const findWithIdPanier = {
         id_panier: panierData[0][0].id_panier,
      };

      // ? Trouver les articles du panier
      const articlesData = await panier_produitDAO.find(
         connexion,
         findWithIdPanier
      );

      if (articlesData[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Panier non trouvé',
         });
      }

      const panier = {
         id_panier: panierData[0][0].id_panier,
         pseudo: pseudo,
         articles: articlesData[0],
      };

      res.status(200).json({
         utilisateurData: utilisateurData[0][0],
         panierData: panierData[0][0],
         articlesData: articlesData[0],
      });
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

exports.addToCart = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const articleDAO = new ArticleDAO();
      const panier_ProduitsDAO = new Panier_ProduitsDAO();

      const { id_panier, id_article, quantite } = req.body;

      console.log({
         id_panier,
         id_article,
         quantite,
      });

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
      if (!quantite) {
         return res.status(400).json({
            success: false,
            message: "Quantité d'articles requise",
         });
      }

      const findWithIdArticle = {
         id_article: id_article,
      };

      // ? Trouver l'article
      const article = await articleDAO.find(connexion, findWithIdArticle);

      // ? Veiller d'avoir l'article en boutique
      if (article[0].length === 0) {
         return res
            .status(404)
            .json({ success: false, message: 'Article non trouvée' });
      }

      // ? Veiller d'avoir suffisamment d'articles
      if (article[0][0].quantite >= quantite) {
         for (let i = 0; i < quantite; i++) {
            const new_panier_produit = {
               id: uuidv4(),
               id_panier: id_panier,
               id_article: id_article,
            };

            // ? Ajouter le produit à la table panier_produits
            const result = await panier_ProduitsDAO.create(
               connexion,
               new_panier_produit
            );

            if (result[0].length === 0) {
               return res.status(500).json({
                  success: false,
                  message: 'Une erreur est survenue',
               });
            }
         }

         // ? Mettre à jour la quantité
         const article = await articleDAO.find(connexion, findWithIdArticle);
         const updateArticle = {
            quantite: article[0][0].quantite - quantite,
            id_article: article[0][0].id_article,
         };

         const miseAJourQuantite = await articleDAO.update(
            connexion,
            updateArticle
         );

         res.status(200).json({
            success: true,
            message: 'Articles ajoutés au panier avec succès',
         });
      } else {
         res.status(400).json({
            success: false,
            message: 'Quantité insuffisante',
         });
      }
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

exports.clearCart = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const panier_ProduitsDAO = new Panier_ProduitsDAO();
      const articleDAO = new ArticleDAO();

      const { id_panier } = req.body;

      // ? Veiller d'avoir l'ID du panier
      if (!id_panier) {
         return res.status(400).json({
            success: false,
            message: 'Identifiant du panier requis',
         });
      }

      const findWithIdPanier = {
         id_panier: id_panier,
      };

      // ? Trouver les articles du panier
      const articles = await panier_ProduitsDAO.find(
         connexion,
         findWithIdPanier
      );

      // ? Supprimer les articles du panier
      for (let article of articles[0]) {
         const findWithIdArticle = {
            id_article: article.id_article,
         };

         // ? Récupérer les informations de l'article
         const original_article = await articleDAO.find(
            connexion,
            findWithIdArticle
         );

         //  ? Supprimer l'article de la table panier_produits
         const deletionData = await panier_ProduitsDAO.delete(
            connexion,
            findWithIdArticle
         );

         // ? Mettre à jour la quantité dans les stocks
         if (deletionData) {
            const updateArticle = {
               quantite: original_article[0][0].quantite + 1,
               id_article: original_article[0][0].id_article,
            };
            await articleDAO.update(connexion, updateArticle);
         }
      }
      return res.status(200).json({
         success: true,
         message: 'Tous les articles du panier sont supprimés',
      });
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

exports.deleteToCart = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const panier_ProduitsDAO = new Panier_ProduitsDAO();
      const articleDAO = new ArticleDAO();

      const { id, id_panier } = req.body;

      if (!id && !id_panier) {
         return res.status(400).json({
            success: false,
            message: "Identifiant de l'article ou du panier requis",
         });
      }

      if (id_panier) {
         const findWithIdPanier = {
            id_panier: id_panier,
         };

         const articles = await panier_ProduitsDAO.find(
            connexion,
            findWithIdPanier
         );

         for (let article of articles[0]) {
            const findWithIdArticle = {
               id_article: article.id_article,
            };
            const original_article = await articleDAO.find(
               connexion,
               findWithIdArticle
            );
            await panier_ProduitsDAO.delete(connexion, findWithIdArticle);
            if (original_article[0].length > 0) {
               const updateArticle = {
                  quantite: original_article[0][0].quantite + 1,
                  id_article: original_article[0][0].id_article,
               };
               await articleDAO.update(connexion, updateArticle);
            }
         }
         return res.status(200).json({
            success: true,
            message: 'Tous les articles du panier sont supprimés',
         });
      }

      const requestArticle = {
         id: id,
      };

      const result = await panier_ProduitsDAO.find(connexion, requestArticle);

      if (result[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: "L'article n'est pas présent dans le panier",
         });
      }

      const original_article = {
         id_article: result[0][0].id_article,
      };

      const article = await articleDAO.find(connexion, original_article);

      const updateArticle = {
         quantite: article[0][0].quantite + 1,
         id_article: article[0][0].id_article,
      };

      await articleDAO.update(connexion, updateArticle);

      const article_a_supprimer = {
         id: id,
      };

      await panier_ProduitsDAO.delete(connexion, article_a_supprimer);

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
};
