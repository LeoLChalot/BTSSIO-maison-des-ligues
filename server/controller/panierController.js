const ConnexionDAO = require('../models/ConnexionDAO');
const ArticleDAO = require('../models/ArticleDAO');
const PanierDAO = require('../models/PanierDAO');
const Articles_StandbyDAO = require('../models/Articles_StandbyDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');
const CommandeDAO = require('../models/CommandeDAO');
const Panier_ProduitsDAO = require('../models/Panier_ProduitsDAO');
const Details_CommandesDAO = require('../models/Details_CommandesDAO');

const { v4: uuidv4 } = require('uuid');

const UTILISATEUR_DAO = new UtilisateurDAO();
const PANIER_DAO = new PanierDAO();
const PANIER_PRODUITS_DAO = new Panier_ProduitsDAO();
const ARTICLES_DAO = new ArticleDAO();

/**
 * Retrieves the content of a user's shopping cart based on the provided pseudo.
 *
 * @param {Object} req - The request object containing parameters
 * @param {Object} res - The response object
 * @return {Object} JSON response with cart content or error message
 */
exports.getCartContent = async (req, res) => {
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

      const findWithPseudo = {
         pseudo: pseudo,
      };

      const utilisateur = await UTILISATEUR_DAO.find(
         connexion,
         findWithPseudo
      );

      if (utilisateur.length == 0) {
         return res.status(404).json({
            success: false,
            message: 'Utilisateur introuvable',
         });
      }

      const findWithIdUtilisateur = {
         id_utilisateur: utilisateur[0][0].id_utilisateur,
      };

      const panierData = await PANIER_DAO.find(
         connexion,
         findWithIdUtilisateur
      );

      console.log({ panier: panierData[0] });

      if (panierData.length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Panier non trouvé',
         });
      }

      const findWithIdPanier = panierData[0][0].id_panier;

      const articlesData = await PANIER_PRODUITS_DAO.find_and_group(
         connexion,
         findWithIdPanier
      );

      console.log({ articles: articlesData[0][0] });

      const panier = {
         id_panier: panierData[0][0].id_panier,
         pseudo: pseudo,
         articles: articlesData[0],
      };

      res.status(200).json({
         success: true,
         message: 'Contenu du panier',
         infos: {
            panier: panier,
         },
      });
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      ConnexionDAO.disconnect();
   }
};

/**
 * Function to add an item to the shopping cart.
 *
 * @param {Object} req - The request object containing parameter **idPanier**, **id_article** and **quantite**.
 * @param {Object} res - The response object.
 * @return {Object} JSON response indicating success or failure of adding the item to the cart.
 */
exports.addToCart = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const id_panier = req.params.id_panier;
      const { id_article, quantite } = req.body;


      if (!id_panier) return res.status(400).json({
         success: false,
         message: 'Identifiant du panier requis',
      });

      if (!id_article) return res.status(400).json({
         success: false,
         message: "Identifiant de l'article requis",
      });

      if (quantite == 0 || quantite < 0) {
         quantite = 1;
      }

      const findWithIdArticle = {
         id_article: id_article,
      };

      // ? Trouver l'article
      const article = await ARTICLES_DAO.find(
         connexion,
         findWithIdArticle
      );

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
            const result = await PANIER_PRODUITS_DAO.create(
               connexion,
               new_panier_produit
            );

            if (result[0].length === 0) {
               return res.status(404).json({
                  success: false,
                  message: 'Une erreur est survenue',
               });
            }
         }

         // ? Mettre à jour la quantité
         const updateArticle = {
            quantite: article[0][0].quantite - quantite,
            id_article: article[0][0].id_article,
         };

         const miseAJourQuantite = await ARTICLES_DAO.update(
            connexion,
            updateArticle
         );

         return res.status(200).json({
            success: true,
            message: quantite > 1 ? 'Articles ajoutés au panier avec succès' : 'Article ajouté au panier avec succès',
         });
      } else {
         return res.status(404).json({
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

/**
 * Clear the cart by removing all the items and updating the stock quantities.
 *
 * @param {Object} req - the request object with the **idPanier**
 * @param {Object} res - the response object
 * @return {Object} the response object with the status and message
 */
exports.clearCart = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const id_panier = req.params.id_panier;
      console.log({ id_panier: id_panier });

      // ? Veiller d'avoir l'ID du panier
      if (!id_panier) return res.status(400).json({
         success: false,
         message: 'Identifiant du panier requis',
      });

      const findWithIdPanier = {
         id_panier: id_panier,
      };

      // ? Trouver les articles du panier
      const articles = await PANIER_PRODUITS_DAO.find(
         connexion,
         findWithIdPanier
      );

      // ? Supprimer les articles du panier
      for (let article of articles[0]) {
         const findWithIdArticle = {
            id_article: article.id_article,
         };

         // ? Récupérer les informations de l'article
         const original_article = await ARTICLES_DAO.find(
            connexion,
            findWithIdArticle
         );

         //  ? Supprimer l'article de la table panier_produits
         const deletionData = await PANIER_PRODUITS_DAO.delete(
            connexion,
            findWithIdArticle
         );

         // ? Mettre à jour la quantité dans les stocks
         if (deletionData) {
            const updateArticle = {
               quantite: original_article[0][0].quantite + 1,
               id_article: original_article[0][0].id_article,
            };
            await ARTICLES_DAO.update(connexion, updateArticle);
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

/**
 * Delete an item from the cart and update stock quantity accordingly.
 *
 * @param {Object} req - the request object containing query parameter **id_article**
 * @param {Object} res - the response object to send back
 * @return {Object} JSON response indicating success or failure
 */
exports.deleteToCart = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const id_panier = req.params.id_panier;
      const { id_article } = req.query;

      const findWithId = {
         id_article: id_article,
      };

      // ! Envoyer une erreur s'il manque l'ID
      if (!id_panier || !id_article) {
         return res.status(400).json({
            success: false,
            message: 'Identifiant requis',
         });
      }

      // ? Trouver l'article dans la table panier_produits
      const result = await PANIER_PRODUITS_DAO.find(
         connexion,
         findWithId
      );

      // ! Si l'article n'est pas présent dans le panier
      if (result[0].length === 0) return res.status(404).json({
         success: false,
         message: "L'article n'est pas présent dans le panier",
      });

      const original_article = {
         id_article: result[0][0].id_article,
      };

      // ? Récupérer les informations de l'article
      const article = await ARTICLES_DAO.find(
         connexion,
         original_article
      );
      // ? Supprimer l'article de la table panier_produits
      const updateArticle = {
         quantite: article[0][0].quantite + 1,
         id_article: id_article,
      };
      const findWithIdPanier = {
         id_panier: id_panier,
         id_article: id_article,
      };

      await PANIER_PRODUITS_DAO.delete(connexion, findWithIdPanier);
      // ? Mettre à jour la quantité dans les stocks
      await ARTICLES_DAO.update(connexion, updateArticle);

      return res.status(200).json({
         success: true,
         message: 'Produit supprimé du panier avec succès',
      });

   } catch (error) {
      console.error('Error connecting to database:', error);
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

exports.validateCart = async (req, res) => {
   if (!req.params.pseudo) return res.status(400).json({
      success: false,
      message: 'Identifiant de l\'utilisateur requis',
   });
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { pseudo } = req.params;

      const utilisateurDAO = new UtilisateurDAO();
      const panierDAO = new PanierDAO();
      const panier_ProduitsDAO = new Panier_ProduitsDAO();
      const commandeDAO = new CommandeDAO();
      const details_CommandesDAO = new Details_CommandesDAO();
      let prix = 0;
      const findUtilisateurWithPseudo = {
         pseudo: pseudo,
      };

      const utilisateurData = await utilisateurDAO.find(
         connexion,
         findUtilisateurWithPseudo
      );

      console.log({ result: utilisateurData[0][0].id_utilisateur });
      const email = utilisateurData[0][0].email;

      const findPanierWithIdUtilisateur = {
         id_utilisateur: utilisateurData[0][0].id_utilisateur,
      };

      const panierData = await panierDAO.find(
         connexion,
         findPanierWithIdUtilisateur
      );

      if (panierData[0].length === 0) {
         return res.status(404).json({
            success: false,
            message: "Le panier n'existe pas",
         });
      }

      const findArticleWithIdPanier = panierData[0][0].id_panier;
      const articlesData = await panier_ProduitsDAO.find_and_group(
         connexion,
         findArticleWithIdPanier
      );

      console.log({ "articlesData": articlesData[0] });

      const listeArticles = articlesData[0];
      for (let i = 0; i < listeArticles.length; i++) {
         console.log({ "listeArticles[i]": listeArticles[i] });
         const panierId = listeArticles[i].id_panier;
         const articleId = listeArticles[i].id_article;
         const quantite = listeArticles[i].quantite_articles;
         prix += listeArticles[i].prix_unite * quantite;
         const article_commande = {
            id: uuidv4(),
            email: email,
            id_commande: panierId,
            id_article: articleId,
            quantite: quantite,
         };
         const findWithIdArticle = {
            id_article: articleId,
            id_panier: panierId,
         };
         details_CommandesDAO.create(connexion, article_commande);

         for (let j = 0; j < quantite; j++) {
            await panier_ProduitsDAO.delete(
               connexion,
               findWithIdArticle
            );
         }

      }

      console.log({ prix: prix, id_panier: listeArticles[0].id_panier });

      const commande = {
         id: uuidv4(),
         id_utilisateur: utilisateurData[0][0].id_utilisateur,
         id_commande: listeArticles[0].id_panier,
         prix_commande: prix
      };

      const result = await commandeDAO.create(connexion, commande);

      console.log(result)

      res.status(200).json({
         success: true,
         message: 'Panier validé',
      });
   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      ConnexionDAO.disconnect();
   }
};


exports.articleStandBy = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const panier_ProduitsDAO = new Panier_ProduitsDAO();
      const articles_standbyDAO = new Articles_StandbyDAO();

      const { id_panier } = req.params;
      const { id_article } = req.body;

      if (id_panier && id_article) {
         const findWithIdArticle = { id_article: id_article };

         const findWithIdPanierAndIdArticle = {
            id_panier: id_panier,
            id_article: id_article
         };

         const article_panier = await panier_ProduitsDAO.find(
            connexion,
            findWithIdArticle
         );

         if (article_panier[0].length === 0) {
            res.status(404).json({
               success: false,
               message: "Cet article n'existe pas dans le panier",
            });
            return;
         }

         if (article_panier[0].length > 0) {
            for (let i = 0; i < article_panier[0].length; i++) {
               const article_standby = {
                  id: uuidv4(),
                  id_panier: id_panier,
                  id_article: id_article,
               }

               articles_standbyDAO.create(connexion, article_standby);
               panier_ProduitsDAO.delete(connexion, findWithIdPanierAndIdArticle);
            }
         }

         res.status(200).json({
            success: true,
            message: 'Article ajouté aux articles non soldés',
         });


      }

   } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      ConnexionDAO.disconnect();
   }
};

exports.getArticleStandby = async (req, res) => {
   try {
      const connexion = await ConnexionDAO.connect();
      const article_standbyDAO = new Articles_StandbyDAO();
      const result = await article_standbyDAO.find_and_group(connexion);
      res.status(200).json({
         success: true,
         data: result,
      });
   } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
   } finally {
      ConnexionDAO.disconnect();
   }
};
