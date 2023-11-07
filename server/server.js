require('dotenv').config();
const express = require('express');
const app = express();
const questions = require('./questions.json');
const mysql = require('mysql2');
let cors = require('cors');
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

app.get('/', (req, res) => {
   res.writeHead(200, { 'Content-Type': 'text/html' });
   res.end(`<h1>Quizz !</h1>`);
});

// * GET ALL articles
// * /boutique?filtre=[filtre]
app.get('/boutique', async (req, res) => {
   const filtre = req.query.filtre;

   if (filtre) {
      // * S'il y a un filtre de spécifié on récupère les articles correspondants
      console.log(filtre);
      try {
         // * On récupère l'id_categorie cible
         let query = `SELECT id_categorie FROM categories WHERE nom = ?`;
         console.log(query);
         let result = await connection
            .promise()
            .query(query, [filtre.toLowerCase()]);
         const categorieId = await result[0][0]['id_categorie'];
         console.log(categorieId);

         // * On recherche les articles en fonction de l'id de la catégorie récupéré
         query = `SELECT * FROM articles WHERE categorie_id = ?`;
         console.log(query);
         const listeArticle = await connection
            .promise()
            .execute(query, [categorieId]);
         res.status(200).json(listeArticle[0][0]);
      } catch (err) {
         throw err;
      }
   } // * Sinon, tous les articles sont récupérés
   else {
      try {
         const query = `SELECT * FROM articles`;
         const result = await connection.promise().query(query);
         res.status(200).json(result[0]);
      } catch (err) {
         throw err;
      }
   }
});

app.get('/article/:id', (req, res) => {
   
});

// * POST catégorie
/*
 ** body{"nom": "[categorie]"}
 */
app.post('/add-categorie', async (req, res) => {
   try {
      const nom = req.body.nom;
      const query = `INSERT INTO categories(nom) VALUES(?)`;
      await connection.promise().query(query, [nom]);
      res.status(200).end('Catégorie ajoutée !');
   } catch (err) {
      throw err;
   }
});

// * POST article
/*
 ** body{"nom","photo", "description", "prix", "quantite"}
 */
app.post('/add-article', async (req, res) => {
   try {
      const nom = req.body.nom;
      const photo = req.body.photo;
      const description = req.body.description;
      const prix = req.body.prix;
      const quantite = req.body.quantite;
      const categorie = req.body.categorie;

      // * Récupération de categorie_id
      let query = `SELECT id_categorie FROM categories WHERE nom = ?`;
      console.log(query, categorie);
      let result = await connection.promise().query(query, [categorie]);
      const categorie_id = await result[0][0]['id_categorie'];
      console.log(categorie_id);

      const bindValues = [
         nom,
         photo,
         description,
         prix,
         quantite,
         categorie_id,
      ];
      query = `INSERT INTO articles(nom, photo, description, prix, quantite, categorie_id) VALUES(?, ?, ?, ?, ?, ?)`;
      await connection.promise().query(query, bindValues);
      res.status(200).end('Article ajoutée !');
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

app.listen(PORT, () => {
   console.log(`Listen on port ${PORT}`);
});
