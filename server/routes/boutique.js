const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const auth = require('../middleware/auth');

const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');
const OauthDAO = require('../models/OauthDAO');

// GET categories or single category by id
router.get('/categorie', async (req, res) => {
   const idcat = req.query.idcat;

   if (!idcat) {
      // Get all categories if no idcat is specified
      try {
         const categories = await CategorieDAO.getAllCategories();
         res.status(200).json(categories);
      } catch (error) {
         res.status(500).json({
            message: 'Erreur lors de la récupération des catégories',
         });
      }
   } else {
      // Get single category by id if idcat is specified
      try {
         console.log({ idcategory: idcat });
         const category = await CategorieDAO.getCategoryById(idcat);
         if (category) {
            res.status(200).json(category);
         } else {
            res.status(404).json({ message: 'Catégorie non trouvée' });
         }
      } catch (error) {
         res.status(500).json({
            message: 'Erreur lors de la récupération de la catégorie',
         });
      } 
   }
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
         const categorie = new CategorieDAO(nom);
         await categorie.addCategory();
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
   if (OauthDAO.verifyToken(req, res)) {
      try {
         const { id_categorie } = req.body;
         const categorie = await CategorieDAO.getCategoryById(id_categorie);
         if (!categorie) {
            return res
               .status(404)
               .json({ success: false, message: 'Categorie non trouvée' });
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
   } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
   }
});

// Affiche tous les articles
router.get('/article', async (req, res) => {
   console.log(req.query);
   const key = Object.keys(req.query);
   console.log(key);
   if (key.length === 0) {
      console.log('all');
      try {
         const articles = await ArticleDAO.getAllArticles();
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching articles:', error);
         res.status(500).send('Internal Server Error');
      }
   } else if (key.length === 1 && key[0] === 'idart') {
      console.log('idart');
      try {
         const article = await ArticleDAO.getArticleById(req.query.idart);
         res.status(200).json(article);
      } catch (error) {
         console.error('Error fetching article:', error);
         res.status(500).send('Internal Server Error');
      }
   } else if (key.length === 1 && key[0] === 'idcat') {
      console.log('idcat');
      try {
         const articles = await ArticleDAO.getArticlesByCategoryId(
            req.query.idcat
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

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
};
// Définir le dossier de destination pour les images téléchargées
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

// Créer la route de type POST avec le middleware multer
router.post('/article', upload.single('photo'), async (req, res) => {
   try {
      // console.log({ body: req.body });
      console.log(req.file);

      // if (req.file) {
      //    articleData.photo = req.file.path;
      // }
      // Les informations du formulaire sont disponibles dans req.body
      
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

      const result = await createArticle.addArticle();
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
   }
});

// PUT article
router.put('/article', upload.single('photo'), async (req, res) => {
   const id = req.query.id;
   try {
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

      const updatedArticle = await ArticleDAO.getArticleById(id);
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

      const result = await updatedArticle.updateArticle();

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
   }
});

// DELETE article
router.delete('/article/:id', async (req, res) => {
   let id = req.params.id;

   try {
      if (id.startsWith('all-')) {
         id = id.slice(4); // remove 'all-' prefix
         const article = await ArticleDAO.getArticleById(id);

         if (article) {
            const result = await article.delete('all');
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
         const article = await ArticleDAO.getArticleById(id);
         if (article) {
            const result = await article.delete();
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
   }
});

module.exports = router;
