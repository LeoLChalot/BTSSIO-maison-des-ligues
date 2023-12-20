const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const CategorieDAO = require('../models/CategorieDAO');
const ArticleDAO = require('../models/ArticleDAO');

// GET categories or single category by id
router.get('/categorie', async (req, res) => {
   const idcat = req.query.idcat;

   if (!idcat) {
      // Get all categories if no idcat is specified
      try {
         const categories = await CategorieDAO.getAllCategories();
         res.status(200).json(categories);
      } catch (error) {
         res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
      }
   } else {
      // Get single category by id if idcat is specified
      try {
         console.log({idcategory : idcat});
         const category = await CategorieDAO.getCategoryById(idcat);
         if (category) {
            res.status(200).json(category);
         } else {
            res.status(404).json({ message: 'Catégorie non trouvée' });
         }
      } catch (error) {
         res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie' });
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
router.post('/article', upload.single('photo'), (req, res) => {
   try {
      // Les informations du formulaire sont disponibles dans req.body
      const articleData = {
         id_article: uuidv4(),
         nom: req.body.nom,
         description: req.body.description,
         prix: req.body.prix,
         quantite: req.body.quantite,
         categorie_id: req.body.categorie,
         // Le chemin du fichier image dans req.file
         photo: req.file.path,
      };

      // Create article using ArticleDAO
      const createArticle = new ArticleDAO(
         articleData.id_article,
         articleData.nom,
         articleData.photo,
         articleData.description,
         articleData.prix,
         articleData.quantite,
         articleData.categorie_id
      );
      console.log(createArticle);
      if (createArticle) {
         createArticle.addArticle();
         res.status(201).json({
            success: true,
            message: 'Article ajouté avec succès',
            article: articleData,
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
router.delete('/article/:id', async (req, res) => {
   try {
      const { id } = req.params;
      await ArticleDAO.deleteArticle(id);
      res.status(201).json('Article supprimé !');
   } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).send('Internal Server Error');
   }
});

module.exports = router;
