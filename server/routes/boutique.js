const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const auth = require('../middleware/is-auth');

const ConnexionDAO = require('../models/ConnexionDAO');
const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');
const OauthDAO = require('../models/OauthDAO');

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
};

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'images');
   },
   filename: function (req, file, cb) {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      cb(null, name + Date.now() + '.' + extension);
   },
});

const upload = multer({ storage: storage });

router.get('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const idcat = req.query.idcat;
      if (!idcat) {
         const categories = await CategorieDAO.getAllCategories(connexion);
         res.status(200).json(categories);
      } else {
         const category = await CategorieDAO.getCategoryById(connexion, idcat);
         if (category) {
            res.status(200).json(category);
         } else {
            res.status(404).json({ message: 'Catégorie non trouvée' });
         }
      }
   } catch (error) {
      res.status(500).json({
         message: 'Erreur lors de la récupération des catégories',
      });
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const authorizationHeader = req.header('Authorization');
      console.log(authorizationHeader);

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
         return res
            .status(401)
            .json({ success: false, message: 'Invalid authorization header' });
      }
      const token = authorizationHeader.replace('Bearer ', '');
      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: 'Authorization token not found' });
      }
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      if (req.user.status !== 'admin') {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
      try {
         const { nom } = req.body;
         const categorie = new CategorieDAO(nom);
         await categorie.addCategory(connexion);
         res.status(201).json('Categorie ajoutée !');
      } catch (error) {
         console.error('Error adding category:', error);
         res.status(500).send('Internal Server Error');
      }
   } catch (err) {
      console.error(err);
      return res.status(401).json({
         success: false,
         message: `Invalid token ${authorizationHeader}`,
      });
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.delete('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      if (OauthDAO.verifyToken(req, res)) {
         const { id_categorie } = req.body;
         const categorie = await CategorieDAO.getCategoryById(
            connexion,
            id_categorie
         );
         if (!categorie) {
            return res
               .status(404)
               .json({ success: false, message: 'Categorie non trouvée' });
         }
         await CategorieDAO.deleteCategory(connexion, id_categorie);
         res.status(201).json({
            success: true,
            message: 'Categorie supprimée !',
         });
      } else {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
   } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.get('/article', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const key = Object.keys(req.query);
      console.log(key);
      connexion = await ConnexionDAO.connect();
      if (key.length === 0) {
         const articles = await ArticleDAO.getAllArticles(connexion);
         res.status(200).json(articles);
      } else if (key.length === 1 && key[0] === 'idart') {
         const article = await ArticleDAO.getArticleById(
            connexion,
            req.query.idart
         );
         res.status(200).json(article);
      } else if (key.length === 1 && key[0] === 'idcat') {
         const articles = await ArticleDAO.getArticlesByCategoryId(
            connexion,
            req.query.idcat
         );
         res.status(200).json(articles);
      } else {
         res.status(400).json({ message: 'Bad request' });
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

router.post('/article', upload.single('photo'), async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const articleData = {
         nom: req.body.nom,
         photo: req.file ? req.file.path : null,
         description: req.body.description,
         prix: req.body.prix,
         quantite: req.body.quantite,
         categorie_id: req.body.categorie,
      };

      // Create article using ArticleDAO
      const createArticle = new ArticleDAO(
         uuidv4(),
         articleData.nom,
         articleData.photo,
         articleData.description,
         articleData.prix,
         articleData.quantite,
         articleData.categorie_id
      );

      const result = await createArticle.addArticle(connexion);
      res.status(201).json({
         success: true,
         message: 'Article ajouté avec succès',
         article: articleData,
         result: result,
      });
   } catch (error) {
      res.status(500).json({
         message: "Une erreur est survenue lors de l'ajout de l'article",
      });
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.put('/article', upload.single('photo'), async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const id = req.query.id;
      if (req.file) {
         articleData.photo = req.file.path;
      }
      // Les informations du formulaire sont disponibles dans req.body
      const articleData = {
         nom: req.body.nom ? req.body.nom : null,
         photo: req.file ? req.file.path : null,
         description: req.body.description ? req.body.description : null,
         prix: req.body.prix ? req.body.prix : null,
         quantite: req.body.quantite ? req.body.quantite : null,
         categorie_id: req.body.categorie_id ? req.body.categorie : null,
      };

      const updatedArticle = await ArticleDAO.getArticleById(connexion, id);
      console.log(updatedArticle);
      if (articleData.nom !== null) {
         updatedArticle.setNom(articleData.nom);
      }
      if (articleData.photo !== null) {
         updatedArticle.setPhoto(articleData.photo);
      }
      if (articleData.description !== null) {
         updatedArticle.setDescription(articleData.description);
      }
      if (articleData.prix !== null) {
         updatedArticle.setPrix(articleData.prix);
      }
      if (articleData.quantite !== null) {
         updatedArticle.setQuantite(articleData.quantite);
      }
      if (articleData.categorie_id !== null) {
         updatedArticle.setCategorie(articleData.categorie_id);
      }

      const result = await updatedArticle.updateArticle(connexion);

      if (result) {
         res.status(201).json({
            success: true,
            message: 'Article mis à jour avec succès',
            article: updatedArticle,
            result: result,
         });
      } else {
         res.status(500).json({
            message:
               "Une erreur est survenue lors de la mise à jour de l'article",
         });
      }
   } catch (error) {
      res.status(500).json({
         message: "Une erreur est survenue lors de l'ajout de l'article",
      });
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.delete('/article/:id', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      let id = req.params.id;
      if (id.startsWith('all-')) {
         id = id.slice(4); // remove 'all-' prefix
         const article = await ArticleDAO.getArticleById(connexion, id);

         if (article) {
            const result = await article.delete(connexion, 'all');
            console.log(result);
            res.status(200).json({
               success: result.success,
               message: result.message,
            });
         } else {
            res.status(404).json({
               message: 'Article avec id ' + id + ' non trouvé',
            });
         }
      } else {
         const article = await ArticleDAO.getArticleById(connexion, id);
         if (article) {
            const result = await article.delete(connexion);
            console.log(result);
            res.status(200).json({
               success: result.success,
               message: result.message,
            });
         } else {
            res.status(404).json({
               message: 'Article avec id ' + id + ' non trouvé',
            });
         }
      }
   } catch (error) {
      res.status(500).json({
         message: "Une erreur est survenue lors de la suppression de l'article",
      });
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

module.exports = router;
