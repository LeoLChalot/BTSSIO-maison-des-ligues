require('dotenv').config();
const { v4, validate } = require('uuid');
const express = require('express');
const app = express();
const questions = require('./questions.json');
const mysql = require('mysql2');
const axios = require('axios').default;
let cors = require('cors');
const { uuid } = require('uuidv4');
const PORT = 3000;

const connection = mysql.createConnection({
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
});

connection.connect((err) => {
   if (err) {
      console.log('Erreur de connexion : ' + err.stack);
      return;
   } else {
      console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
   }
});

app.use(express.json());

app.use(cors());

app.get('/', async (req, res) => {
   res.writeHead(200, { 'Content-Type': 'text/html' });
   res.end(`${v4()}, ${validate(v4())}`);
});

// * ROUTES USER
app.post('/inscription', cors(), async (req, res) => {
   console.log('.post/inscription');
   console.log(req.body.id_utilisateur);
   if (
      req.body.id_utilisateur != '' &&
      req.body.prenom != '' &&
      req.body.nom != '' &&
      req.body.pseudo != '' &&
      req.body.email != '' &&
      req.body.mot_de_passe != ''
   ) {
      const values = [
         req.body.id_utilisateur,
         req.body.prenom,
         req.body.nom,
         req.body.pseudo,
         req.body.email,
         req.body.mot_de_passe,
      ];
      console.log(values);
      try {
         const query = `INSERT INTO utilisateurs(id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)`;
         await connection.promise().query(query, values);
         // res.status(302).redirect('http://127.0.0.1:5173/connexion');
         res.status(200).json({ msg: 'status 200' });
      } catch {
         res.status(500).end('Informations erronées');
      }
   } else {
      res.status(501).end('Informations erronées');
   }
});

app.get('/connexion/:login', async (req, res) => {
   if (req.params.login != '') {
      const values = [req.params.login, req.params.login];

      try {
         console.log('ok');
         const query = `SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?`;
         const user = await connection.promise().query(query, values);
         res.status(200).json(user[0][0]);
      } catch {
         res.status(500).end('Informations erronées');
      }
   } else {
      res.status(501).end('Informations erronées');
   }
});

const isAdmin = async (req, res, next) => {
   console.log(req.body);
   const isAdmin = req.body.isAdmin;
   console.log(isAdmin);
   if (isAdmin == 1) {
      next();
   } else {
      console.log('status 401 - Non autorisé');
      res.status(401).send(
         'Oops il semblerait que vous ne soyez pas autorisé à vous trouver ici'
      );
   }
};

// app.use('/admin', isAdmin);

app.get('/admin', async (req, res) => {
   res.status(200).send(`Bienvenue Admin`);
});

app.get('/dashboard/:view', async (req, res) => {
   const view = req.params.view;
   res.status(200).send(`Dashboard ${view}`);
});

// * POST catégorie
/*
 ** body{"nom": "[categorie]"}
 */
app.post('/categorie', async (req, res) => {
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
app.delete('/del-categorie', async (req, res) => {
   try {
      const nom = req.query.categorie;
      const query = `DELETE FROM categories WHERE nom = ?`;
      await connection.promise().query(query, [nom]);
      res.status(200).end('Catégorie supprimée !');
   } catch (err) {
      throw err;
   }
});

// * Affiche tous les users;
// * ou seulement celui dont le pseudo est ciblé
app.get('/m2l/users', async (req, res) => {
   if (!req.query.pseudo) {
      const sql = 'SELECT * FROM utilisateurs';
      const data = await connection.promise().query(sql);
      const users = data[0];
      res.status(200).send(users);
   } else {
      const sql = `SELECT * FROM utilisateurs WHERE pseudo = ?`;
      const value = [req.query.pseudo];
      const data = await connection.promise().query(sql, value);
      const user = data[0][0];
      res.status(201).json(user);
   }
});

// * Affiche tous les articles;
// * Ou seulement celui dont le nom est ciblé;
// * Ou ceux qui correspondent au filtre
app.get('/m2l/articles', async (req, res) => {
   const query = req.query;
   if (Object.keys(query).length === 0) {
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
      const sql = `
      SELECT * 
      FROM articles AS a 
      JOIN categories AS c 
      ON c.id_categorie = a.categorie_id 
      WHERE categorie_id = ?`;
      const value = [req.query.filtre];
      const data = await connection.promise().query(sql, value);
      const user = data[0][0];
      res.status(202).json(user);
   } else {
      res.status(401).send('Demande non autorisée');
   }
});

// * Ajoute l'article défini
app.post('/m2l/article', async (req, res) => {
   try {
      const values = [
         v4(),
         req.body.nom,
         req.body.photo,
         req.body.description,
         req.body.prix,
         req.body.quantite,
         req.body.categorie_id,
      ];
      const query = `
      INSERT INTO articles 
      VALUES(?,?,?,?,?,?,?)`;
      await connection.promise().query(query, values);
      res.status(200).end('Article Ajouté !');
   } catch (err) {
      throw err;
   }
});

const checkArticle = (req, res, next) => {
   
   const params = req.body;
   (Object.getOwnPropertyNames(params).filter((prop) => prop == 'id_article').length != 0) 
      ? next()
      : res.status(400).send('Article introuvable');
};

app.put('/m2l/article', checkArticle, async (req, res) => {
   const arrayPropArticle = [
      'id_article',
      'nom',
      'photo',
      'description',
      'prix',
      'quantite',
      'categorie_id',
   ];
   console.log((Object.getOwnPropertyNames(req.body) == arrayPropArticle));
   console.log(typeof(Object.getOwnPropertyNames(req.body)));
   res.status(200).send('PUT');
});

// * Supprime l'article ciblé
app.delete('/m2l/article/:id', async (req, res) => {
   try {
      const id_article = req.params.id;
      const query = `
      DELETE FROM articles 
      WHERE id = ?`;
      await connection.promise().query(query, [id_article]);
      res.status(200).end('Article supprimée !');
   } catch (err) {
      throw err;
   }
});

// * Ajoute l'utilisateur défini
app.post('/m2l/utilisateur', async (req, res) => {
   try {
      const values = [
         v4(),
         req.body.nom,
         req.body.photo,
         req.body.description,
         req.body.prix,
         req.body.quantite,
         req.body.categorie_id,
      ];
      const query = `
      INSERT INTO articles 
      VALUES(?,?,?,?,?,?,?)`;
      await connection.promise().query(query, values);
      res.status(200).end('Article Ajouté !');
   } catch (err) {
      throw err;
   }
});

// * Supprime l'article ciblé
app.delete('/m2l/article/:id', async (req, res) => {
   try {
      const id_article = req.params.id;
      const query = `
      DELETE FROM articles 
      WHERE id = ?`;
      await connection.promise().query(query, [id_article]);
      res.status(200).end('Article supprimée !');
   } catch (err) {
      throw err;
   }
});

app.listen(PORT, () => {
   console.log(`Listen on port ${PORT}`);
});
