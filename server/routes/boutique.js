const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const checkArticle = require('../middleware/check-article');
const connection = require('../database/connexion');
const isAdmin = require('../middleware/is-admin');

connection.connect((err) => {
   if (err) {
      console.log('Erreur de connexion : ' + err.stack);
      return;
   } else {
      console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
   }
});

// * Obtient toutes les catégories de la table "categories"
router.get('/categories', async (req, res) => {
   try {
      const sql = 'SELECT * FROM categories';
      const data = await connection.promise().query(sql);
      const categories = data[0];
      res.status(200).send(categories);
   } catch (error) {
      console.error('Error retrieving categories:', error);
      throw error;
   }
});
// * POST catégorie
router.post('/categorie', isAdmin,  async (req, res) => {
   try {
      const query = `INSERT INTO categories(nom) VALUES(?)`;
      const value = [req.body.nom];
      await connection.promise().query(query, value);
      res.status(200).end('Catégorie ajoutée !');
   } catch (err) {
      throw err;
   }
});
// * DELETE catégorie
// * /del-categorie?categorie=[nom]
router.delete('/categorie/:id', isAdmin, async (req, res) => {
   try {
      const nom = req.query.id_categorie;
      const query = `DELETE FROM categories WHERE id_categorie = ?`;
      await connection.promise().query(query, [nom]);
      res.status(200).end('Catégorie supprimée !');
   } catch (err) {
      throw err;
   }
});
// * Affiche tous les articles;
// * Ou seulement celui dont le nom est ciblé;
// * Ou ceux qui correspondent au filtre
router.get('/articles', async (req, res) => {
   const query = req.query;
   if (Object.keys(query).length === 0) {
      console.log('Tous les articles');
      const sql = `
       SELECT * 
       FROM articles`;
      const data = await connection.promise().query(sql);
      const articles = data[0];
      res.status(200).send(articles);
   } else if (
      Object.getOwnPropertyNames(query).filter((prop) => prop == 'id').length ==
      1
   ) {
      console.log('Un article');
      const sql = `
       SELECT * 
       FROM articles 
       WHERE id_article = ?`;
      const value = [req.query.id];
      const data = await connection.promise().query(sql, value);
      const article = data[0][0];
      res.status(201).send(article);
   } else if (
      Object.getOwnPropertyNames(query).filter((prop) => prop == 'filtre')
         .length == 1
   ) {
      console.log('Un filtre');
      const sql = `
       SELECT * 
       FROM articles AS a 
       JOIN categories AS c 
       ON c.id_categorie = a.categorie_id 
       WHERE categorie_id = ?`;
      const value = [req.query.filtre];
      const data = await connection.promise().query(sql, value);
      const articles = data[0];
      res.status(200).send(articles);
   } else {
      res.status(401).send('Demande non autorisée');
   }
});

// * Ajoute l'article défini
router.post('/article', multer, isAdmin, async (req, res) => {
   const article = JSON.parse(req.body.article);
   console.log(article);
   res.status(200).send('POST');
});

router.put('/article', checkArticle, isAdmin, async (req, res) => {
   const arrayPropArticle = [
      'id_article',
      'nom',
      'photo',
      'description',
      'prix',
      'quantite',
      'categorie_id',
   ];
   console.log(Object.getOwnPropertyNames(req.body) == arrayPropArticle);
   console.log(typeof Object.getOwnPropertyNames(req.body));
   res.status(200).send('PUT');
});

router.delete('/:id', isAdmin, async (req, res) => {
   try {
      const value = [req.params.id];
      const query = `
   DELETE FROM articles 
   WHERE id = ?`;
      await connection.promise().query(sql, value);
      res.status(200).end('Article supprimée !');
   } catch (err) {
      throw err;
   }
});

module.exports = router;
