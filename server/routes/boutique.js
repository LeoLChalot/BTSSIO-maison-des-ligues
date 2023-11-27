const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const checkArticle = require('../middleware/check-article');
const isAdmin = require('../middleware/is-admin');
const { Categorie, Article } = require('../models/models');

// Affiche toutes les catégories
router.get('/categories', async (req, res) => {
   try {
      const categories = await Categorie.getCategories();
      res.status(200).json(categories);
   } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
   }
});

// POST catégorie
router.post('/categorie', async (req, res) => {
   try {
      const { nom } = req.body;
      await Categorie.addCategory(nom);
      res.status(201).json('Categorie ajoutée !');
   } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).send('Internal Server Error');
   }
});

// DELETE catégorie
router.delete('/categorie', async (req, res) => {
   try {
      const { id_categorie } = req.query;
      await Categorie.deleteCategory(id_categorie);
      res.status(201).json('Categorie supprimée !');
   } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).send('Internal Server Error');
   }
});

// Affiche tous les articles
router.get('/articles', async (req, res) => {
   const query = req.query;
   if (Object.keys(query).length === 0) {
      try {
         const articles = await Article.getAllArticles();
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching articles:', error);
         res.status(500).send('Internal Server Error');
      }
   } else if (
      Object.getOwnPropertyNames(query).filter((prop) => prop == 'id').length ==
      1
   ) {
      try {
         const articles = await Article.getArticleById(req.query.id);
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching article:', error);
         res.status(500).send('Internal Server Error');
      }
   } else if (
      Object.getOwnPropertyNames(query).filter((prop) => prop == 'id_categorie')
         .length == 1
   ) {
      try {
         const articles = await Article.getArticleByCategorieId(
            req.query.id_categorie
         );
         res.status(200).json(articles);
      } catch (error) {
         console.error('Error fetching article:', error);
         res.status(500).send('Internal Server Error');
      }
   }
});

// POST article
router.post('/article', multer, isAdmin, async (req, res) => {
   const article = {
      nom: req.body.nom,
      photo: req.body.photo,
      description: req.body.description,
      prix: req.body.prix,
      quantite: req.body.quantite,
      categorie_id: req.body.categorie_id,
   }
   try {
      const newArticle = await Article.addArticle(article);
      res.status(201).json(newArticle);
   } catch (error) {
      console.error('Error adding article:', error);
      res.status(500).send('Internal Server Error');
   }

});

// PUT article
router.put('/article', checkArticle, isAdmin, async (req, res) => {
   const updatedArticle = {
      id_article: req.body.id_article,
      nom: req.body.nom,
      photo: req.body.photo,
      description: req.body.description,
      prix: req.body.prix,
      quantite: req.body.quantite,
      categorie_id: req.body.categorie_id,
   }
   try {
      const result = await Article.updateArticleById(updatedArticle);
      res.status(201).json(result);
   } catch (error) {
      console.error('Error editing article:', error);
      res.status(500).send('Internal Server Error');
   }
});

// DELETE article
router.delete('/article', isAdmin, async (req, res) => {
   try {
      const { id_article } = req.query;
      await Article.deleteArticleById(id_article);
      res.status(201).json('Article supprimé !');
   } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).send('Internal Server Error');
   }
});

module.exports = router;
