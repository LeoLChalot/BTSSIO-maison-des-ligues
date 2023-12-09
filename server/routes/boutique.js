const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');

// Affiche toutes les catégories
router.get('/categorie', async (req, res) => {
   const categories = await CategorieDAO.getAllCategories();
   return res.status(200).json(categories);
});

// POST catégorie
router.post('/categorie', async (req, res) => {
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
   try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      if (req.user.status !== 'admin') {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
      try {
         const { nom } = req.body;
         await CategorieDAO.addCategory(nom);
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
   }
});

// DELETE catégorie
router.delete('/categorie', async (req, res) => {
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
   try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      if (req.user.status !== 'admin') {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
      try {
         const { id_categorie } = req.body;
         const categorie = await CategorieDAO.getCategoryById(id_categorie);
         if (id_categorie === undefined) {
            return res
               .status(401)
               .json({ success: false, message: 'no id_category' });
         }
         if (!categorie) {
            return res
               .status(401)
               .json({ success: false, message: 'Categorie not found' });
         }

         await CategorieDAO.deleteCategory(id_categorie);
         res.status(201).json({
            success: true,
            message: 'Categorie supprimée !',
         });
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
   }
});

// Affiche tous les articles
router.get('/article', async (req, res) => {
   console.log(Object.keys(req.body));
   if (Object.keys(req.body).length === 0) {
      try {
         const articles = await ArticleDAO.getAllArticles();
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching articles:', error);
         res.status(500).send('Internal Server Error');
      }
   } else if (
      Object.keys(req.body).length === 1 &&
      Object.keys(req.body)[0] === 'id_article'
   ) {
      try {
         const articles = await ArticleDAO.getArticleById(req.body.id_article);
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching article:', error);
         res.status(500).send('Internal Server Error');
      }
   } else if (
      Object.keys(req.body).length === 1 &&
      Object.keys(req.body)[0] === 'id_categorie'
   ) {
      try {
         const articles = await ArticleDAO.getArticlesByCategoryId(
            req.body.id_categorie
         );
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching article:', error);
         res.status(500).send('Internal Server Error');
      }
   } else {
      res.status(400).json({ message: 'Bad request' });
   }
});

// Créer la route de type POST avec le middleware multer
router.post('/article', async (req, res) => {
   try {
      // Récupérer les données de l'article à partir de la requête
      const { nom, description, prix, quantite, categorie_id } = req.body;

      // Créer un nouvel objet Article avec les données récupérées
      const newArticle = new ArticleDAO(
         uuidv4(),
         nom,
         description,
         prix,
         quantite,
         categorie_id
         // photo: req.file.filename, // Utiliser le nom du fichier téléchargé comme photo de l'article
      );

      console.log(newArticle);

      // Sauvegarder l'article dans la base de données
      if (newArticle.addArticle()) {
         res.status(201).json({
            message: "L'article a été ajouté avec succès",
         });
      } else {
         res.status(500).json({
            message: "Une erreur est survenue lors de l'ajout de l'article",
         });
      }
   } catch (error) {
      res.status(500).json({
         message: "Une erreur est survenue lors de l'ajout de l'article",
      });
   }
});

// PUT article
router.put('/article', async (req, res) => {
   const updatedArticle = {
      id_article: req.body.id_article,
      nom: req.body.nom,
      photo: req.body.photo,
      description: req.body.description,
      prix: req.body.prix,
      quantite: req.body.quantite,
      categorie_id: req.body.categorie_id,
   };
   try {
      const result = await ArticleDAO.updateArticleById(updatedArticle);
      res.status(201).json(result);
   } catch (error) {
      console.error('Error editing article:', error);
      res.status(500).send('Internal Server Error');
   }
});

// DELETE article
router.delete('/article', async (req, res) => {
   try {
      const { id_article } = req.query;
      await ArticleDAO.deleteArticleById(id_article);
      res.status(201).json('Article supprimé !');
   } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).send('Internal Server Error');
   }
});

module.exports = router;
